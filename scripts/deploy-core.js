import hre from "hardhat";
import fs from 'fs';

async function deployCore() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log("=".repeat(60));
  console.log("🚀 RootPharma Core Deployment");
  console.log("=".repeat(60));
  console.log(`📍 Network: ${network}`);
  console.log(`💼 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("-".repeat(60));

  const contracts = [
    "PharmacyRegistry",
    "ManufacturerRegistry",
    "BatchTransfer",
    "QualityControl"
  ];

  const deploymentResults = {};
  
  // Load existing deployment info if available
  const deploymentFile = `deployment-${network}.json`;
  let existingDeployment = {};
  if (fs.existsSync(deploymentFile)) {
    existingDeployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    console.log(`📝 Loaded existing deployment for ${network}`);
  }

  for (const contractName of contracts) {
    console.log(`\n📄 Deploying ${contractName}...`);
    const Factory = await hre.ethers.getContractFactory(contractName);
    const contract = await Factory.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log(`✅ ${contractName} deployed to: ${address}`);
    deploymentResults[contractName] = address;
    
    // Wait for a few confirmations
    console.log(`⏳ Waiting for confirmations...`);
    await contract.deploymentTransaction().wait(2);
  }

  // Combine results
  const finalDeployment = {
    ...existingDeployment,
    network,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    contracts: {
      ...(existingDeployment.contracts || {}),
      ...deploymentResults
    },
    // Keep DrugNFT at root if it was there
    contractAddress: existingDeployment.contractAddress || deploymentResults.DrugNFT,
    lastUpdate: new Date().toISOString(),
    deployer: deployer.address
  };

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(finalDeployment, null, 2)
  );

  console.log("\n" + "=".repeat(60));
  console.log("✨ Core Deployment Complete!");
  console.log(`📄 Results saved to ${deploymentFile}`);
  console.log("=".repeat(60));
  
  console.log("\nNext Steps (Verification):");
  for (const [name, addr] of Object.entries(deploymentResults)) {
    console.log(`npx hardhat verify --network ${network} ${addr}`);
  }
}

deployCore()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
