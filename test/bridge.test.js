const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bridge Contracts", function() {
  let BridgeETH, BridgePolygon, synth, bridgeETH, bridgePoly, owner, relayer;

  beforeEach(async function() {
    [owner, relayer, user] = await ethers.getSigners();
    const SynthToken = await ethers.getContractFactory("SynthToken");
    synth = await SynthToken.deploy("Synthetic", "SYN");
    // Deploy bridges
    BridgeETH = await ethers.getContractFactory("BridgeETH");
    BridgePolygon = await ethers.getContractFactory("BridgePolygon");
    bridgeETH = await BridgeETH.deploy(relayer.address);
    bridgePoly = await BridgePolygon.deploy(relayer.address);
    // Owner mints synth to user and approves bridge
    await synth.transferOwnership(bridgeETH.address);
    await synth.mint(user.address, 1000);
    await synth.connect(user).approve(bridgeETH.address, 500);
  });

  it("should emit event on bridgeToPolygon", async function() {
    await expect(bridgeETH.connect(user).bridgeToPolygon(synth.address, 500))
      .to.emit(bridgeETH, "SynthBridged")
      .withArgs(user.address, synth.address, 500, 80001);
  });

  it("relayer can mint on Polygon", async function() {
    // Simulate event and relayer action
    await bridgeETH.connect(user).bridgeToPolygon(synth.address, 100);
    // Relayer mints on Polygon (we transfer ownership to Polygon bridge)
    await synth.transferOwnership(bridgePoly.address);
    await expect(bridgePoly.connect(relayer).mintBridgedSynth(user.address, synth.address, 100))
      .to.emit(bridgePoly, "SynthMinted")
      .withArgs(user.address, synth.address, 100);
  });
});
