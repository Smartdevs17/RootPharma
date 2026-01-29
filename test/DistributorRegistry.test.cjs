const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("DistributorRegistry", function () {
  async function deployFixture() {
    const [owner, distributor, otherAccount] = await ethers.getSigners();

    const DistributorRegistry = await ethers.getContractFactory("DistributorRegistry");
    const registry = await DistributorRegistry.deploy();

    return { registry, owner, distributor, otherAccount };
  }

  describe("Registration", function () {
    it("Should register a distributor successfully", async function () {
      const { registry, owner, distributor } = await loadFixture(deployFixture);
      
      const name = "Logistics Co";
      const license = "LIC-999";
      const region = "EU";

      await expect(registry.connect(owner).registerDistributor(
        name, license, region, distributor.address
      )).to.emit(registry, "DistributorRegistered")
        .withArgs(1, name);

      const d = await registry.getDistributor(1);
      expect(d.name).to.equal(name);
      expect(d.walletAddress).to.equal(distributor.address);
      expect(d.isVerified).to.be.false;
      expect(d.isActive).to.be.true;
    });

    it("Should fail if non-owner tries to register", async function () {
      const { registry, otherAccount, distributor } = await loadFixture(deployFixture);
      
      await expect(registry.connect(otherAccount).registerDistributor(
        "Fake", "123", "USA", distributor.address
      )).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });
  });

  describe("Verification", function () {
    it("Should verify a distributor", async function () {
      const { registry, owner, distributor } = await loadFixture(deployFixture);
      await registry.registerDistributor("Logistics", "1", "EU", distributor.address);
      
      await expect(registry.verifyDistributor(1))
        .to.emit(registry, "DistributorVerified")
        .withArgs(1);
        
      expect(await registry.isVerifiedDistributor(distributor.address)).to.be.true;
    });
  });
});
