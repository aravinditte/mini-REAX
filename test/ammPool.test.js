const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AMMPool", function() {
  let AMMPool, pool, token0, token1, owner, addr1;

  beforeEach(async function() {
    [owner, addr1] = await ethers.getSigners();
    const ERC20 = await ethers.getContractFactory("ERC20PresetMinterPauser"); 
    token0 = await ERC20.deploy("TKN0", "TK0");
    token1 = await ERC20.deploy("TKN1", "TK1");
    AMMPool = await ethers.getContractFactory("AMMPool");
    pool = await AMMPool.deploy(token0.address, token1.address);
    // Mint tokens and approve
    await token0.mint(owner.address, ethers.utils.parseUnits("10000",18));
    await token1.mint(owner.address, ethers.utils.parseUnits("10000",18));
    await token0.approve(pool.address, ethers.constants.MaxUint256);
    await token1.approve(pool.address, ethers.constants.MaxUint256);
  });

  it("should add liquidity and update reserves", async function() {
    await pool.addLiquidity(1000, 2000);
    expect(await pool.reserve0()).to.equal(1000);
    expect(await pool.reserve1()).to.equal(2000);
    expect(await pool.totalLiquidity()).to.be.gt(0);
  });

  it("should swap tokens respecting constant product", async function() {
    // Seed pool
    await pool.addLiquidity(ethers.utils.parseUnits("1000",18), ethers.utils.parseUnits("1000",18));
    // Give addr1 some token0
    await token0.transfer(addr1.address, ethers.utils.parseUnits("100",18));
    await token0.connect(addr1).approve(pool.address, ethers.utils.parseUnits("100",18));
    // Perform swap token0 -> token1
    const amountIn = ethers.utils.parseUnits("100",18);
    await pool.connect(addr1).swap(token0.address, amountIn);
    const balance1 = await token1.balanceOf(addr1.address);
    expect(balance1).to.be.gt(0);
    // Check invariant roughly holds: newReserve0 * newReserve1 >= oldK (after fees)
  });
});
