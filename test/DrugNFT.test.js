import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("DrugNFT", function () {
  let drugNFT;
  let owner;
  let user;
  let hacker;

  beforeEach(async function () {
    [owner, user, hacker] = await ethers.getSigners();

    const DrugNFT = await ethers.getContractFactory("DrugNFT");
    drugNFT = await DrugNFT.deploy();
    await drugNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await drugNFT.owner()).to.equal(owner.address);
    });

    it("Should start with token counter at 0", async function () {
      // Verify no tokens exist yet
      await expect(drugNFT.getBatchDetails(1)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Batch Minting", function () {
    it("Should mint a batch successfully", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60; // 1 year from now

      await expect(
        drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest123")
      )
        .to.emit(drugNFT, "BatchMinted")
        .withArgs(1, "BATCH-001", "Pfizer Inc")
        .and.to.emit(drugNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, owner.address, 1);

      const [batchId, manufacturer, expiry, ipfsHash, isRecalled] =
        await drugNFT.getBatchDetails(1);

      expect(batchId).to.equal("BATCH-001");
      expect(manufacturer).to.equal("Pfizer Inc");
      expect(expiry).to.equal(expiryDate);
      expect(ipfsHash).to.equal("QmTest123");
      expect(isRecalled).to.be.false;
    });

    it("Should mint multiple batches with incremental token IDs", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;

      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmHash1");
      await drugNFT.mintBatch("BATCH-002", "Moderna Inc", expiryDate, "QmHash2");
      await drugNFT.mintBatch("BATCH-003", "J&J", expiryDate, "QmHash3");

      const [batchId1] = await drugNFT.getBatchDetails(1);
      const [batchId2] = await drugNFT.getBatchDetails(2);
      const [batchId3] = await drugNFT.getBatchDetails(3);

      expect(batchId1).to.equal("BATCH-001");
      expect(batchId2).to.equal("BATCH-002");
      expect(batchId3).to.equal("BATCH-003");
    });

    it("Should revert if non-owner tries to mint", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;

      await expect(
        drugNFT.connect(user).mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Batch Validation", function () {
    it("Should return true for valid batch", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      expect(await drugNFT.isValid(1)).to.be.true;
    });

    it("Should return false for expired batch", async function () {
      const expiryDate = (await time.latest()) + 100; // Expires in 100 seconds
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      // Fast forward time past expiry
      await time.increase(101);

      expect(await drugNFT.isValid(1)).to.be.false;
    });

    it("Should return false for recalled batch", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      await drugNFT.recallBatch(1);

      expect(await drugNFT.isValid(1)).to.be.false;
    });

    it("Should revert when checking non-existent token", async function () {
      await expect(drugNFT.isValid(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Batch Recall", function () {
    it("Should recall a batch successfully", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      await expect(drugNFT.recallBatch(1))
        .to.emit(drugNFT, "BatchRecalled")
        .withArgs(1);

      const [, , , , isRecalled] = await drugNFT.getBatchDetails(1);
      expect(isRecalled).to.be.true;
    });

    it("Should revert if non-owner tries to recall", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      await expect(
        drugNFT.connect(hacker).recallBatch(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when recalling non-existent token", async function () {
      await expect(drugNFT.recallBatch(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Batch Details", function () {
    it("Should retrieve batch details correctly", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest123");

      const [batchId, manufacturer, expiry, ipfsHash, isRecalled] =
        await drugNFT.getBatchDetails(1);

      expect(batchId).to.equal("BATCH-001");
      expect(manufacturer).to.equal("Pfizer Inc");
      expect(expiry).to.equal(expiryDate);
      expect(ipfsHash).to.equal("QmTest123");
      expect(isRecalled).to.be.false;
    });

    it("Should revert when querying non-existent token", async function () {
      await expect(drugNFT.getBatchDetails(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Ownership Transfer", function () {
    it("Should transfer ownership successfully", async function () {
      await expect(drugNFT.transferOwnership(user.address))
        .to.emit(drugNFT, "OwnershipTransferred")
        .withArgs(owner.address, user.address);

      expect(await drugNFT.owner()).to.equal(user.address);
    });

    it("Should prevent old owner from minting after transfer", async function () {
      await drugNFT.transferOwnership(user.address);

      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await expect(
        drugNFT.connect(owner).mintBatch("BATCH-001", "Test", expiryDate, "QmTest")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow new owner to mint after transfer", async function () {
      await drugNFT.transferOwnership(user.address);

      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await expect(
        drugNFT.connect(user).mintBatch("BATCH-001", "Test", expiryDate, "QmTest")
      ).to.emit(drugNFT, "BatchMinted");
    });

    it("Should revert when transferring to zero address", async function () {
      await expect(
        drugNFT.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("Ownable: new owner is the zero address");
    });

    it("Should revert if non-owner tries to transfer ownership", async function () {
      await expect(
        drugNFT.connect(hacker).transferOwnership(hacker.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle batch at exact expiry time", async function () {
      const expiryDate = (await time.latest()) + 100;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "QmTest");

      // Set time to exact expiry
      await time.increaseTo(expiryDate);

      // At expiry timestamp, should be invalid (expired)
      expect(await drugNFT.isValid(1)).to.be.false;
    });

    it("Should handle empty IPFS hash", async function () {
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;
      await drugNFT.mintBatch("BATCH-001", "Pfizer Inc", expiryDate, "");

      const [, , , ipfsHash] = await drugNFT.getBatchDetails(1);
      expect(ipfsHash).to.equal("");
    });

    it("Should handle very long batch IDs and manufacturer names", async function () {
      const longBatchId = "BATCH-".repeat(50);
      const longManufacturer = "Pharmaceutical Company ".repeat(20);
      const expiryDate = (await time.latest()) + 365 * 24 * 60 * 60;

      await drugNFT.mintBatch(longBatchId, longManufacturer, expiryDate, "QmTest");

      const [batchId, manufacturer] = await drugNFT.getBatchDetails(1);
      expect(batchId).to.equal(longBatchId);
      expect(manufacturer).to.equal(longManufacturer);
    });
  });
});
