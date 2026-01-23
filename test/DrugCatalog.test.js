import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
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
        "Generic",
        "Ingredient",
        "Form",
        "Strength",
        "Bayer"
      )).to.emit(catalog, "DrugRegistered");
      
      const drug = await catalog.getDrugInfo(1);
      expect(drug.drugName).to.equal("Aspirin");
    });
    
    it("Should fail with empty name", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await expect(
        catalog.registerDrug("", "Description", "Manufacturer", "Uses", "S", "M")
      ).to.be.revertedWith("Drug name required");
    });
  });
  
  describe("Drug Approval", function () {
    it("Should approve drug", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await catalog.registerDrug("Aspirin", "G", "I", "F", "S", "M");
      
      await expect(catalog.approveDrug(1))
        .to.emit(catalog, "DrugApproved");
      
      const drug = await catalog.getDrugInfo(1);
      expect(drug.isApproved).to.be.true;
    });
  });
  
  describe("Side Effects", function () {
    it("Should add side effect", async function () {
      const { catalog } = await loadFixture(deployFixture);
      
      await catalog.registerDrug("Aspirin", "G", "I", "F", "S", "M");
      await catalog.addSideEffect(1, "Nausea");
      
      const effects = await catalog.getSideEffects(1);
      expect(effects.length).to.equal(1);
      expect(effects[0]).to.equal("Nausea");
    });
  });
});
