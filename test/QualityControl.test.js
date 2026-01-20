import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("QualityControl", function () {
  async function deployFixture() {
    const [owner, inspector1, inspector2, unauthorized] = await ethers.getSigners();
    
    const QualityControl = await ethers.getContractFactory("QualityControl");
    const qc = await QualityControl.deploy();
    
    return { qc, owner, inspector1, inspector2, unauthorized };
  }
  
  describe("Inspector Management", function () {
    it("Should authorize inspector", async function () {
      const { qc, inspector1 } = await loadFixture(deployFixture);
      
      await expect(qc.authorizeInspector(inspector1.address))
        .to.emit(qc, "InspectorAuthorized")
        .withArgs(inspector1.address);
      
      expect(await qc.authorizedInspectors(inspector1.address)).to.be.true;
    });
    
    it("Should revoke inspector", async function () {
      const { qc, inspector1 } = await loadFixture(deployFixture);
      
      await qc.authorizeInspector(inspector1.address);
      await expect(qc.revokeInspector(inspector1.address))
        .to.emit(qc, "InspectorRevoked");
      
      expect(await qc.authorizedInspectors(inspector1.address)).to.be.false;
    });
  });
  
  describe("Quality Checks", function () {
    it("Should record quality check", async function () {
      const { qc, inspector1 } = await loadFixture(deployFixture);
      
      await qc.authorizeInspector(inspector1.address);
      
      await expect(qc.connect(inspector1).recordQualityCheck(
        1,
        true,
        "All tests passed",
        "Lab Report #123"
      )).to.emit(qc, "QualityCheckRecorded");
    });
    
    it("Should fail if not authorized inspector", async function () {
      const { qc, unauthorized } = await loadFixture(deployFixture);
      
      await expect(
        qc.connect(unauthorized).recordQualityCheck(
          1,
          true,
          "Test",
          "Report"
        )
      ).to.be.revertedWith("Not authorized");
    });
    
    it("Should track compliance status", async function () {
      const { qc, inspector1 } = await loadFixture(deployFixture);
      
      await qc.authorizeInspector(inspector1.address);
      await qc.connect(inspector1).recordQualityCheck(
        1,
        true,
        "Passed",
        "Report"
      );
      
      expect(await qc.isCompliant(1)).to.be.true;
    });
  });
});
