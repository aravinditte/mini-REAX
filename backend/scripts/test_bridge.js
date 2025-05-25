const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const bridgeAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const token = await hre.ethers.getContractAt("SyntheticToken", tokenAddress);
  const bridge = await hre.ethers.getContractAt("TokenBridge", bridgeAddress);
  
  await token.mint(signer.address, hre.ethers.utils.parseEther("1000"));
  await token.approve(bridgeAddress, hre.ethers.utils.parseEther("100"));
  
  console.log("Bridging 100 tokens...");
  const tx = await bridge.bridgeTokens(
    hre.ethers.utils.parseEther("100"),
    31337
  );
  
  console.log("Bridge transaction:", tx.hash);
  await tx.wait();
  console.log("Bridge transaction confirmed!");
}

main().catch(console.error);
