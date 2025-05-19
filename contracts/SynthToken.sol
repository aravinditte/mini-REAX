// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SynthToken
/// @dev ERC20 token for synthetic assets (sUSD, sETH, sBTC). Only the owner (CollateralManager) can mint/burn.
contract SynthToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /// @notice Mint new tokens (onlyOwner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    /// @notice Burn tokens from an account (onlyOwner)
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
