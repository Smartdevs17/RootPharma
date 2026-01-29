const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ManufacturerRegistry", function () {
  async function deployFixture() {
    const [owner, manufacturer, otherAccount] = await ethers.getSigners();

    const ManufacturerRegistry = await ethers.getContractFactory("ManufacturerRegistry");
    const registry = await ManufacturerRegistry.deploy();

    return { registry, owner, manufacturer, otherAccount };
  }

  describe("Registration", function () {
    it("Should register a manufacturer successfully", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployFixture);
      
      const companyName = "BioPharma Inc";
      const regNumber = "REG-123456";
      const country = "USA";
      const gmpCert = "GMP-HASH-789";
      const email = "contact@biopharma.com";

      await expect(registry.connect(owner).registerManufacturer(
        companyName,
        regNumber,
        country,
        manufacturer.address,
        gmpCert,
        email
      )).to.emit(registry, "ManufacturerRegistered")
        .withArgs(1, companyName, manufacturer.address);

      const m = await registry.getManufacturer(1);
      expect(m.companyName).to.equal(companyName);
      expect(m.walletAddress).to.equal(manufacturer.address);
      expect(m.isVerified).to.be.false;
      expect(m.isActive).to.be.true;
    });

    it("Should fail if non-owner tries to register", async function () {
      const { registry, otherAccount, manufacturer } = await loadFixture(deployFixture);
      
      await expect(registry.connect(otherAccount).registerManufacturer(
        "Fake", "123", "USA", manufacturer.address, "cert", "email"
      )).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });

    it("Should fail if address already registered", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer("Corp1", "1", "USA", manufacturer.address, "c", "e");
      
      await expect(registry.registerManufacturer(
        "Corp2", "2", "UK", manufacturer.address, "cc", "ee"
      )).to.be.revertedWith("Already registered");
    });
  });

  describe("Verification & Audit", function () {
    const companyName = "BioPharma Inc";

    it("Should verify a manufacturer", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployFixture);
      await registry.registerManufacturer(companyName, "1", "USA", manufacturer.address, "c", "e");
      
      await expect(registry.verifyManufacturer(1))
        .to.emit(registry, "ManufacturerVerified")
        .withArgs(1);
        
      expect(await registry.isVerifiedManufacturer(manufacturer.address)).to.be.true;
    });

    it("Should record an audit", async function () {
      const { registry, owner, manufacturer } = await loadFixture(deployFixture);
      await registry.registerManufacturer(companyName, "1", "USA", manufacturer.address, "c", "e");
      
      await expect(registry.recordAudit(1))
        .to.emit(registry, "ManufacturerAudited")
        .withArgs(1, anyValue);
        
      const m = await registry.getManufacturer(1);
      expect(m.lastAuditDate).to.be.greaterThan(0);
    });
  });

  describe("Batch Tracking", function () {
    it("Should increment batch count by manufacturer", async function () {
      const { registry, manufacturer } = await loadFixture(deployFixture);
      await registry.registerManufacturer("Bio", "1", "USA", manufacturer.address, "c", "e");
      
      await expect(registry.connect(manufacturer).incrementBatchCount(1))
        .to.emit(registry, "BatchProduced")
        .withArgs(1, 1);
        
      const m = await registry.getManufacturer(1);
      expect(m.totalBatchesProduced).to.equal(1);
    });

    it("Should fail if unauthorized account increments", async function () {
      const { registry, otherAccount, manufacturer } = await loadFixture(deployFixture);
      await registry.registerManufacturer("Bio", "1", "USA", manufacturer.address, "c", "e");
      
      await expect(registry.connect(otherAccount).incrementBatchCount(1))
        .to.be.revertedWith("Unauthorized");
    });
  });
});
