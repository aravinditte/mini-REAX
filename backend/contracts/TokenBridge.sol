// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBridge {
    IERC20 public immutable token;
    uint256 public chainId;
    mapping(bytes32 => bool) public processedTransactions;

    event TokensBridged(address indexed sender, uint256 amount, uint256 targetChain);
    event TokensReceived(address indexed recipient, uint256 amount, uint256 sourceChain);

    constructor(address _token) {
        token = IERC20(_token);
        chainId = block.chainid;
    }

    function bridgeTokens(uint256 amount, uint256 targetChain) external {
        token.transferFrom(msg.sender, address(this), amount);
        emit TokensBridged(msg.sender, amount, targetChain);
    }

    function receiveTokens(address recipient, uint256 amount, uint256 sourceChain, bytes32 txHash) external {
        require(!processedTransactions[txHash], "Already processed");
        processedTransactions[txHash] = true;
        token.transfer(recipient, amount);
        emit TokensReceived(recipient, amount, sourceChain);
    }
}
