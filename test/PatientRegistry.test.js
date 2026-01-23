import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("PatientRegistry", function () {
  async function deployFixture() {
    const [owner, patient1, doctor1, other] = await ethers.getSigners();
    
    const PatientRegistry = await ethers.getContractFactory("PatientRegistry");
    const registry = await PatientRegistry.deploy();
    
    return { registry, owner, patient1, doctor1, other };
  }
  
  describe("Registration", function () {
    it("Should register a patient successfully", async function () {
      const { registry, patient1 } = await loadFixture(deployFixture);
      
      const nameHash = ethers.id("John Doe");
      const dob = Math.floor(new Date("1990-01-01").getTime() / 1000);
      
      await expect(registry.registerPatient(
        nameHash,
        dob,
        patient1.address
      )).to.emit(registry, "PatientRegistered")
        .withArgs(1, patient1.address);
      
      const patient = await registry.patients(1);
      expect(patient.nameHash).to.equal(nameHash);
      expect(patient.walletAddress).to.equal(patient1.address);
    });
  });
  
  describe("Doctor Authorization", function () {
    it("Should allow patient to authorize a doctor", async function () {
      const { registry, patient1, doctor1 } = await loadFixture(deployFixture);
      
      const nameHash = ethers.id("John Doe");
      await registry.registerPatient(nameHash, 0, patient1.address);
      
      await expect(registry.connect(patient1).authorizeDoctor(1, doctor1.address))
        .to.emit(registry, "DoctorAuthorized")
        .withArgs(1, doctor1.address);
      
      expect(await registry.isDoctorAuthorized(1, doctor1.address)).to.be.true;
    });
    
    it("Should allow patient to revoke a doctor", async function () {
      const { registry, patient1, doctor1 } = await loadFixture(deployFixture);
      
      await registry.registerPatient(ethers.id("J"), 0, patient1.address);
      await registry.connect(patient1).authorizeDoctor(1, doctor1.address);
      
      await expect(registry.connect(patient1).revokeDoctor(1, doctor1.address))
        .to.emit(registry, "DoctorRevoked")
        .withArgs(1, doctor1.address);
      
      expect(await registry.isDoctorAuthorized(1, doctor1.address)).to.be.false;
    });
    
    it("Should fail if unauthorized user tries to authorize", async function () {
      const { registry, patient1, doctor1, other } = await loadFixture(deployFixture);
      
      await registry.registerPatient(ethers.id("J"), 0, patient1.address);
      await expect(
        registry.connect(other).authorizeDoctor(1, doctor1.address)
      ).to.be.revertedWith("Unauthorized");
    });
  });
  
  describe("Deactivation", function () {
    it("Should deactivate a patient profile", async function () {
      const { registry, patient1 } = await loadFixture(deployFixture);
      
      await registry.registerPatient(ethers.id("J"), 0, patient1.address);
      await expect(registry.deactivatePatient(1))
        .to.emit(registry, "PatientDeactivated")
        .withArgs(1);
      
      const patient = await registry.patients(1);
      expect(patient.isActive).to.be.false;
    });
  });
});
