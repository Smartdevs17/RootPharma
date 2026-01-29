const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("BatchTransfer", function () {
  async function deployFixture() {
    const [owner, from, to, other] = await ethers.getSigners();

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.deploy();

    return { batchTransfer, owner, from, to, other };
  }

  describe("Initiation", function () {
    it("Should initiate a transfer successfully", async function () {
      const { batchTransfer, from, to } = await loadFixture(deployFixture);
      
      const batchTokenId = 1;
      const location = "Warehouse A";
      const notes = "Shipping to Distributor";

      await expect(batchTransfer.connect(from).initiateTransfer(batchTokenId, to.address, location, notes))
        .to.emit(batchTransfer, "TransferInitiated")
        .withArgs(batchTokenId, from.address, to.address, anyValue);

      const history = await batchTransfer.getTransferHistory(batchTokenId);
      expect(history.length).to.equal(1);
      expect(history[0].from).to.equal(from.address);
      expect(history[0].to).to.equal(to.address);
      expect(history[0].isReceived).to.be.false;
    });

    it("Should fail if non-holder tries to initiate after first transfer", async function () {
      const { batchTransfer, from, to, other } = await loadFixture(deployFixture);
      
      // from -> to
      await batchTransfer.connect(from).initiateTransfer(1, to.address, "L", "N");
      await batchTransfer.connect(to).confirmReceipt(1);
      
      // 'other' is NOT holder
      await expect(batchTransfer.connect(other).initiateTransfer(1, from.address, "L", "N"))
        .to.be.revertedWith("Not current holder");
    });
  });

  describe("Confirmation", function () {
    it("Should confirm receipt successfully", async function () {
      const { batchTransfer, from, to } = await loadFixture(deployFixture);
      await batchTransfer.connect(from).initiateTransfer(1, to.address, "L", "N");
      
      await expect(batchTransfer.connect(to).confirmReceipt(1))
        .to.emit(batchTransfer, "TransferReceived")
        .withArgs(1, to.address);

      expect(await batchTransfer.getCurrentHolder(1)).to.equal(to.address);
      const history = await batchTransfer.getTransferHistory(1);
      expect(history[0].isReceived).to.be.true;
    });

    it("Should fail if non-recipient tries to confirm", async function () {
      const { batchTransfer, from, to, other } = await loadFixture(deployFixture);
      await batchTransfer.connect(from).initiateTransfer(1, to.address, "L", "N");
      
      await expect(batchTransfer.connect(other).confirmReceipt(1))
        .to.be.revertedWith("Not the recipient");
    });

    it("Should fail if no transfers found", async function () {
      const { batchTransfer, to } = await loadFixture(deployFixture);
      await expect(batchTransfer.connect(to).confirmReceipt(1))
        .to.be.revertedWith("No transfers found");
    });
  });

  describe("Ownership Flow", function () {
    it("Should only allow the current holder to initiate next transfer", async function () {
      const { batchTransfer, from, to, other } = await loadFixture(deployFixture);
      
      // from -> to
      await batchTransfer.connect(from).initiateTransfer(1, to.address, "L", "N");
      await batchTransfer.connect(to).confirmReceipt(1);
      
      // 'from' tries to initiate again
      await expect(batchTransfer.connect(from).initiateTransfer(1, other.address, "L", "N"))
        .to.be.revertedWith("Not current holder");
        
      // 'to' (current holder) initiates
      await expect(batchTransfer.connect(to).initiateTransfer(1, other.address, "L2", "N2"))
        .to.emit(batchTransfer, "TransferInitiated")
        .withArgs(1, to.address, other.address, anyValue);
    });
  });
});
