import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("Integration", function () {
  async function deployFixture() {
    const [owner, doctorWallet, patientWallet, pharmacyWallet, manufacturerWallet] = await ethers.getSigners();
    
    const DoctorReg = await ethers.getContractFactory("DoctorRegistry");
    const doctorReg = await DoctorReg.deploy();
    
    const PatientReg = await ethers.getContractFactory("PatientRegistry");
    const patientReg = await PatientReg.deploy();
    
    const PharmacyReg = await ethers.getContractFactory("PharmacyRegistry");
    const pharmacyReg = await PharmacyReg.deploy();
    
    const PrescriptionNFT = await ethers.getContractFactory("PrescriptionNFT");
    const prescriptionNFT = await PrescriptionNFT.deploy();

    const DrugNFT = await ethers.getContractFactory("DrugNFT");
    const drugNFT = await DrugNFT.deploy();
    
    return { 
      doctorReg, patientReg, pharmacyReg, prescriptionNFT, drugNFT,
      owner, doctorWallet, patientWallet, pharmacyWallet, manufacturerWallet 
    };
  }

  it("Should complete the full Doctor -> Patient -> Prescription -> Pharmacy flow", async function () {
    const { 
      doctorReg, patientReg, pharmacyReg, prescriptionNFT, drugNFT,
      owner, doctorWallet, patientWallet, pharmacyWallet, manufacturerWallet 
    } = await loadFixture(deployFixture);

    // 1. Setup Doctor
    await doctorReg.registerDoctor("Dr. Global", "LIC-001", "General", doctorWallet.address);
    await doctorReg.verifyDoctor(1);
    
    // 2. Setup Patient
    const nameHash = ethers.id("Alice");
    await patientReg.registerPatient(nameHash, 0, patientWallet.address);
    await patientReg.connect(patientWallet).authorizeDoctor(1, doctorWallet.address);
    
    // 3. Setup Pharmacy
    await pharmacyReg.registerPharmacy("SafeMeds", "PH-999", "Main St", pharmacyWallet.address, "contact@safemeds.com", "555-0199");
    await pharmacyReg.verifyPharmacy(1);
    
    // 4. Setup Drug Batch (Manufacturer side)
    const expiry = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days
    await drugNFT.mintBatch("aspirin-001", "Bayer - Aspirin 500mg", expiry, "ipfs://hash");
    
    // 5. Doctor issues Prescription
    // Verify first that doctor is active and authorized
    expect(await doctorReg.isVerifiedDoctor(doctorWallet.address)).to.be.true;
    expect(await patientReg.isDoctorAuthorized(1, doctorWallet.address)).to.be.true;
    
    const prescriptionExpiry = Math.floor(Date.now() / 1000) + 86400 * 7;
    await prescriptionNFT.issuePrescription(
      patientWallet.address,
      1, // patientId
      1, // doctorId
      101, // arbitrary drugId for this test
      "1 tablet daily",
      prescriptionExpiry,
      "Take with water"
    );
    
    // 6. Pharmacy verifies and fills prescription
    expect(await prescriptionNFT.isValid(1)).to.be.true;
    expect(await drugNFT.isValid(1)).to.be.true;
    
    await prescriptionNFT.fillPrescription(1, 1); // tokenId 1, pharmacyId 1
    
    expect(await prescriptionNFT.isValid(1)).to.be.false;
    const p = await prescriptionNFT.prescriptions(1);
    expect(p.isFilled).to.be.true;
  });
});
