/** @type import('hardhat/config').HardhatUserConfig */
// hardhat.config.ts
// import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-verify";
require("hardhat-deploy");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.28",
};
