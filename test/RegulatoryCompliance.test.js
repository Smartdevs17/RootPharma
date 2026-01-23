import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
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
      
      await expect(compliance.recognizeRegulatoryBody("FDA_US"))
        .to.emit(compliance, "RegulatoryBodyRecognized")
        .withArgs("FDA_US");
      
      expect(await compliance.recognizedRegulatoryBodies("FDA_US")).to.be.true;
    });
  });
  
  describe("Approval Management", function () {
    it("Should grant approval", async function () {
      const { compliance, owner } = await loadFixture(deployFixture);
      
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await expect(compliance.grantApproval(
        1,
        "FDA",
        "APP-123",
        expiry,
        "QmHash"
      )).to.emit(compliance, "ApprovalGranted")
        .withArgs(1, "FDA");
      
      expect(await compliance.isCompliant(1)).to.be.true;
    });
    
    it("Should revoke approval", async function () {
      const { compliance } = await loadFixture(deployFixture);
      
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await compliance.grantApproval(1, "FDA", "APP-123", expiry, "QmHash");
      
      await expect(compliance.revokeApproval(1, 0))
        .to.emit(compliance, "ApprovalRevoked")
        .withArgs(1, "FDA");
      
      expect(await compliance.isCompliant(1)).to.be.false;
    });
  });
  
  describe("Compliance Checks", function () {
    it("Should check compliance", async function () {
      const { compliance } = await loadFixture(deployFixture);
      
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      await compliance.grantApproval(1, "FDA", "APP-123", expiry, "QmHash");
      
      expect(await compliance.isCompliant(1)).to.be.true;
    });
  });
});
