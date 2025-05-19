const { ethers } = require("hardhat");

async function main() {
  // Deploy verifier (stub or generated)
  const Verifier = await ethers.getContractFactory("ZKVerifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  // Deploy synthetic asset contract
  const Synth = await ethers.getContractFactory("CollateralZKVerifier");
  const synth = await Synth.deploy(verifier.address);
  await synth.deployed();

  console.log("ZKVerifier deployed at:", verifier.address);
  console.log("CollateralZKVerifier (Synth) deployed at:", synth.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
