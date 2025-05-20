// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./SyntheticToken.sol";

contract CollateralManager is Ownable {
    struct Position {
        uint256 ethCollateral;
        uint256 usdcCollateral;
        mapping(address => uint256) syntheticBalances;
    }
    
    uint256 public constant COLLATERAL_RATIO = 150; // 150%
    address public immutable usdcToken;
    
    SyntheticToken public syntheticUSD;
    SyntheticToken public syntheticETH;
    SyntheticToken public syntheticBTC;
    
    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal btcPriceFeed;
    
    mapping(address => Position) public positions;

    event CollateralDeposited(address indexed user, address indexed token, uint256 amount);
    event SyntheticMinted(address indexed user, address indexed syntheticToken, uint256 amount);

    constructor(
        address _usdc,
        address _ethPriceFeed,
        address _btcPriceFeed,
        address _sUSD,
        address _sETH,
        address _sBTC
    ) {
        usdcToken = _usdc;
        ethPriceFeed = AggregatorV3Interface(_ethPriceFeed);
        btcPriceFeed = AggregatorV3Interface(_btcPriceFeed);
        syntheticUSD = SyntheticToken(_sUSD);
        syntheticETH = SyntheticToken(_sETH);
        syntheticBTC = SyntheticToken(_sBTC);
    }

    function depositETH() external payable {
        positions[msg.sender].ethCollateral += msg.value;
        emit CollateralDeposited(msg.sender, address(0), msg.value);
    }

    function mintSynthetic(address syntheticToken, uint256 amount) external {
        require(_isValidSynthetic(syntheticToken), "Invalid synthetic token");
        require(_checkCollateralRatio(msg.sender, syntheticToken, amount), "Insufficient collateral");
        
        SyntheticToken(syntheticToken).mint(msg.sender, amount);
        positions[msg.sender].syntheticBalances[syntheticToken] += amount;
        emit SyntheticMinted(msg.sender, syntheticToken, amount);
    }

    // Additional helper functions and security checks
    function _checkCollateralRatio(address user, address syntheticToken, uint256 amount) internal view returns (bool) {
        uint256 totalCollateralValue = _calculateCollateralValue(user);
        uint256 syntheticValue = _calculateSyntheticValue(syntheticToken, amount);
        return (totalCollateralValue * 100) >= (syntheticValue * COLLATERAL_RATIO);
    }

    function _calculateCollateralValue(address user) internal view returns (uint256) {
        (, int256 ethPrice,,,) = ethPriceFeed.latestRoundData();
        return (positions[user].ethCollateral * uint256(ethPrice)) / 1e8 +
               (positions[user].usdcCollateral * 1e12); // USDC 6 decimals to 18
    }

    function _calculateSyntheticValue(address syntheticToken, uint256 amount) internal view returns (uint256) {
        if (syntheticToken == address(syntheticBTC)) {
            (, int256 btcPrice,,,) = btcPriceFeed.latestRoundData();
            return (amount * uint256(btcPrice)) / 1e8;
        }
        return amount; // sUSD and sETH are 1:1 with USD
    }

    function _isValidSynthetic(address token) internal view returns (bool) {
        return token == address(syntheticUSD) || 
               token == address(syntheticETH) || 
               token == address(syntheticBTC);
    }
}
