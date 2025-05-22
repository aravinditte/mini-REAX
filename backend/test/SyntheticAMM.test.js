const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SyntheticAMM", function () {
  let amm, tokenA, tokenB;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy tokens
    const SyntheticToken = await ethers.getContractFactory("SyntheticToken");
    tokenA = await SyntheticToken.deploy("TokenA", "TA", owner.address);
    tokenB = await SyntheticToken.deploy("TokenB", "TB", owner.address);

    // Deploy AMM
    const SyntheticAMM = await ethers.getContractFactory("SyntheticAMM");
    amm = await SyntheticAMM.deploy(tokenA.address, tokenB.address);

    // Set AMM as the collateral manager for both tokens
    await tokenA.setCollateralManager(amm.address);
    await tokenB.setCollateralManager(amm.address);

    // Mint tokens to owner via AMM (call mint from AMM using owner as recipient)
    // Use the AMM's address as the caller, so we need to call mint as if from the AMM.
    // Since tests can't impersonate contracts, we'll add a helper function to AMM for test purposes
    // OR use OpenZeppelin's Ownable to temporarily transfer ownership to AMM for minting, then transfer back
    // But for simplicity in tests, let's add a public mintForTest function to SyntheticToken for testing only.

    // Instead, we can use a workaround: temporarily set the collateralManager to the owner, mint, then set it to AMM.
    // (This is safe in test environment.)
    const initialMint = ethers.utils.parseUnits("10000", 18);

    // Temporarily set collateralManager to owner for minting
    await tokenA.setCollateralManager(owner.address);
    await tokenA.mint(owner.address, initialMint);
    await tokenA.setCollateralManager(amm.address);

    await tokenB.setCollateralManager(owner.address);
    await tokenB.mint(owner.address, initialMint);
    await tokenB.setCollateralManager(amm.address);

    // Approve tokens for AMM
    await tokenA.connect(owner).approve(amm.address, initialMint);
    await tokenB.connect(owner).approve(amm.address, initialMint);
  });

  it("Should add liquidity and swap tokens", async function () {
    // Add initial liquidity
    await amm.addLiquidity(
      ethers.utils.parseUnits("1000", 18),
      ethers.utils.parseUnits("1000", 18)
    );

    // Perform swap
    const swapAmount = ethers.utils.parseUnits("100", 18);
    await tokenA.connect(owner).approve(amm.address, swapAmount);
    await amm.swap(tokenA.address, swapAmount);

    // You can add assertions here if your AMM exposes reserve info or balances
    expect(await tokenA.balanceOf(owner.address)).to.be.lt(ethers.utils.parseUnits("9000", 18));
  });
});
