import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("RegulatoryCompliance", function () {
  async function deployFixture() {
    const [owner, regulator1, regulator2, manufacturer] = await ethers.getSigners();
    
    const RegulatoryCompliance = await ethers.getContractFactory("RegulatoryCompliance");
    const compliance = await RegulatoryCompliance.deploy();
    
    return { compliance, owner, regulator1, regulator2, manufacturer };
  }
  
  describe("Regulatory Body Management", function () {
    it("Should recognize regulatory body", async function () {
      const { compliance, regulator1 } = await loadFixture(deployFixture);
      
      await expect(compliance.recognizeRegulatoryBody(
        "FDA",
        "USA",
        regulator1.address
      )).to.emit(compliance, "RegulatoryBodyRecognized");
      
      expect(await compliance.isRecognizedBody(regulator1.address)).to.be.true;
    });
    
    it("Should fail with invalid address", async function () {
      const { compliance } = await loadFixture(deployFixture);
      
      await expect(
        compliance.recognizeRegulatoryBody("FDA", "USA", ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });
  
  describe("Approval Management", function () {
    it("Should grant approval", async function () {
      const { compliance, regulator1 } = await loadFixture(deployFixture);
      
      await compliance.recognizeRegulatoryBody("FDA", "USA", regulator1.address);
      
      await expect(compliance.connect(regulator1).grantApproval(
        1,
        "Approved for distribution"
      )).to.emit(compliance, "ApprovalGranted");
      
      expect(await compliance.isApproved(1, regulator1.address)).to.be.true;
    });
    
    it("Should revoke approval", async function () {
      const { compliance, regulator1 } = await loadFixture(deployFixture);
      
      await compliance.recognizeRegulatoryBody("FDA", "USA", regulator1.address);
      await compliance.connect(regulator1).grantApproval(1, "Approved");
      
      await expect(compliance.connect(regulator1).revokeApproval(
        1,
        "Safety concerns"
      )).to.emit(compliance, "ApprovalRevoked");
      
      expect(await compliance.isApproved(1, regulator1.address)).to.be.false;
    });
  });
  
  describe("Compliance Checks", function () {
    it("Should check full compliance", async function () {
      const { compliance, regulator1, regulator2 } = await loadFixture(deployFixture);
      
      await compliance.recognizeRegulatoryBody("FDA", "USA", regulator1.address);
      await compliance.recognizeRegulatoryBody("EMA", "EU", regulator2.address);
      
      await compliance.connect(regulator1).grantApproval(1, "Approved");
      await compliance.connect(regulator2).grantApproval(1, "Approved");
      
      expect(await compliance.isFullyCompliant(1)).to.be.true;
    });
  });
});
