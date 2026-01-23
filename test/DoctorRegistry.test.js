import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("DoctorRegistry", function () {
  async function deployFixture() {
    const [owner, doctor1, doctor2, other] = await ethers.getSigners();
    
    const DoctorRegistry = await ethers.getContractFactory("DoctorRegistry");
    const registry = await DoctorRegistry.deploy();
    
    return { registry, owner, doctor1, doctor2, other };
  }
  
  describe("Registration", function () {
    it("Should register a doctor successfully", async function () {
      const { registry, doctor1 } = await loadFixture(deployFixture);
      
      await expect(registry.registerDoctor(
        "Dr. Smith",
        "MD-987654",
        "Cardiology",
        doctor1.address
      )).to.emit(registry, "DoctorRegistered")
        .withArgs(1, doctor1.address);
      
      const doctor = await registry.getDoctor(1);
      expect(doctor.name).to.equal("Dr. Smith");
      expect(doctor.isVerified).to.be.false;
    });
    
    it("Should fail if address already registered", async function () {
      const { registry, doctor1 } = await loadFixture(deployFixture);
      
      await registry.registerDoctor("Dr. A", "L1", "S1", doctor1.address);
      await expect(
        registry.registerDoctor("Dr. B", "L2", "S2", doctor1.address)
      ).to.be.revertedWith("Already registered");
    });
  });
  
  describe("Verification", function () {
    it("Should verify a doctor", async function () {
      const { registry, doctor1 } = await loadFixture(deployFixture);
      
      await registry.registerDoctor("Dr. Smith", "L1", "S1", doctor1.address);
      await expect(registry.verifyDoctor(1))
        .to.emit(registry, "DoctorVerified")
        .withArgs(1);
      
      expect(await registry.isVerifiedDoctor(doctor1.address)).to.be.true;
    });
  });
  
  describe("Prescription Management", function () {
    it("Should allow doctor to increment prescription count", async function () {
      const { registry, doctor1 } = await loadFixture(deployFixture);
      
      await registry.registerDoctor("Dr. Smith", "L1", "S1", doctor1.address);
      await expect(registry.connect(doctor1).incrementPrescriptionCount(1))
        .to.emit(registry, "PrescriptionIssued")
        .withArgs(1);
      
      const doctor = await registry.getDoctor(1);
      expect(doctor.totalPrescriptions).to.equal(1);
    });
  });
  
  describe("Deactivation", function () {
    it("Should deactivate a doctor", async function () {
      const { registry, doctor1 } = await loadFixture(deployFixture);
      
      await registry.registerDoctor("Dr. Smith", "L1", "S1", doctor1.address);
      await registry.verifyDoctor(1);
      
      await expect(registry.deactivateDoctor(1))
        .to.emit(registry, "DoctorDeactivated")
        .withArgs(1);
      
      expect(await registry.isVerifiedDoctor(doctor1.address)).to.be.false;
    });
  });
});
