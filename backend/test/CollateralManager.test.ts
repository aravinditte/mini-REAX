import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("CollateralManager", () => {
  let collateralManager: Contract;
  let sUSD: Contract;
  let ethPriceFeed: Contract;

  beforeEach(async () => {
    const EthPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    ethPriceFeed = await EthPriceFeed.deploy(2000e8); // $2000 ETH
    
    const SyntheticToken = await ethers.getContractFactory("SyntheticToken");
    sUSD = await SyntheticToken.deploy("sUSD", "sUSD");
    
    const CollateralManager = await ethers.getContractFactory("CollateralManager");
    collateralManager = await CollateralManager.deploy(
      ethers.constants.AddressZero,
      ethPriceFeed.address,
      ethers.constants.AddressZero,
      sUSD.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero
    );
    
    await sUSD.setCollateralManager(collateralManager.address);
  });

  it("should deposit ETH and mint sUSD", async () => {
    const [user] = await ethers.getSigners();
    const depositAmount = ethers.utils.parseEther("1");
    
    await collateralManager.connect(user).depositETH({ value: depositAmount });
    await collateralManager.connect(user).mintSynthetic(sUSD.address, depositAmount);
    
    expect(await sUSD.balanceOf(user.address)).to.equal(depositAmount);
  });
});
