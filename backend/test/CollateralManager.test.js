const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CollateralManager", function () {
  let collateralManager, sUSD, ethPriceFeed;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy mock price feed
    const MockAggregator = await ethers.getContractFactory("MockV3Aggregator");
    ethPriceFeed = await MockAggregator.deploy(8, 2000e8); // $2000 ETH

    // Deploy synthetic token
    const SyntheticToken = await ethers.getContractFactory("SyntheticToken");
    sUSD = await SyntheticToken.deploy("Synthetic USD", "sUSD", owner.address);

    // Deploy CollateralManager
    const CollateralManager = await ethers.getContractFactory("CollateralManager");
    collateralManager = await CollateralManager.deploy(
      ethers.constants.AddressZero,
      ethPriceFeed.address,
      ethers.constants.AddressZero,
      sUSD.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero
    );

    // Set collateral manager
    await sUSD.setCollateralManager(collateralManager.address);
  });

  it("Should deposit ETH and mint sUSD", async function () {
    const depositAmount = ethers.utils.parseEther("1");

    // Deposit ETH
    await collateralManager.connect(user).depositETH({ value: depositAmount });

    // Mint sUSD (1 ETH * $2000 / 150% ratio = 1333.33 sUSD)
    const mintAmount = ethers.utils.parseUnits("1333", 18);
    await collateralManager.connect(user).mintSynthetic(sUSD.address, mintAmount);

    expect(await sUSD.balanceOf(user.address)).to.equal(mintAmount);
  });
});
