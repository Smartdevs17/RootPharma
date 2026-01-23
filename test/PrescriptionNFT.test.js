import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("PrescriptionNFT", function () {
  async function deployFixture() {
    const [owner, patient, doctor, pharmacy, other] = await ethers.getSigners();
    
    const PrescriptionNFT = await ethers.getContractFactory("PrescriptionNFT");
    const prescriptionNFT = await PrescriptionNFT.deploy();
    
    return { prescriptionNFT, owner, patient, doctor, pharmacy, other };
  }
  
  describe("Issuance", function () {
    it("Should issue a prescription successfully", async function () {
      const { prescriptionNFT, patient, doctor } = await loadFixture(deployFixture);
      
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await expect(prescriptionNFT.issuePrescription(
        patient.address,
        1, // patientId
        1, // doctorId
        1, // drugId
        "1 tablet daily",
        expiry,
        "Take after meal"
      )).to.emit(prescriptionNFT, "PrescriptionIssued")
        .withArgs(1, 1, 1);
      
      expect(await prescriptionNFT.ownerOf(1)).to.equal(patient.address);
      const p = await prescriptionNFT.prescriptions(1);
      expect(p.drugId).to.equal(1);
      expect(p.isFilled).to.be.false;
    });
    
    it("Should fail with invalid expiry", async function () {
      const { prescriptionNFT, patient } = await loadFixture(deployFixture);
      
      const oldExpiry = Math.floor(Date.now() / 1000) - 100;
      await expect(
        prescriptionNFT.issuePrescription(patient.address, 1, 1, 1, "D", oldExpiry, "N")
      ).to.be.revertedWith("Invalid expiry date");
    });
  });
  
  describe("Filling", function () {
    it("Should fill a prescription", async function () {
      const { prescriptionNFT, patient, pharmacy } = await loadFixture(deployFixture);
      
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await prescriptionNFT.issuePrescription(patient.address, 1, 1, 1, "D", expiry, "N");
      
      await expect(prescriptionNFT.fillPrescription(1, 10))
        .to.emit(prescriptionNFT, "PrescriptionFilled")
        .withArgs(1, 10);
      
      const p = await prescriptionNFT.prescriptions(1);
      expect(p.isFilled).to.be.true;
      expect(p.pharmacyId).to.equal(10);
    });
    
    it("Should fail if already filled", async function () {
      const { prescriptionNFT, patient } = await loadFixture(deployFixture);
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await prescriptionNFT.issuePrescription(patient.address, 1, 1, 1, "D", expiry, "N");
      
      await prescriptionNFT.fillPrescription(1, 10);
      await expect(
        prescriptionNFT.fillPrescription(1, 11)
      ).to.be.revertedWith("Already filled");
    });
  });
  
  describe("Validation", function () {
    it("Should return true for valid prescription", async function () {
      const { prescriptionNFT, patient } = await loadFixture(deployFixture);
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await prescriptionNFT.issuePrescription(patient.address, 1, 1, 1, "D", expiry, "N");
      
      expect(await prescriptionNFT.isValid(1)).to.be.true;
    });
    
    it("Should return false for filled prescription", async function () {
      const { prescriptionNFT, patient } = await loadFixture(deployFixture);
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await prescriptionNFT.issuePrescription(patient.address, 1, 1, 1, "D", expiry, "N");
      await prescriptionNFT.fillPrescription(1, 10);
      
      expect(await prescriptionNFT.isValid(1)).to.be.false;
    });
  });
});
