// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title AMMPool
/// @dev A simple Uniswap-style AMM with constant-product invariant (x*y=k) and fee.
contract AMMPool {
    IERC20 public token0;
    IERC20 public token1;
    uint256 public reserve0;
    uint256 public reserve1;

    uint256 public constant FEE_NUM = 997;   // 0.3% fee => 1000-3 = 997
    uint256 public constant FEE_DEN = 1000;

    mapping(address => uint256) public liquidity; // LP shares
    uint256 public totalLiquidity;

    event AddLiquidity(address indexed provider, uint256 amount0, uint256 amount1, uint256 shares);
    event RemoveLiquidity(address indexed provider, uint256 amount0, uint256 amount1);
    event Swap(address indexed trader, IERC20 inToken, uint256 amountIn, IERC20 outToken, uint256 amountOut);

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    /// @notice Add liquidity by depositing amounts of both tokens.
    function addLiquidity(uint256 amt0, uint256 amt1) external {
        require(amt0 > 0 && amt1 > 0, "Zero amounts");
        token0.transferFrom(msg.sender, address(this), amt0);
        token1.transferFrom(msg.sender, address(this), amt1);

        uint256 shares;
        if (totalLiquidity == 0) {
            shares = sqrt(amt0 * amt1);
        } else {
            // Mint liquidity shares proportionally
            shares = min(amt0 * totalLiquidity / reserve0, amt1 * totalLiquidity / reserve1);
        }
        require(shares > 0, "Insufficient liquidity minted");
        liquidity[msg.sender] += shares;
        totalLiquidity += shares;
        reserve0 += amt0;
        reserve1 += amt1;
        emit AddLiquidity(msg.sender, amt0, amt1, shares);
    }

    /// @notice Remove liquidity shares and receive underlying tokens.
    function removeLiquidity(uint256 shares) external {
        require(liquidity[msg.sender] >= shares && shares > 0, "Invalid shares");
        uint256 amt0 = shares * reserve0 / totalLiquidity;
        uint256 amt1 = shares * reserve1 / totalLiquidity;

        liquidity[msg.sender] -= shares;
        totalLiquidity -= shares;
        reserve0 -= amt0;
        reserve1 -= amt1;

        token0.transfer(msg.sender, amt0);
        token1.transfer(msg.sender, amt1);
        emit RemoveLiquidity(msg.sender, amt0, amt1);
    }

    /// @notice Swap exact amountIn of tokenIn for tokenOut, preserving x*y=k:contentReference[oaicite:7]{index=7}.
    function swap(address tokenIn, uint256 amountIn) external {
        require(amountIn > 0, "Zero amount");
        bool isToken0 = (tokenIn == address(token0));
        IERC20 inToken = isToken0 ? token0 : token1;
        IERC20 outToken = isToken0 ? token1 : token0;
        uint256 reserveIn = isToken0 ? reserve0 : reserve1;
        uint256 reserveOut = isToken0 ? reserve1 : reserve0;

        // Transfer in
        inToken.transferFrom(msg.sender, address(this), amountIn);
        // Compute output with fee
        uint256 amountInWithFee = amountIn * FEE_NUM;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * FEE_DEN + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        // Update reserves
        if (isToken0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        outToken.transfer(msg.sender, amountOut);
        emit Swap(msg.sender, inToken, amountIn, outToken, amountOut);
    }

    /// @dev Utility sqrt (Babylonian)
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) { z = y; uint x = y / 2 + 1;
            while (x < z) { z = x; x = (y / x + x) / 2; }
        } else if (y != 0) { z = 1; }
    }
    function min(uint a, uint b) internal pure returns (uint) { return a < b ? a : b; }
}
