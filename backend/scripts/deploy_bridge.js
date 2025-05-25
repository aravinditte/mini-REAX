const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenBridge with account:", deployer.address);
  
  // Check balance before deployment
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  let tokenAddress;
  const network = hre.network.name;

  if (network === "polygon") {
    tokenAddress = process.env.POLYGON_SUSD_ADDRESS || "";
  } else if (network === "localhost" || network === "hardhat") {
    tokenAddress = process.env.LOCAL_SUSD_ADDRESS || "";
  } else {
    throw new Error("Set tokenAddress for this network in .env or deploy_bridge.js");
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    throw new Error(
      `Invalid token address! Please set ${
        network === "polygon" ? "POLYGON_SUSD_ADDRESS" : "LOCAL_SUSD_ADDRESS"
      } in your .env file. Deploy sUSD first using deploy_token.js`
    );
  }

  console.log("Using token address:", tokenAddress);

  const TokenBridge = await hre.ethers.getContractFactory("TokenBridge");
  const bridge = await TokenBridge.deploy(tokenAddress);
  await bridge.deployed();

  console.log("TokenBridge deployed to:", bridge.address);
  console.log("Save this address to your .env as SOURCE_BRIDGE_ADDRESS or DEST_BRIDGE_ADDRESS");

  // Optionally, save deployment info
  const outputPath = path.join(__dirname, "..", "deployments", network, "TokenBridge.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ address: bridge.address, token: tokenAddress }, null, 2)
  );
  console.log(`Deployment info saved to ${outputPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
