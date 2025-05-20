import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import fc from "fast-check";

describe("AMM Fuzzing Tests", () => {
  async function deployAMMFixture() {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("SyntheticToken");
    const tokenA = await Token.deploy("TokenA", "TA");
    const tokenB = await Token.deploy("TokenB", "TB");
    
    const AMM = await ethers.getContractFactory("SyntheticAMM");
    const amm = await AMM.deploy(tokenA.address, tokenB.address);
    
    return { amm, tokenA, tokenB, owner, user };
  }

  it("should maintain constant product invariant", async () => {
    const { amm, tokenA, tokenB } = await loadFixture(deployAMMFixture);
    
    await fc.assert(fc.asyncProperty(
      fc.integer({ min: 1, max: 1000000 }),
      async (swapAmount) => {
        // Add initial liquidity
        await tokenA.approve(amm.address, 1000000);
        await tokenB.approve(amm.address, 1000000);
        await amm.addLiquidity(1000000, 1000000);
        
        // Perform swap
        const amountIn = ethers.utils.parseUnits(swapAmount.toString());
        await tokenA.approve(amm.address, amountIn);
        
        const initialReserves = await amm.getReserves();
        await amm.swap(tokenA.address, amountIn);
        const newReserves = await amm.getReserves();
        
        const kBefore = initialReserves[0].mul(initialReserves[1]);
        const kAfter = newReserves[0].mul(newReserves[1]);
        
        expect(kAfter).to.be.closeTo(
          kBefore,
          kBefore.div(100) // Allow 1% deviation due to fees
        );
      }
    ));
  });
});
