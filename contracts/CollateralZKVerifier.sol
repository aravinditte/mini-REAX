// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ZKVerifier.sol";

/**
 * @title CollateralZKVerifier
 * @notice Synthetic asset token with ZK collateral verification on mint.
 */
contract CollateralZKVerifier is ERC20 {
    ZKVerifier public zkVerifier;
    uint256 public constant MINT_AMOUNT = 100 * (10 ** 18);  // 100 tokens per valid proof

    constructor(address _verifierAddress) ERC20("SynthToken", "SYN") {
        zkVerifier = ZKVerifier(_verifierAddress);
    }

    /**
     * @notice Mint synthetic tokens if user can prove collateral >= threshold.
     * @param a Proof component a
     * @param b Proof component b
     * @param c Proof component c
     * @param threshold Public threshold input used in the proof
     */
    function mintSynth(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256 threshold
    ) public {
        // Prepare public inputs array: [threshold, 1]
        uint256[] memory pubInputs = new uint256[](2);
        pubInputs[0] = threshold;
        pubInputs[1] = 1;  // The circuit's isAbove output should be 1

        // Verify the ZK proof
        bool valid = zkVerifier.verifyProof(a, b, c, pubInputs);
        require(valid, "CollateralZKVerifier: invalid proof");

        // Mint synthetic tokens to sender
        _mint(msg.sender, MINT_AMOUNT);
    }
}
