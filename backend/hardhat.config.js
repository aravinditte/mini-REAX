require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config(); // Load .env variables

// Read from .env ONLY - no hardcoded fallbacks for sensitive data
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "http://127.0.0.1:8545";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "http://127.0.0.1:8546";

// Validate that required environment variables are set
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is required in .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 1000 },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 20,
        accountsBalance: "10000000000000000000000", // 10000 ETH
      },
    },
    localhost: {
      url: ETHEREUM_RPC_URL,
      accounts: [PRIVATE_KEY], // From .env only
      chainId: 31337,
    },
    localhost2: {
      url: POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY], // From .env only
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: { default: 0 },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deployments: "./deployments",
  },
  mocha: { timeout: 60000 },
};
