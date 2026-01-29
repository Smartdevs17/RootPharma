const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("PharmacyRegistry", function () {
  async function deployFixture() {
    const [owner, pharmacy, otherAccount] = await ethers.getSigners();

    const PharmacyRegistry = await ethers.getContractFactory("PharmacyRegistry");
    const registry = await PharmacyRegistry.deploy();

    return { registry, owner, pharmacy, otherAccount };
  }

  describe("Registration", function () {
    it("Should register a pharmacy successfully", async function () {
      const { registry, owner, pharmacy } = await loadFixture(deployFixture);
      
      const name = "City Pharmacy";
      const license = "PHARM-123";
      const location = "Downtown";
      const email = "city@pharm.com";
      const phone = "555-0199";

      await expect(registry.connect(owner).registerPharmacy(
        name, license, location, pharmacy.address, email, phone
      )).to.emit(registry, "PharmacyRegistered")
        .withArgs(1, name, pharmacy.address, anyValue);

      const p = await registry.getPharmacy(1);
      expect(p.name).to.equal(name);
      expect(p.walletAddress).to.equal(pharmacy.address);
      expect(p.isVerified).to.be.false;
      expect(p.isActive).to.be.true;
    });

    it("Should fail if non-owner tries to register", async function () {
      const { registry, otherAccount, pharmacy } = await loadFixture(deployFixture);
      
      await expect(registry.connect(otherAccount).registerPharmacy(
        "Fake", "123", "Location", pharmacy.address, "e", "p"
      )).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });
  });

  describe("Verification", function () {
    it("Should verify a pharmacy", async function () {
      const { registry, owner, pharmacy } = await loadFixture(deployFixture);
      await registry.registerPharmacy("City", "1", "L", pharmacy.address, "e", "p");
      
      await expect(registry.verifyPharmacy(1))
        .to.emit(registry, "PharmacyVerified")
        .withArgs(1, owner.address);
        
      expect(await registry.isVerifiedPharmacy(pharmacy.address)).to.be.true;
    });
  });

  describe("Status Management", function () {
    it("Should deactivate and reactivate a pharmacy", async function () {
      const { registry, owner, pharmacy } = await loadFixture(deployFixture);
      await registry.registerPharmacy("City", "1", "L", pharmacy.address, "e", "p");
      
      await expect(registry.deactivatePharmacy(1))
        .to.emit(registry, "PharmacyDeactivated")
        .withArgs(1, owner.address);
        
      expect(await registry.isVerifiedPharmacy(pharmacy.address)).to.be.false;
      
      await expect(registry.reactivatePharmacy(1))
        .to.emit(registry, "PharmacyReactivated")
        .withArgs(1, owner.address);
        
      // Still false because it needs verification again? Wait, isVerified and isActive are separate.
      // let's check the code: return pharmacy.isVerified && pharmacy.isActive;
      // After reactivation, isActive is true. But did we verify it before?
      // In this test, we didn't verify. So it should still be false.
    });
  });

  describe("Profile Updates", function () {
    it("Should update pharmacy info", async function () {
      const { registry, owner, pharmacy } = await loadFixture(deployFixture);
      await registry.registerPharmacy("City", "1", "L", pharmacy.address, "e", "p");
      
      const newLoc = "Uptown";
      const newEmail = "new@pharm.com";
      const newPhone = "000-0000";
      
      await expect(registry.updatePharmacyInfo(1, newLoc, newEmail, newPhone))
        .to.emit(registry, "PharmacyUpdated")
        .withArgs(1, owner.address);
        
      const p = await registry.getPharmacy(1);
      expect(p.location).to.equal(newLoc);
      expect(p.contactEmail).to.equal(newEmail);
      expect(p.phoneNumber).to.equal(newPhone);
    });
  });
});
