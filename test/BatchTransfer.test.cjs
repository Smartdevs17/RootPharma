const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

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

    it("Should fail if recipient is zero address", async function () {
      const { batchTransfer, from } = await loadFixture(deployFixture);
      await expect(batchTransfer.connect(from).initiateTransfer(1, ethers.ZeroAddress, "L", "N"))
        .to.be.revertedWith("Invalid recipient");
    });
  });
});function anyValue(arg) { return true; }
