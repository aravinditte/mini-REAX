const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBridge", function () {
  let bridge, token;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy ERC20 token
    const SyntheticToken = await ethers.getContractFactory("SyntheticToken");
    token = await SyntheticToken.deploy("Bridge Token", "BRG", owner.address);

    // Deploy bridge
    const TokenBridge = await ethers.getContractFactory("TokenBridge");
    bridge = await TokenBridge.deploy(token.address);

    // Set bridge as the collateral manager for the token
    await token.setCollateralManager(bridge.address);

    // Temporarily set collateralManager to owner for minting
    const initialMint = ethers.utils.parseUnits("1000", 18);
    await token.setCollateralManager(owner.address);
    await token.mint(owner.address, initialMint);
    await token.setCollateralManager(bridge.address);

    // Approve tokens for bridge
    await token.connect(owner).approve(bridge.address, initialMint);
  });

  it("Should bridge tokens between chains", async function () {
    const amount = ethers.utils.parseUnits("100", 18);
    const targetChainId = 137; // Polygon

    // Approve and bridge tokens
    await token.connect(owner).approve(bridge.address, amount);
    await bridge.connect(owner).bridgeTokens(amount, targetChainId);

    expect(await token.balanceOf(bridge.address)).to.equal(amount);
  });
});
