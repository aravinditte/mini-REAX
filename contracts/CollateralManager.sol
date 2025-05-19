// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundID, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound
    );
    function decimals() external view returns (uint8);
}

import "./SynthToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title CollateralManager
/// @dev Handles collateral deposits (ETH or USDC) and minting/burning of synthetic assets.
/// Uses Chainlink oracles for pricing:contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}.
contract CollateralManager {
    address public sUSD;
    address public sETH;
    address public sBTC;
    IERC20 public USDC;  // e.g. USDC token contract (6 decimals assumed)

    // Price feeds (Chainlink oracles)
    AggregatorV3Interface public priceETHUSD;
    AggregatorV3Interface public priceBTCUSD;

    uint256 constant COLLATERAL_RATIO = 200; // 200% collateralization (2x)

    // Collateral balances per user
    mapping(address => uint256) public collateralETH;   // in wei
    mapping(address => uint256) public collateralUSDC;  // in USDC units (assume 6 decimals)

    // Debt of user in USD (scaled by 1e18)
    mapping(address => uint256) public debtUSD;

    event DepositedETH(address indexed user, uint256 amount);
    event DepositedUSDC(address indexed user, uint256 amount);
    event Minted(address indexed user, address synth, uint256 amount);
    event Burned(address indexed user, address synth, uint256 amount);

    constructor(
        address _sUSD, address _sETH, address _sBTC,
        address _USDC, address _ethPriceFeed, address _btcPriceFeed
    ) {
        sUSD = _sUSD;
        sETH = _sETH;
        sBTC = _sBTC;
        USDC = IERC20(_USDC);
        priceETHUSD = AggregatorV3Interface(_ethPriceFeed);
        priceBTCUSD = AggregatorV3Interface(_btcPriceFeed);
    }

    /// @notice Deposit ETH as collateral
    function depositETH() external payable {
        require(msg.value > 0, "Zero ETH");
        collateralETH[msg.sender] += msg.value;
        emit DepositedETH(msg.sender, msg.value);
    }
    /// @notice Deposit USDC (must approve first)
    function depositUSDC(uint256 amount) external {
        require(amount > 0, "Zero USDC");
        USDC.transferFrom(msg.sender, address(this), amount);
        collateralUSDC[msg.sender] += amount;
        emit DepositedUSDC(msg.sender, amount);
    }

    /// @dev Internal: get latest ETH price in USD (scaled by 1e8)
    function _getETHPrice() internal view returns (uint256) {
        (, int price,,,) = priceETHUSD.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);  // e.g. 2000 * 10^8
    }
    /// @dev Internal: get latest BTC price in USD (scaled by 1e8)
    function _getBTCPrice() internal view returns (uint256) {
        (, int price,,,) = priceBTCUSD.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }
    /// @dev Convert all collateral (ETH+USDC) to USD value (scaled by 1e18).
    function _collateralValueUSD(address user) internal view returns (uint256) {
        uint256 ethVal = collateralETH[user] * _getETHPrice() / 1e8; // ETH (wei * price/1e8) -> USD*1e18
        uint256 usdcVal = collateralUSDC[user] * 1e12; // USDC (6dec) to 18dec
        return ethVal + usdcVal;
    }

    /// @notice Mint synthetic USD (sUSD) by locking collateral.
    function mintSUSD(uint256 amount) external {
        require(amount > 0, "Zero amount");
        uint256 colUSD = _collateralValueUSD(msg.sender);
        uint256 requiredCol = (debtUSD[msg.sender] + amount) * COLLATERAL_RATIO / 100;
        require(colUSD >= requiredCol, "Insufficient collateral");
        debtUSD[msg.sender] += amount;
        SynthToken(sUSD).mint(msg.sender, amount);
        emit Minted(msg.sender, sUSD, amount);
    }
    /// @notice Mint synthetic ETH (sETH)
    function mintSETH(uint256 amount) external {
        require(amount > 0, "Zero amount");
        uint256 price = _getETHPrice(); // ETH-USD price (scaled 1e8)
        uint256 debtInc = amount * price / 1e8;
        uint256 colUSD = _collateralValueUSD(msg.sender);
        uint256 requiredCol = (debtUSD[msg.sender] + debtInc) * COLLATERAL_RATIO / 100;
        require(colUSD >= requiredCol, "Insufficient collateral");
        debtUSD[msg.sender] += debtInc;
        SynthToken(sETH).mint(msg.sender, amount);
        emit Minted(msg.sender, sETH, amount);
    }
    /// @notice Mint synthetic BTC (sBTC)
    function mintSBTC(uint256 amount) external {
        require(amount > 0, "Zero amount");
        uint256 price = _getBTCPrice(); // BTC-USD price
        uint256 debtInc = amount * price / 1e8;
        uint256 colUSD = _collateralValueUSD(msg.sender);
        uint256 requiredCol = (debtUSD[msg.sender] + debtInc) * COLLATERAL_RATIO / 100;
        require(colUSD >= requiredCol, "Insufficient collateral");
        debtUSD[msg.sender] += debtInc;
        SynthToken(sBTC).mint(msg.sender, amount);
        emit Minted(msg.sender, sBTC, amount);
    }

    /// @notice Burn sUSD to reduce debt and unlock collateral
    function burnSUSD(uint256 amount) external {
        require(amount > 0 && debtUSD[msg.sender] >= amount, "Invalid burn");
        debtUSD[msg.sender] -= amount;
        SynthToken(sUSD).burn(msg.sender, amount);
        emit Burned(msg.sender, sUSD, amount);
    }
    /// @notice Burn sETH to reduce debt
    function burnSETH(uint256 amount) external {
        uint256 price = _getETHPrice();
        uint256 debtDec = amount * price / 1e8;
        require(amount > 0 && debtUSD[msg.sender] >= debtDec, "Invalid burn");
        debtUSD[msg.sender] -= debtDec;
        SynthToken(sETH).burn(msg.sender, amount);
        emit Burned(msg.sender, sETH, amount);
    }
    /// @notice Burn sBTC to reduce debt
    function burnSBTC(uint256 amount) external {
        uint256 price = _getBTCPrice();
        uint256 debtDec = amount * price / 1e8;
        require(amount > 0 && debtUSD[msg.sender] >= debtDec, "Invalid burn");
        debtUSD[msg.sender] -= debtDec;
        SynthToken(sBTC).burn(msg.sender, amount);
        emit Burned(msg.sender, sBTC, amount);
    }

    // (Further withdrawal functions could allow retrieving collateral when debt=0, omitted for brevity)
}
