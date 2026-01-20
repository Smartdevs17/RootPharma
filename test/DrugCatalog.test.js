import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("DrugCatalog", function () {
  async function deployFixture() {
    const [owner, regulator, unauthorized] = await ethers.getSigners();
    
    const DrugCatalog = await ethers.getContractFactory("DrugCatalog");
    const catalog = await DrugCatalog.deploy();
    
    return { catalog, owner, regulator, unauthorized };
  }
  
  describe("Drug Registration", function () {
    it("Should register drug successfully", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await expect(catalog.registerDrug(
        "Aspirin",
        "Pain reliever",
        "Bayer",
        "Headache, fever"
      )).to.emit(catalog, "DrugRegistered");
      
      const drug = await catalog.getDrug(1);
      expect(drug.name).to.equal("Aspirin");
    });
    
    it("Should fail with empty name", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await expect(
        catalog.registerDrug("", "Description", "Manufacturer", "Uses")
      ).to.be.revertedWith("Name required");
    });
  });
  
  describe("Drug Approval", function () {
    it("Should approve drug", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await catalog.registerDrug("Aspirin", "Pain reliever", "Bayer", "Headache");
      
      await expect(catalog.approveDrug(1))
        .to.emit(catalog, "DrugApproved");
      
      expect(await catalog.isApproved(1)).to.be.true;
    });
  });
  
  describe("Side Effects", function () {
    it("Should add side effect", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await catalog.registerDrug("Aspirin", "Pain reliever", "Bayer", "Headache");
      await catalog.addSideEffect(1, "Nausea");
      
      const drug = await catalog.getDrug(1);
      expect(drug.sideEffects.length).to.equal(1);
    });
  });
});
