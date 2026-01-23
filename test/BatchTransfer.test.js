import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("BatchTransfer", function () {
  async function deployFixture() {
    const [owner, manufacturer, pharmacy, distributor] = await ethers.getSigners();
    
    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.deploy();
    
    return { batchTransfer, owner, manufacturer, pharmacy, distributor };
  }
  
  describe("Transfer Initiation", function () {
    it("Should initiate a transfer successfully", async function () {
      const { batchTransfer, manufacturer, pharmacy } = await loadFixture(deployFixture);
      
      const tx = await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        pharmacy.address,
        "London",
        "Batch shipment to pharmacy"
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "TransferInitiated");
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(1);
      expect(event.args[1]).to.equal(manufacturer.address);
      expect(event.args[2]).to.equal(pharmacy.address);
      
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      expect(event.args[3]).to.equal(block.timestamp);
    });
    
    it("Should fail with invalid addresses", async function () {
      const { batchTransfer, manufacturer } = await loadFixture(deployFixture);
      
      await expect(
        batchTransfer.connect(manufacturer).initiateTransfer(
          1,
          ethers.ZeroAddress,
          "Test",
          "Notes"
        )
      ).to.be.revertedWith("Invalid recipient");
    });
  });
  
  describe("Transfer Confirmation", function () {
    it("Should confirm receipt successfully", async function () {
      const { batchTransfer, manufacturer, pharmacy } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        pharmacy.address,
        "London",
        "Shipment"
      );
      
      await expect(batchTransfer.connect(pharmacy).confirmReceipt(1))
        .to.emit(batchTransfer, "TransferReceived");
      
      expect(await batchTransfer.currentHolder(1)).to.equal(pharmacy.address);
    });
    
    it("Should fail if not recipient", async function () {
      const { batchTransfer, manufacturer, pharmacy, distributor } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        pharmacy.address,
        "London",
        "Shipment"
      );
      
      await expect(
        batchTransfer.connect(distributor).confirmReceipt(1)
      ).to.be.revertedWith("Not the recipient");
    });
  });
  
  describe("Transfer History", function () {
    it("Should track multiple transfers for a batch", async function () {
      const { batchTransfer, manufacturer, pharmacy, distributor } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        distributor.address,
        "Hub 1",
        "To distributor"
      );
      
      await batchTransfer.connect(distributor).confirmReceipt(1);
      
      await batchTransfer.connect(distributor).initiateTransfer(
        1,
        pharmacy.address,
        "Hub 2",
        "To pharmacy"
      );
      
      const history = await batchTransfer.getTransferHistory(1);
      expect(history.length).to.equal(2);
    });
  });
});
