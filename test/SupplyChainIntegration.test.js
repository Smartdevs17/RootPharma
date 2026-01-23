import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("SupplyChainIntegration", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    
    // Using mock addresses for external contracts for unit testing
    const supplyChainPayment = "0xC664C097FadE25F9A6bFC20C4490697aA399578C";
    const batchTransfer = "0x5B58a9B053Df3ea369f25154489620e44f21feE8";
    
    const SupplyChainIntegration = await ethers.getContractFactory("SupplyChainIntegration");
    const integration = await SupplyChainIntegration.deploy(supplyChainPayment, batchTransfer);
    
    return { integration, owner, other, supplyChainPayment, batchTransfer };
  }
  
  describe("Initialization", function () {
    it("Should set correct external addresses", async function () {
      const { integration, supplyChainPayment, batchTransfer } = await loadFixture(deployFixture);
      expect(await integration.supplyChainPayment()).to.equal(supplyChainPayment);
      expect(await integration.batchTransfer()).to.equal(batchTransfer);
    });
  });
  
  describe("Linking", function () {
    it("Should link a batch to an order", async function () {
      const { integration } = await loadFixture(deployFixture);
      
      await expect(integration.linkBatchToOrder(1, 404))
        .to.emit(integration, "BatchLinkedToOrder")
        .withArgs(1, 404);
      
      expect(await integration.batchToOrderId(1)).to.equal(404);
      expect(await integration.isLinked(1)).to.be.true;
    });
    
    it("Should fail if already linked", async function () {
      const { integration } = await loadFixture(deployFixture);
      
      await integration.linkBatchToOrder(1, 404);
      await expect(
        integration.linkBatchToOrder(1, 505)
      ).to.be.revertedWith("Batch already linked");
    });
  });
  
  describe("Contract Updates", function () {
    it("Should allow owner to update addresses", async function () {
      const { integration } = await loadFixture(deployFixture);
      const newAddr = "0x0000000000000000000000000000000000000001";
      
      await expect(integration.updateContracts(newAddr, newAddr))
        .to.emit(integration, "IntegrationUpdated")
        .withArgs(newAddr, newAddr);
      
      expect(await integration.supplyChainPayment()).to.equal(newAddr);
    });
  });
});
