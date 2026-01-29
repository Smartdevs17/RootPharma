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
});
