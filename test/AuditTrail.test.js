import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("AuditTrail", function () {
  async function deployFixture() {
    const [owner, actor1, other] = await ethers.getSigners();
    
    const AuditTrail = await ethers.getContractFactory("AuditTrail");
    const auditManager = await AuditTrail.deploy();
    
    return { auditManager, owner, actor1, other };
  }
  
  describe("Audit Logging", function () {
    it("Should log an action successfully", async function () {
      const { auditManager, actor1 } = await loadFixture(deployFixture);
      
      const dataHash = ethers.id("some-data");
      await expect(auditManager.connect(actor1).logAction(
        1,
        "BATCH_MOVED",
        "Moved from A to B",
        dataHash
      )).to.emit(auditManager, "AuditEntryCreated")
        .withArgs(0, 1, "BATCH_MOVED");
      
      const entries = await auditManager.getBatchAuditTrail(1);
      expect(entries.length).to.equal(1);
      expect(entries[0].action).to.equal("BATCH_MOVED");
      expect(entries[0].actor).to.equal(actor1.address);
      expect(entries[0].dataHash).to.equal(dataHash);
    });
    
    it("Should track multiple entries for a batch", async function () {
      const { auditManager } = await loadFixture(deployFixture);
      
      await auditManager.logAction(1, "A1", "D1", ethers.ZeroHash);
      await auditManager.logAction(1, "A2", "D2", ethers.ZeroHash);
      await auditManager.logAction(2, "A3", "D3", ethers.ZeroHash);
      
      const trail1 = await auditManager.getBatchAuditTrail(1);
      expect(trail1.length).to.equal(2);
      
      const trail2 = await auditManager.getBatchAuditTrail(2);
      expect(trail2.length).to.equal(1);
    });
  });
  
  describe("Verification", function () {
    it("Should verify data hash", async function () {
      const { auditManager } = await loadFixture(deployFixture);
      
      const dataHash = ethers.id("data");
      await auditManager.logAction(1, "A", "D", dataHash);
      
      expect(await auditManager.verifyDataHash(0, dataHash)).to.be.true;
      expect(await auditManager.verifyDataHash(0, ethers.ZeroHash)).to.be.false;
    });
  });
});
