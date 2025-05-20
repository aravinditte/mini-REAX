import { HardhatRuntimeEnvironment } from "hardhat/types";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  // Deploy mock price feeds
  const ethPriceFeed = await deploy("MockETHPriceFeed", {
    from: deployer,
    args: [2000e8], // $2000 initial price
  });

  const sUSD = await deploy("SyntheticToken", {
    from: deployer,
    args: ["Synthetic USD", "sUSD"],
  });

  const collateralManager = await deploy("CollateralManager", {
    from: deployer,
    args: [
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC mainnet address
      ethPriceFeed.address,
      "0x...", // BTC price feed address
      sUSD.address,
      "0x...", // sETH address
      "0x...", // sBTC address
    ],
  });

  // Save deployment artifacts
  const deploymentsDir = join(__dirname, "../deployments", networkName);
  mkdirSync(deploymentsDir, { recursive: true });

  const deploymentData = {
    network: networkName,
    contracts: {
      CollateralManager: {
        address: collateralManager.address,
        abi: JSON.parse(collateralManager.abi),
      },
      SyntheticUSD: {
        address: sUSD.address,
        abi: JSON.parse(sUSD.abi),
      }
    }
  };

  writeFileSync(
    join(deploymentsDir, "deployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );
}
