// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SyntheticToken is ERC20, Ownable {
    address public collateralManager;

    constructor(
        string memory name, 
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {}

    modifier onlyCollateralManager() {
        require(msg.sender == collateralManager, "Unauthorized");
        _;
    }

    function setCollateralManager(address _manager) external onlyOwner {
        collateralManager = _manager;
    }

    function mint(address to, uint256 amount) external onlyCollateralManager {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyCollateralManager {
        _burn(from, amount);
    }
}
