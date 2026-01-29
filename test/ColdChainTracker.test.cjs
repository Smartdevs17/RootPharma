const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ColdChainTracker", function () {
  async function deployFixture() {
    const [owner, reporter] = await ethers.getSigners();

    const ColdChainTracker = await ethers.getContractFactory("ColdChainTracker");
    const tracker = await ColdChainTracker.deploy();

    return { tracker, owner, reporter };
  }

  describe("Readings", function () {
    it("Should record a temperature reading correctly", async function () {
      const { tracker, reporter } = await loadFixture(deployFixture);
      
      const shipmentId = 123;
      const temperature = 2500; // 25.00C

      await tracker.connect(reporter).addReading(shipmentId, temperature);

      const reading = await tracker.history(shipmentId, 0);
      expect(reading.temperature).to.equal(temperature);
      expect(reading.reporter).to.equal(reporter.address);
      expect(reading.timestamp).to.be.closeTo(await time.latest(), 2);
    });

    it("Should store multiple readings for the same shipment", async function () {
      const { tracker, reporter } = await loadFixture(deployFixture);
      
      const shipmentId = 123;
      await tracker.connect(reporter).addReading(shipmentId, 2500);
      await tracker.connect(reporter).addReading(shipmentId, 2400);

      const r1 = await tracker.history(shipmentId, 0);
      const r2 = await tracker.history(shipmentId, 1);
      
      expect(r1.temperature).to.equal(2500);
      expect(r2.temperature).to.equal(2400);
    });
  });
});
