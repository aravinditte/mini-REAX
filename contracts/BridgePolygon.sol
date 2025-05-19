// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SynthToken.sol";

/// @title BridgePolygon
/// @dev Bridge contract on Polygon side (Mumbai). Mints synths when relayer calls.
contract BridgePolygon {
    address public owner;
    address public relayer;  // trusted relayer

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

    event SynthMinted(address indexed user, address token, uint256 amount);

    /// @notice Called by relayer to mint bridged synths to user on Polygon.
    function mintBridgedSynth(address user, address token, uint256 amount) external onlyRelayer {
        require(amount > 0, "Zero amount");
        SynthToken(token).mint(user, amount);
        emit SynthMinted(user, token, amount);
    }
}
