// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SynthToken.sol";

/// @title BridgeETH
/// @dev Bridge contract on Ethereum side (Goerli). Burns synthetics and emits events for relayer.
contract BridgeETH {
    address public owner;
    address public relayer;  // authorized relayer address (e.g. server)
    event SynthBridged(address indexed user, address token, uint256 amount, uint256 destChain);

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Not relayer");
        _;
    }

    constructor(address _relayer) {
        owner = msg.sender;
        relayer = _relayer;
    }
    function updateRelayer(address newRelayer) external {
        require(msg.sender == owner, "Not owner");
        relayer = newRelayer;
    }

    /// @notice User burns synth on Ethereum to bridge to Polygon (Mumbai).
    /// @param token The synthetic token address (sUSD, sETH, or sBTC on Ethereum).
    /// @param amount Amount of tokens to bridge.
    function bridgeToPolygon(address token, uint256 amount) external {
        require(amount > 0, "Zero amount");
        // User must approve this contract to burn their tokens
        SynthToken(token).burn(msg.sender, amount);
        // Emit event for relayer to pick up (destChain=80001 for Mumbai)
        emit SynthBridged(msg.sender, token, amount, 80001);
    }
}
