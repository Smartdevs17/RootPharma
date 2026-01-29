const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("DrugNFT", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const DrugNFT = await ethers.getContractFactory("DrugNFT");
    const drugNFT = await DrugNFT.deploy();

    return { drugNFT, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { drugNFT, owner } = await loadFixture(deployFixture);
      expect(await drugNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a batch successfully", async function () {
      const { drugNFT, owner } = await loadFixture(deployFixture);
      
      const batchId = "BATCH-001";
      const manufacturer = "RootPharma Corp";
      const expiryDate = (await time.latest()) + 3600; // 1 hour from now
      const ipfsHash = "QmHash123";

      await expect(drugNFT.mintBatch(batchId, manufacturer, expiryDate, ipfsHash))
        .to.emit(drugNFT, "BatchMinted")
        .withArgs(1, batchId, manufacturer);

      const details = await drugNFT.getBatchDetails(1);
      expect(details.batchId).to.equal(batchId);
      expect(details.manufacturer).to.equal(manufacturer);
      expect(details.expiryDate).to.equal(expiryDate);
      expect(details.ipfsHash).to.equal(ipfsHash);
      expect(details.isRecalled).to.equal(false);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const { drugNFT, otherAccount } = await loadFixture(deployFixture);
      
      await expect(drugNFT.connect(otherAccount).mintBatch(
        "B-002", "FakeCorp", 1234567890, "hash"
      )).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Validation", function () {
    const batchId = "BATCH-VALIDATE";
    const manufacturer = "RootPharma Corp";

    it("Should be valid if not recalled and not expired", async function () {
      const { drugNFT } = await loadFixture(deployFixture);
      const expiryDate = (await time.latest()) + 3600;
      await drugNFT.mintBatch(batchId, manufacturer, expiryDate, "hash");

      expect(await drugNFT.isValid(1)).to.be.true;
    });

    it("Should be invalid if recalled", async function () {
      const { drugNFT } = await loadFixture(deployFixture);
      const expiryDate = (await time.latest()) + 3600;
      await drugNFT.mintBatch(batchId, manufacturer, expiryDate, "hash");
      await drugNFT.recallBatch(1);

      expect(await drugNFT.isValid(1)).to.be.false;
    });

    it("Should be invalid if expired", async function () {
      const { drugNFT } = await loadFixture(deployFixture);
      const expiryDate = (await time.latest()) + 3600;
      await drugNFT.mintBatch(batchId, manufacturer, expiryDate, "hash");

      // Advance time beyond expiry
      await time.increase(7200);

      expect(await drugNFT.isValid(1)).to.be.false;
    });
  });

  describe("Recalling", function () {
    it("Should allow owner to recall a batch", async function () {
      const { drugNFT } = await loadFixture(deployFixture);
      const expiryDate = (await time.latest()) + 3600;
      await drugNFT.mintBatch("B-003", "PharmCo", expiryDate, "hash");

      await expect(drugNFT.recallBatch(1))
        .to.emit(drugNFT, "BatchRecalled")
        .withArgs(1);

      const details = await drugNFT.getBatchDetails(1);
      expect(details.isRecalled).to.be.true;
    });

    it("Should fail if non-owner tries to recall", async function () {
      const { drugNFT, otherAccount } = await loadFixture(deployFixture);
      const expiryDate = (await time.latest()) + 3600;
      await drugNFT.mintBatch("B-004", "PharmCo", expiryDate, "hash");

      await expect(drugNFT.connect(otherAccount).recallBatch(1))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
