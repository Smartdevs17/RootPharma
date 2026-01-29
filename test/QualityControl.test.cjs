const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QualityControl", function () {
  async function deployFixture() {
    const [owner, inspector, other] = await ethers.getSigners();

    const QualityControl = await ethers.getContractFactory("QualityControl");
    const qc = await QualityControl.deploy();

    return { qc, owner, inspector, other };
  }

  describe("Authorization", function () {
    it("Should authorize an inspector", async function () {
      const { qc, owner, inspector } = await loadFixture(deployFixture);
      
      await expect(qc.authorizeInspector(inspector.address))
        .to.emit(qc, "InspectorAuthorized")
        .withArgs(inspector.address);

      expect(await qc.authorizedInspectors(inspector.address)).to.be.true;
    });

    it("Should revoke an inspector", async function () {
      const { qc, inspector } = await loadFixture(deployFixture);
      await qc.authorizeInspector(inspector.address);
      await qc.revokeInspector(inspector.address);
      expect(await qc.authorizedInspectors(inspector.address)).to.be.false;
    });

    it("Should fail if non-owner tries to authorize", async function () {
      const { qc, other } = await loadFixture(deployFixture);
      await expect(qc.connect(other).authorizeInspector(other.address))
        .to.be.revertedWithCustomError(qc, "OwnableUnauthorizedAccount")
        .withArgs(other.address);
    });
  });

  describe("Quality Checks", function () {
    it("Should perform a quality check successfully", async function () {
      const { qc, inspector } = await loadFixture(deployFixture);
      await qc.authorizeInspector(inspector.address);
      
      const batchId = 1;
      await expect(qc.connect(inspector).performQualityCheck(batchId, true, "Lab", "OK", "Notes"))
        .to.emit(qc, "QualityCheckPerformed")
        .withArgs(batchId, inspector.address, true);

      const checks = await qc.getQualityChecks(batchId);
      expect(checks.length).to.equal(1);
      expect(checks[0].passed).to.be.true;
    });

    it("Should fail if unauthorized account performs check", async function () {
      const { qc, other } = await loadFixture(deployFixture);
      await expect(qc.connect(other).performQualityCheck(1, true, "Lab", "OK", "Notes"))
        .to.be.revertedWith("Not authorized");
    });
  });

  describe("Validation", function () {
    it("Should return true if all checks passed", async function () {
      const { qc, inspector } = await loadFixture(deployFixture);
      await qc.authorizeInspector(inspector.address);
      
      await qc.connect(inspector).performQualityCheck(1, true, "T1", "R1", "N1");
      await qc.connect(inspector).performQualityCheck(1, true, "T2", "R2", "N2");
      
      expect(await qc.hasPassedQualityControl(1)).to.be.true;
    });

    it("Should return false if any check failed", async function () {
      const { qc, inspector } = await loadFixture(deployFixture);
      await qc.authorizeInspector(inspector.address);
      
      await qc.connect(inspector).performQualityCheck(1, true, "T1", "R1", "N1");
      await qc.connect(inspector).performQualityCheck(1, false, "T2", "R2", "N2");
      
      expect(await qc.hasPassedQualityControl(1)).to.be.false;
    });

    it("Should return false if no checks performed", async function () {
      const { qc } = await loadFixture(deployFixture);
      expect(await qc.hasPassedQualityControl(99)).to.be.false;
    });
  });
});function anyValue(arg) { return true; }
