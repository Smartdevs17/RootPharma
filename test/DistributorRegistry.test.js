import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("DistributorRegistry", function () {
  async function deployFixture() {
    const [owner, distributor1, distributor2, other] = await ethers.getSigners();
    
    const DistributorRegistry = await ethers.getContractFactory("DistributorRegistry");
    const registry = await DistributorRegistry.deploy();
    
    return { registry, owner, distributor1, distributor2, other };
  }
  
  describe("Registration", function () {
    it("Should register a distributor successfully", async function () {
      const { registry, distributor1 } = await loadFixture(deployFixture);
      
      await expect(registry.registerDistributor(
        "Global Logistics",
        "LIC-123456",
        "North America",
        distributor1.address
      )).to.emit(registry, "DistributorRegistered")
        .withArgs(1, "Global Logistics");
      
      const distributor = await registry.getDistributor(1);
      expect(distributor.name).to.equal("Global Logistics");
      expect(distributor.walletAddress).to.equal(distributor1.address);
      expect(distributor.isVerified).to.be.false;
      expect(distributor.isActive).to.be.true;
    });
    
    it("Should fail if address already registered", async function () {
      const { registry, distributor1 } = await loadFixture(deployFixture);
      
      await registry.registerDistributor("Dist 1", "L1", "R1", distributor1.address);
      
      await expect(
        registry.registerDistributor("Dist 2", "L2", "R2", distributor1.address)
      ).to.be.revertedWith("Already registered");
    });
  });
  
  describe("Verification", function () {
    it("Should verify a distributor", async function () {
      const { registry, distributor1 } = await loadFixture(deployFixture);
      
      await registry.registerDistributor("Dist 1", "L1", "R1", distributor1.address);
      await expect(registry.verifyDistributor(1))
        .to.emit(registry, "DistributorVerified")
        .withArgs(1);
      
      expect(await registry.isVerifiedDistributor(distributor1.address)).to.be.true;
    });
  });
  
  describe("Delivery Recording", function () {
    it("Should allow distributor to record delivery", async function () {
      const { registry, distributor1 } = await loadFixture(deployFixture);
      
      await registry.registerDistributor("Dist 1", "L1", "R1", distributor1.address);
      await expect(registry.connect(distributor1).recordDelivery(1))
        .to.emit(registry, "DeliveryRecorded")
        .withArgs(1);
      
      const distributor = await registry.getDistributor(1);
      expect(distributor.totalDeliveries).to.equal(1);
    });
    
    it("Should fail if unauthorized records delivery", async function () {
      const { registry, distributor1, other } = await loadFixture(deployFixture);
      
      await registry.registerDistributor("Dist 1", "L1", "R1", distributor1.address);
      await expect(
        registry.connect(other).recordDelivery(1)
      ).to.be.revertedWith("Unauthorized");
    });
  });
  
  describe("Deactivation", function () {
    it("Should deactivate a distributor", async function () {
      const { registry, distributor1 } = await loadFixture(deployFixture);
      
      await registry.registerDistributor("Dist 1", "L1", "R1", distributor1.address);
      await registry.verifyDistributor(1);
      
      await expect(registry.deactivateDistributor(1))
        .to.emit(registry, "DistributorDeactivated")
        .withArgs(1);
      
      expect(await registry.isVerifiedDistributor(distributor1.address)).to.be.false;
    });
  });
});
