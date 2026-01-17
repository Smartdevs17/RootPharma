import hre from "hardhat";
import fs from "fs";

const { ethers } = hre;

async function main() {
  console.log("========================================");
  console.log("DEPLOYING DRUGNFT CONTRACT");
  console.log("========================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Network:", hre.network.name);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
  console.log("---");

  // Deploy DrugNFT contract
  console.log("Deploying DrugNFT contract...");
  const DrugNFT = await ethers.getContractFactory("DrugNFT");
  const drugNFT = await DrugNFT.deploy();
  await drugNFT.waitForDeployment();

  const contractAddress = await drugNFT.getAddress();
  console.log("DrugNFT deployed to:", contractAddress);
  console.log("Contract Owner:", await drugNFT.owner());
  console.log("---");

  // Mint demo batch for testing
  console.log("Minting demo batch...");
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const oneYearFromNow = currentTimestamp + (365 * 24 * 60 * 60);

  const tx = await drugNFT.mintBatch(
    "BATCH-2025-PFZ-001",        // Batch ID
    "Pfizer Inc",                 // Manufacturer
    oneYearFromNow,               // Expiry (1 year from now)
    "QmDefault"                   // IPFS Hash (placeholder)
  );

  const receipt = await tx.wait();
  console.log("Demo batch minted successfully!");
  console.log("Transaction hash:", receipt.hash);
  console.log("Token ID: 1");
  console.log("Batch ID: BATCH-2025-PFZ-001");
  console.log("Manufacturer: Pfizer Inc");
  console.log("Expiry Date (timestamp):", oneYearFromNow);
  console.log("---");

  // Verify batch is valid
  const isValidBatch = await drugNFT.isValid(1);
  console.log("Batch is valid:", isValidBatch);
  console.log("---");

  console.log("========================================");
  console.log("DEPLOYMENT COMPLETE!");
  console.log("========================================");
  console.log("Contract Address:", contractAddress);
  console.log("Save this address for frontend configuration");
  console.log("Demo Token ID: 1 can be used for testing verification");
  console.log("---");

  // Save deployment info to file
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    demoTokenId: 1,
    demoBatchId: "BATCH-2025-PFZ-001"
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment-info.json");

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("---");
    console.log("Waiting for block confirmations...");
    await drugNFT.deploymentTransaction().wait(5);
    console.log("Confirmed!");
    console.log("---");
    console.log("To verify the contract on BaseScan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
