import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("RecallManagement", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    
    const RecallManagement = await ethers.getContractFactory("RecallManagement");
    const recallManager = await RecallManagement.deploy();
    
    return { recallManager, owner, other };
  }
  
  describe("Recall Issuance", function () {
    it("Should issue a recall successfully", async function () {
      const { recallManager } = await loadFixture(deployFixture);
      
      const regions = ["North", "South"];
      await expect(recallManager.issueRecall(
        1,
        "Impurity detected",
        5,
        regions
      )).to.emit(recallManager, "RecallIssued")
        .withArgs(1, "Impurity detected", 5);
      
      expect(await recallManager.isRecalled(1)).to.be.true;
      const recalls = await recallManager.getRecalls(1);
      expect(recalls.length).to.equal(1);
      expect(recalls[0].reason).to.equal("Impurity detected");
      expect(recalls[0].severity).to.equal(5);
    });
    
    it("Should fail with invalid severity", async function () {
      const { recallManager } = await loadFixture(deployFixture);
      
      await expect(
        recallManager.issueRecall(1, "R", 6, [])
      ).to.be.revertedWith("Invalid severity");
    });
    
    it("Should fail if non-owner issues recall", async function () {
      const { recallManager, other } = await loadFixture(deployFixture);
      
      await expect(
        recallManager.connect(other).issueRecall(1, "R", 1, [])
      ).to.be.revertedWithCustomError(recallManager, "OwnableUnauthorizedAccount");
    });
  });
  
  describe("Recall Resolution", function () {
    it("Should resolve a recall", async function () {
      const { recallManager } = await loadFixture(deployFixture);
      
      await recallManager.issueRecall(1, "R1", 1, []);
      await expect(recallManager.resolveRecall(1, 0))
        .to.emit(recallManager, "RecallResolved")
        .withArgs(1);
      
      expect(await recallManager.isRecalled(1)).to.be.false;
      const active = await recallManager.getActiveRecalls(1);
      expect(active.length).to.equal(0);
    });
    
    it("Should remain recalled if other active recalls exist", async function () {
      const { recallManager } = await loadFixture(deployFixture);
      
      await recallManager.issueRecall(1, "R1", 1, []);
      await recallManager.issueRecall(1, "R2", 2, []);
      
      await recallManager.resolveRecall(1, 0);
      expect(await recallManager.isRecalled(1)).to.be.true;
      
      const active = await recallManager.getActiveRecalls(1);
      expect(active.length).to.equal(1);
      expect(active[0].reason).to.equal("R2");
    });
  });
});
