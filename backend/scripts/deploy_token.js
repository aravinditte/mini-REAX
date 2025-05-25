
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying sUSD with account:", deployer.address);
  
  // Check balance before deployment
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  if (balance.isZero()) {
    throw new Error("Deployer account has no funds! Please use a funded account.");
  }

  const SyntheticToken = await hre.ethers.getContractFactory("SyntheticToken");
  const sUSD = await SyntheticToken.deploy("sUSD", "sUSD", deployer.address);
  await sUSD.deployed();

  console.log("sUSD deployed to:", sUSD.address);
  console.log("Save this address to your .env as LOCAL_SUSD_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
