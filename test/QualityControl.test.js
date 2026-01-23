import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
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
      
      await expect(qc.connect(inspector1).performQualityCheck(
        1,
        true,
        "Purity",
        "99%",
        "Lab Report #123"
      )).to.emit(qc, "QualityCheckPerformed")
        .withArgs(1, inspector1.address, true);
    });
    
    it("Should fail if not authorized inspector", async function () {
      const { qc, unauthorized } = await loadFixture(deployFixture);
      
      await expect(
        qc.connect(unauthorized).performQualityCheck(
          1,
          true,
          "Purity",
          "99%",
          "Report"
        )
      ).to.be.revertedWith("Not authorized");
    });
    
    it("Should track compliance status", async function () {
      const { qc, inspector1 } = await loadFixture(deployFixture);
      
      await qc.authorizeInspector(inspector1.address);
      await qc.connect(inspector1).performQualityCheck(
        1,
        true,
        "Purity",
        "99%",
        "Report"
      );
      
      expect(await qc.hasPassedQualityControl(1)).to.be.true;
    });
  });
});
