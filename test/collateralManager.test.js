const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CollateralManager", function() {
  let CollateralManager, collateral, sUSD, owner;

  beforeEach(async function() {
    [owner, user] = await ethers.getSigners();
    const SynthToken = await ethers.getContractFactory("SynthToken");
    sUSD = await SynthToken.deploy("Synthetic USD", "sUSD");
    const sETH = await SynthToken.deploy("Synthetic ETH", "sETH");
    const sBTC = await SynthToken.deploy("Synthetic BTC", "sBTC");
    // Example addresses for USDC and oracles (mock or known)
    const usdc = ethers.constants.AddressZero;
    const ethFeed = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // Goerli ETH/USD
    const btcFeed = "0x0"; // placeholder
    CollateralManager = await ethers.getContractFactory("CollateralManager");
    collateral = await CollateralManager.deploy(
      sUSD.address, sETH.address, sBTC.address,
      usdc, ethFeed, btcFeed
    );
    // Transfer ownership of sUSD to collateral manager
    await sUSD.transferOwnership(collateral.address);
  });

  it("allows minting sUSD with sufficient ETH collateral", async function() {
    // Deposit 1 ETH as collateral
    await collateral.connect(owner).depositETH({ value: ethers.utils.parseEther("1") });
    // Price ~2000, CR=200%, so max sUSD mint ~ (1*2000/2) = 1000
    await collateral.connect(owner).mintSUSD(ethers.utils.parseUnits("1000", 18));
    expect(await sUSD.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("fails mint if collateral is insufficient", async function() {
    await collateral.connect(owner).depositETH({ value: ethers.utils.parseEther("0.5") });
    await expect(
      collateral.connect(owner).mintSUSD(ethers.utils.parseUnits("1000", 18))
    ).to.be.revertedWith("Insufficient collateral");
  });
});
