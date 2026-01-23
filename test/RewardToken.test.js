import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("RewardToken", function () {
  async function deployFixture() {
    const [owner, minter, user1, user2] = await ethers.getSigners();
    
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const token = await RewardToken.deploy();
    
    return { token, owner, minter, user1, user2 };
  }
  
  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      const { token } = await loadFixture(deployFixture);
      
      expect(await token.name()).to.equal("RootPharma Reward Token");
      expect(await token.symbol()).to.equal("RPRT");
    });
    
    it("Should set max supply", async function () {
      const { token } = await loadFixture(deployFixture);
      
      expect(await token.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000000"));
    });
  });
  
  describe("Minting", function () {
    it("Should allow minter to mint", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);
      
      await token.addMinter(minter.address);
      
      await expect(token.connect(minter).mintRewards(user1.address, ethers.parseEther("100")))
        .to.emit(token, "RewardsMinted")
        .withArgs(user1.address, ethers.parseEther("100"));
      
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("100"));
    });
    
    it("Should fail if not minter", async function () {
      const { token, user1, user2 } = await loadFixture(deployFixture);
      
      await expect(
        token.connect(user1).mintRewards(user2.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Not authorized to mint");
    });
    
    it("Should fail if exceeds max supply", async function () {
      const { token, user1 } = await loadFixture(deployFixture);
      
      // Attempt to mint more than MAX_SUPPLY
      const overAmount = ethers.parseEther("1000000001");
      await expect(
        token.mintRewards(user1.address, overAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });
  });
  
  describe("Burning", function () {
    it("Should allow burning", async function () {
      const { token, user1 } = await loadFixture(deployFixture);
      
      await token.mintRewards(user1.address, ethers.parseEther("100"));
      
      await expect(token.connect(user1).burn(ethers.parseEther("50")))
        .to.emit(token, "Transfer");
      
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("50"));
    });
  });
});
