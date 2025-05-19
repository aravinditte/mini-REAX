#!/bin/bash
set -e

# Paths
CIRCUIT=circuits/collateral_threshold.circom
BUILD_DIR=circuits/build
PTAU_DIR=circuits/ptau
ZKEY_DIR=circuits/zkey

# Create directories
mkdir -p $BUILD_DIR $PTAU_DIR $ZKEY_DIR

# 1. Compile circuit
circom $CIRCUIT --r1cs --wasm --sym -o $BUILD_DIR
echo "Circuit compiled."

# 2. Powers of Tau ceremony (setup)
snarkjs powersoftau new bn128 15 $PTAU_DIR/pot15_0000.ptau -v
snarkjs powersoftau contribute $PTAU_DIR/pot15_0000.ptau $PTAU_DIR/pot15_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 $PTAU_DIR/pot15_0001.ptau $PTAU_DIR/pot15_final.ptau -v
echo "Powers-of-Tau completed."

# 3. Phase 2: generate zkey (proving/verification keys)
snarkjs groth16 setup $BUILD_DIR/collateral_threshold.r1cs $PTAU_DIR/pot15_final.ptau $ZKEY_DIR/collateral_threshold_0000.zkey
snarkjs zkey contribute $ZKEY_DIR/collateral_threshold_0000.zkey $ZKEY_DIR/collateral_threshold_0001.zkey --name="Key Contributor" -v
echo "Phase 2 contributions done."

# 4. Export verification key
snarkjs zkey export verificationkey $ZKEY_DIR/collateral_threshold_0001.zkey $ZKEY_DIR/verification_key.json

# 5. Generate Solidity verifier
snarkjs zkey export solidityverifier $ZKEY_DIR/collateral_threshold_0001.zkey contracts/ZKVerifier.sol

echo "Solidity verifier (ZKVerifier.sol) generated."
