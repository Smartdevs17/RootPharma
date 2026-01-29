const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

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
});function anyValue(arg) { return true; } // Placeholder if not imported correctly
