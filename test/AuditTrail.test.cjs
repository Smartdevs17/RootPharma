const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("AuditTrail", function () {
  async function deployFixture() {
    const [owner, actor] = await ethers.getSigners();

    const AuditTrail = await ethers.getContractFactory("AuditTrail");
    const auditTrail = await AuditTrail.deploy();

    return { auditTrail, owner, actor };
  }

  describe("Logging", function () {
    it("Should log an action successfully", async function () {
      const { auditTrail, actor } = await loadFixture(deployFixture);
      
      const batchTokenId = 1;
      const action = "MINT";
      const details = "Minted new batch";
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data"));

      await expect(auditTrail.connect(actor).logAction(batchTokenId, action, details, dataHash))
        .to.emit(auditTrail, "AuditEntryCreated")
        .withArgs(0, batchTokenId, action);

      const entry = await auditTrail.auditLog(0);
      expect(entry.batchTokenId).to.equal(batchTokenId);
      expect(entry.action).to.equal(action);
      expect(entry.actor).to.equal(actor.address);
      expect(entry.details).to.equal(details);
      expect(entry.dataHash).to.equal(dataHash);
    });
  });
});
