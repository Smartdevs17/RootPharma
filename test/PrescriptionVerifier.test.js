import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("PrescriptionVerifier", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    
    const PrescriptionVerifier = await ethers.getContractFactory("PrescriptionVerifier");
    const verifier = await PrescriptionVerifier.deploy();
    
    return { verifier, owner, other };
  }
  
  describe("Rule Management", function () {
    it("Should add a verification rule", async function () {
      const { verifier } = await loadFixture(deployFixture);
      
      await expect(verifier.addRule("MinExpiry", 3600, true))
        .to.emit(verifier, "RuleAdded")
        .withArgs(1, "MinExpiry");
      
      const rule = await verifier.rules(1);
      expect(rule.name).to.equal("MinExpiry");
      expect(rule.isActive).to.be.true;
    });
  });
  
  describe("Verification", function () {
    it("Should verify correctly with no rules", async function () {
      const { verifier } = await loadFixture(deployFixture);
      expect(await verifier.verify(0, true)).to.be.true;
    });
    
    it("Should fail if expiry is too short", async function () {
      const { verifier } = await loadFixture(deployFixture);
      await verifier.addRule("MinExpiry", 3600, false);
      
      const shortExpiry = Math.floor(Date.now() / 1000) + 1800; // only 30 mins
      expect(await verifier.verify(shortExpiry, true)).to.be.false;
    });
    
    it("Should fail if doctor is inactive", async function () {
      const { verifier } = await loadFixture(deployFixture);
      await verifier.addRule("CheckDoctor", 0, true);
      
      expect(await verifier.verify(Date.now(), false)).to.be.false;
    });
    
    it("Should pass if all rules are met", async function () {
      const { verifier } = await loadFixture(deployFixture);
      await verifier.addRule("LongExpiry", 10, true);
      
      const longExpiry = Math.floor(Date.now() / 1000) + 10000;
      expect(await verifier.verify(longExpiry, true)).to.be.true;
    });
  });
});
