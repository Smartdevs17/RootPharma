import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PharmacyRegistry", function () {
  async function deployPharmacyRegistryFixture() {
    const [owner, pharmacy1, pharmacy2, unauthorized] = await ethers.getSigners();
    
    const PharmacyRegistry = await ethers.getContractFactory("PharmacyRegistry");
    const registry = await PharmacyRegistry.deploy();
    
    return { registry, owner, pharmacy1, pharmacy2, unauthorized };
  }
  
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { registry, owner } = await loadFixture(deployPharmacyRegistryFixture);
      expect(await registry.owner()).to.equal(owner.address);
    });
    
    it("Should start with pharmacy ID counter at 1", async function () {
      const { registry } = await loadFixture(deployPharmacyRegistryFixture);
      expect(await registry.getTotalPharmacies()).to.equal(0);
    });
  });
  
  describe("Pharmacy Registration", function () {
    it("Should register a new pharmacy successfully", async function () {
      const { registry, owner, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      )).to.emit(registry, "PharmacyRegistered")
        .withArgs(1, "City Pharmacy", pharmacy1.address, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));
      
      expect(await registry.getTotalPharmacies()).to.equal(1);
    });
    
    it("Should fail if non-owner tries to register", async function () {
      const { registry, pharmacy1, unauthorized } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(
        registry.connect(unauthorized).registerPharmacy(
          "City Pharmacy",
          "LIC-12345",
          "123 Main St",
          pharmacy1.address,
          "contact@citypharmacy.com",
          "+1234567890"
        )
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
    
    it("Should fail with invalid wallet address", async function () {
      const { registry } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(
        registry.registerPharmacy(
          "City Pharmacy",
          "LIC-12345",
          "123 Main St",
          ethers.ZeroAddress,
          "contact@citypharmacy.com",
          "+1234567890"
        )
      ).to.be.revertedWith("Invalid wallet address");
    });
    
    it("Should fail with empty name", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(
        registry.registerPharmacy(
          "",
          "LIC-12345",
          "123 Main St",
          pharmacy1.address,
          "contact@citypharmacy.com",
          "+1234567890"
        )
      ).to.be.revertedWith("Name cannot be empty");
    });
    
    it("Should fail with empty license number", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(
        registry.registerPharmacy(
          "City Pharmacy",
          "",
          "123 Main St",
          pharmacy1.address,
          "contact@citypharmacy.com",
          "+1234567890"
        )
      ).to.be.revertedWith("License number cannot be empty");
    });
    
    it("Should fail if address already registered", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await expect(
        registry.registerPharmacy(
          "Another Pharmacy",
          "LIC-67890",
          "456 Oak Ave",
          pharmacy1.address,
          "contact@another.com",
          "+0987654321"
        )
      ).to.be.revertedWith("Address already registered");
    });
  });
  
  describe("Pharmacy Verification", function () {
    it("Should verify a pharmacy successfully", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await expect(registry.verifyPharmacy(1))
        .to.emit(registry, "PharmacyVerified")
        .withArgs(1, await ethers.provider.getSigner(0).then(s => s.address));
      
      const pharmacy = await registry.getPharmacy(1);
      expect(pharmacy.isVerified).to.be.true;
    });
    
    it("Should fail to verify invalid pharmacy ID", async function () {
      const { registry } = await loadFixture(deployPharmacyRegistryFixture);
      
      await expect(registry.verifyPharmacy(999))
        .to.be.revertedWith("Invalid pharmacy ID");
    });
    
    it("Should fail to verify already verified pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await registry.verifyPharmacy(1);
      
      await expect(registry.verifyPharmacy(1))
        .to.be.revertedWith("Pharmacy already verified");
    });
  });
  
  describe("Pharmacy Status Management", function () {
    it("Should deactivate a pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await expect(registry.deactivatePharmacy(1))
        .to.emit(registry, "PharmacyDeactivated");
      
      const pharmacy = await registry.getPharmacy(1);
      expect(pharmacy.isActive).to.be.false;
    });
    
    it("Should reactivate a pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await registry.deactivatePharmacy(1);
      await expect(registry.reactivatePharmacy(1))
        .to.emit(registry, "PharmacyReactivated");
      
      const pharmacy = await registry.getPharmacy(1);
      expect(pharmacy.isActive).to.be.true;
    });
  });
  
  describe("Pharmacy Information Updates", function () {
    it("Should update pharmacy information", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await expect(registry.updatePharmacyInfo(
        1,
        "456 New Location",
        "newemail@citypharmacy.com",
        "+1111111111"
      )).to.emit(registry, "PharmacyUpdated");
      
      const pharmacy = await registry.getPharmacy(1);
      expect(pharmacy.location).to.equal("456 New Location");
      expect(pharmacy.contactEmail).to.equal("newemail@citypharmacy.com");
      expect(pharmacy.phoneNumber).to.equal("+1111111111");
    });
  });
  
  describe("Verification Checks", function () {
    it("Should return true for verified and active pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await registry.verifyPharmacy(1);
      
      expect(await registry.isVerifiedPharmacy(pharmacy1.address)).to.be.true;
    });
    
    it("Should return false for unverified pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      expect(await registry.isVerifiedPharmacy(pharmacy1.address)).to.be.false;
    });
    
    it("Should return false for inactive pharmacy", async function () {
      const { registry, pharmacy1 } = await loadFixture(deployPharmacyRegistryFixture);
      
      await registry.registerPharmacy(
        "City Pharmacy",
        "LIC-12345",
        "123 Main St",
        pharmacy1.address,
        "contact@citypharmacy.com",
        "+1234567890"
      );
      
      await registry.verifyPharmacy(1);
      await registry.deactivatePharmacy(1);
      
      expect(await registry.isVerifiedPharmacy(pharmacy1.address)).to.be.false;
    });
  });
});
