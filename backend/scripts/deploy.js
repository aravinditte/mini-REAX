const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy MockV3Aggregator for ETH price feed
  const MockV3Aggregator = await hre.ethers.getContractFactory("MockV3Aggregator");
  const ethPriceFeed = await MockV3Aggregator.deploy(8, 2000e8);
  await ethPriceFeed.deployed();
  console.log("MockV3Aggregator (ETH price feed) deployed to:", ethPriceFeed.address);

  // 2. Deploy SyntheticToken (sUSD)
  const SyntheticToken = await hre.ethers.getContractFactory("SyntheticToken");
  const sUSD = await SyntheticToken.deploy("sUSD", "sUSD", deployer.address);
  await sUSD.deployed();
  console.log("sUSD deployed to:", sUSD.address);

  // 3. Deploy CollateralManager
  const CollateralManager = await hre.ethers.getContractFactory("CollateralManager");
  const collateralManager = await CollateralManager.deploy(
    hre.ethers.constants.AddressZero, // USDC address (mocked as zero)
    ethPriceFeed.address,             // ETH price feed
    hre.ethers.constants.AddressZero, // BTC price feed (mocked as zero)
    sUSD.address,                     // sUSD
    hre.ethers.constants.AddressZero, // sETH (mocked as zero)
    hre.ethers.constants.AddressZero  // sBTC (mocked as zero)
  );
  await collateralManager.deployed();
  console.log("CollateralManager deployed to:", collateralManager.address);

  // 4. Set CollateralManager as minter for sUSD
  await sUSD.setCollateralManager(collateralManager.address);
  console.log("CollateralManager set as sUSD minter");

  // You can add more deployments here (e.g., AMM, Bridge) as needed
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
