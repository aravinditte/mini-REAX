
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SyntheticAMM", function () {
  async function deployAMMFixture() {
    const [owner, user] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("SyntheticToken");
    const tokenA = await Token.deploy("TokenA", "TA");
    const tokenB = await Token.deploy("TokenB", "TB");

    const AMM = await ethers.getContractFactory("SyntheticAMM");
    const amm = await AMM.deploy(tokenA.address, tokenB.address);

    return { amm, tokenA, tokenB, owner, user };
  }

  it("Should add liquidity and swap tokens", async function () {
    const { amm, tokenA, tokenB } = await loadFixture(deployAMMFixture);
    
    // Approve tokens
    await tokenA.approve(amm.address, 1000);
    await tokenB.approve(amm.address, 1000);

    // Add liquidity
    await amm.addLiquidity(1000, 1000);
    
    // Verify reserves
    const [reserve0, reserve1] = await amm.getReserves();
    expect(reserve0).to.equal(1000);
    expect(reserve1).to.equal(1000);

    // Perform swap
    await tokenA.approve(amm.address, 100);
    await amm.swap(tokenA.address, 100);
    
    // Verify new reserves
    const [newReserve0, newReserve1] = await amm.getReserves();
    expect(newReserve0).to.equal(1100);
    expect(newReserve1).to.be.lessThan(1000);
  });
});
