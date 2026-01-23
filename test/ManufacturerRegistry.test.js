import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("ManufacturerRegistry", function () {
  async function deployFixture() {
    const [owner, manufacturer1, manufacturer2, unauthorized] = await ethers.getSigners();
    
    const ManufacturerRegistry = await ethers.getContractFactory("ManufacturerRegistry");
    const registry = await ManufacturerRegistry.deploy();
    
    return { registry, owner, manufacturer1, manufacturer2, unauthorized };
  }
  
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { registry, owner } = await loadFixture(deployFixture);
      expect(await registry.owner()).to.equal(owner.address);
    });
    
    it("Should start with counter at 1", async function () {
      const { registry } = await loadFixture(deployFixture);
      expect(await registry.getTotalManufacturers()).to.equal(0);
    });
  });
  
  describe("Manufacturer Registration", function () {
    it("Should register a manufacturer successfully", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await expect(registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      )).to.emit(registry, "ManufacturerRegistered");
      
      expect(await registry.getTotalManufacturers()).to.equal(1);
    });
    
    it("Should fail with invalid address", async function () {
      const { registry } = await loadFixture(deployFixture);
      
      await expect(
        registry.registerManufacturer(
          "PharmaCorp",
          "REG-12345",
          "USA",
          ethers.ZeroAddress,
          "GMP-CERT-001",
          "contact@pharmacorp.com"
        )
      ).to.be.revertedWith("Invalid address");
    });
    
    it("Should fail with empty company name", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await expect(
        registry.registerManufacturer(
          "",
          "REG-12345",
          "USA",
          manufacturer1.address,
          "GMP-CERT-001",
          "contact@pharmacorp.com"
        )
      ).to.be.revertedWith("Company name required");
    });
    
    it("Should fail if address already registered", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(
        registry.registerManufacturer(
          "Another Corp",
          "REG-67890",
          "UK",
          manufacturer1.address,
          "GMP-CERT-002",
          "contact@another.com"
        )
      ).to.be.revertedWith("Already registered");
    });
    
    it("Should fail if non-owner tries to register", async function () {
      const { registry, manufacturer1, unauthorized } = await loadFixture(deployFixture);
      
      await expect(
        registry.connect(unauthorized).registerManufacturer(
          "PharmaCorp",
          "REG-12345",
          "USA",
          manufacturer1.address,
          "GMP-CERT-001",
          "contact@pharmacorp.com"
        )
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });
  
  describe("Manufacturer Verification", function () {
    it("Should verify a manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(registry.verifyManufacturer(1))
        .to.emit(registry, "ManufacturerVerified")
        .withArgs(1);
      
      const manufacturer = await registry.getManufacturer(1);
      expect(manufacturer.isVerified).to.be.true;
    });
    
    it("Should fail to verify invalid ID", async function () {
      const { registry } = await loadFixture(deployFixture);
      
      await expect(registry.verifyManufacturer(999))
        .to.be.revertedWith("Invalid ID");
    });
  });
  
  describe("Audit Recording", function () {
    it("Should record an audit", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(registry.recordAudit(1))
        .to.emit(registry, "ManufacturerAudited");
      
      const manufacturer = await registry.getManufacturer(1);
      expect(manufacturer.lastAuditDate).to.be.gt(0);
    });
  });
  
  describe("Batch Count Management", function () {
    it("Should increment batch count by owner", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(registry.incrementBatchCount(1))
        .to.emit(registry, "BatchProduced")
        .withArgs(1, 1);
      
      const manufacturer = await registry.getManufacturer(1);
      expect(manufacturer.totalBatchesProduced).to.equal(1);
    });
    
    it("Should increment batch count by manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await registry.connect(manufacturer1).incrementBatchCount(1);
      
      const manufacturer = await registry.getManufacturer(1);
      expect(manufacturer.totalBatchesProduced).to.equal(1);
    });
    
    it("Should fail if unauthorized tries to increment", async function () {
      const { registry, manufacturer1, unauthorized } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(
        registry.connect(unauthorized).incrementBatchCount(1)
      ).to.be.revertedWith("Unauthorized");
    });
  });
  
  describe("Manufacturer Deactivation", function () {
    it("Should deactivate a manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await expect(registry.deactivateManufacturer(1))
        .to.emit(registry, "ManufacturerDeactivated");
      
      const manufacturer = await registry.getManufacturer(1);
      expect(manufacturer.isActive).to.be.false;
    });
  });
  
  describe("Verification Checks", function () {
    it("Should return true for verified and active manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await registry.verifyManufacturer(1);
      
      expect(await registry.isVerifiedManufacturer(manufacturer1.address)).to.be.true;
    });
    
    it("Should return false for unverified manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      expect(await registry.isVerifiedManufacturer(manufacturer1.address)).to.be.false;
    });
    
    it("Should return false for inactive manufacturer", async function () {
      const { registry, manufacturer1 } = await loadFixture(deployFixture);
      
      await registry.registerManufacturer(
        "PharmaCorp",
        "REG-12345",
        "USA",
        manufacturer1.address,
        "GMP-CERT-001",
        "contact@pharmacorp.com"
      );
      
      await registry.verifyManufacturer(1);
      await registry.deactivateManufacturer(1);
      
      expect(await registry.isVerifiedManufacturer(manufacturer1.address)).to.be.false;
    });
  });
});
