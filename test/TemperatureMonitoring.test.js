import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("TemperatureMonitoring", function () {
  async function deployFixture() {
    const [owner, sensor, other] = await ethers.getSigners();
    
    const TemperatureMonitoring = await ethers.getContractFactory("TemperatureMonitoring");
    const monitor = await TemperatureMonitoring.deploy();
    
    return { monitor, owner, sensor, other };
  }
  
  describe("Sensor Management", function () {
    it("Should authorize a sensor", async function () {
      const { monitor, sensor } = await loadFixture(deployFixture);
      
      await expect(monitor.authorizeSensor(sensor.address))
        .to.emit(monitor, "SensorAuthorized")
        .withArgs(sensor.address);
      
      expect(await monitor.authorizedSensors(sensor.address)).to.be.true;
    });
  });
  
  describe("Reading Management", function () {
    it("Should record a temperature reading", async function () {
      const { monitor, sensor } = await loadFixture(deployFixture);
      
      await monitor.authorizeSensor(sensor.address);
      
      await expect(monitor.connect(sensor).recordTemperature(1, 2550, "Warehouse A"))
        .to.emit(monitor, "TemperatureRecorded")
        .withArgs(1, 2550);
      
      const readings = await monitor.getReadings(1);
      expect(readings.length).to.equal(1);
      expect(readings[0].temperature).to.equal(2550);
      expect(readings[0].location).to.equal("Warehouse A");
    });
    
    it("Should fail if unauthorized sensor records reading", async function () {
      const { monitor, other } = await loadFixture(deployFixture);
      
      await expect(
        monitor.connect(other).recordTemperature(1, 2550, "W")
      ).to.be.revertedWith("Not authorized sensor");
    });
  });
  
  describe("Violation Tracking", function () {
    it("Should detect a high temperature violation", async function () {
      const { monitor, sensor } = await loadFixture(deployFixture);
      
      await monitor.authorizeSensor(sensor.address);
      await monitor.setTemperatureThreshold(1, 200, 800); // 2°C to 8°C
      
      await expect(monitor.connect(sensor).recordTemperature(1, 1000, "W"))
        .to.emit(monitor, "TemperatureViolation")
        .withArgs(1, 1000);
      
      expect(await monitor.hasViolations(1)).to.be.true;
    });

    it("Should detect a low temperature violation", async function () {
      const { monitor, sensor } = await loadFixture(deployFixture);
      
      await monitor.authorizeSensor(sensor.address);
      await monitor.setTemperatureThreshold(1, 200, 800);
      
      await expect(monitor.connect(sensor).recordTemperature(1, 100, "W"))
        .to.emit(monitor, "TemperatureViolation")
        .withArgs(1, 100);
      
      expect(await monitor.hasViolations(1)).to.be.true;
    });
  });
});
