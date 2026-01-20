import { expect } from "chai";
import { ethers } from "hardhat";
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
      
      await expect(batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        manufacturer.address,
        pharmacy.address,
        "Batch shipment to pharmacy"
      )).to.emit(batchTransfer, "TransferInitiated")
        .withArgs(1, 1, manufacturer.address, pharmacy.address);
    });
    
    it("Should fail with invalid addresses", async function () {
      const { batchTransfer, manufacturer } = await loadFixture(deployFixture);
      
      await expect(
        batchTransfer.connect(manufacturer).initiateTransfer(
          1,
          ethers.ZeroAddress,
          manufacturer.address,
          "Test"
        )
      ).to.be.revertedWith("Invalid addresses");
    });
  });
  
  describe("Transfer Confirmation", function () {
    it("Should confirm receipt successfully", async function () {
      const { batchTransfer, manufacturer, pharmacy } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        manufacturer.address,
        pharmacy.address,
        "Shipment"
      );
      
      await expect(batchTransfer.connect(pharmacy).confirmReceipt(1))
        .to.emit(batchTransfer, "TransferConfirmed");
      
      const transfer = await batchTransfer.getTransfer(1);
      expect(transfer.isConfirmed).to.be.true;
    });
    
    it("Should fail if not recipient", async function () {
      const { batchTransfer, manufacturer, pharmacy, distributor } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        manufacturer.address,
        pharmacy.address,
        "Shipment"
      );
      
      await expect(
        batchTransfer.connect(distributor).confirmReceipt(1)
      ).to.be.revertedWith("Not recipient");
    });
  });
  
  describe("Transfer History", function () {
    it("Should track multiple transfers for a batch", async function () {
      const { batchTransfer, manufacturer, pharmacy, distributor } = await loadFixture(deployFixture);
      
      await batchTransfer.connect(manufacturer).initiateTransfer(
        1,
        manufacturer.address,
        distributor.address,
        "To distributor"
      );
      
      await batchTransfer.connect(distributor).confirmReceipt(1);
      
      await batchTransfer.connect(distributor).initiateTransfer(
        1,
        distributor.address,
        pharmacy.address,
        "To pharmacy"
      );
      
      const history = await batchTransfer.getBatchHistory(1);
      expect(history.length).to.equal(2);
    });
  });
});
