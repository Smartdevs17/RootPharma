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
  describe("Retrieval", function () {
    it("Should retrieve the correct audit trail for a batch", async function () {
      const { auditTrail, actor } = await loadFixture(deployFixture);
      
      await auditTrail.logAction(1, "MINT", "Details 1", ethers.ZeroHash);
      await auditTrail.logAction(2, "MINT", "Details 2", ethers.ZeroHash);
      await auditTrail.logAction(1, "TRANSFER", "Details 3", ethers.ZeroHash);

      const trail = await auditTrail.getBatchAuditTrail(1);
      expect(trail.length).to.equal(2);
      expect(trail[0].action).to.equal("MINT");
      expect(trail[1].action).to.equal("TRANSFER");
    });

    it("Should return an empty trail for a non-existent batch", async function () {
      const { auditTrail } = await loadFixture(deployFixture);
      const trail = await auditTrail.getBatchAuditTrail(999);
      expect(trail.length).to.equal(0);
    });
  });

  describe("Verification", function () {
    it("Should verify the data hash correctly", async function () {
      const { auditTrail } = await loadFixture(deployFixture);
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("correct"));
      await auditTrail.logAction(1, "ACTION", "Desc", dataHash);

      expect(await auditTrail.verifyDataHash(0, dataHash)).to.be.true;
      expect(await auditTrail.verifyDataHash(0, ethers.ZeroHash)).to.be.false;
    });

    it("Should revert on invalid entry ID", async function () {
      const { auditTrail } = await loadFixture(deployFixture);
      await expect(auditTrail.verifyDataHash(999, ethers.ZeroHash))
        .to.be.revertedWith("Invalid entry ID");
    });
  });

  describe("Utilities", function () {
    it("Should return total entries", async function () {
      const { auditTrail } = await loadFixture(deployFixture);
      await auditTrail.logAction(1, "A1", "D1", ethers.ZeroHash);
      await auditTrail.logAction(2, "A2", "D2", ethers.ZeroHash);
      expect(await auditTrail.getTotalAuditEntries()).to.equal(2);
    });
  });
  });
});
