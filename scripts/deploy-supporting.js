import hre from "hardhat";
import fs from 'fs';

async function deploySupporting() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log("=".repeat(60));
  console.log("🚀 RootPharma Supporting Contracts Deployment");
  console.log("=".repeat(60));
  console.log(`📍 Network: ${network}`);
  console.log(`💼 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("-".repeat(60));

  const contracts = [
    "DistributorRegistry",
    "DoctorRegistry",
    "PatientRegistry",
    "DrugCatalog",
    "RegulatoryCompliance",
    "RewardToken",
    "PrescriptionNFT",
    "RecallManagement",
    "AuditTrail",
    "TemperatureMonitoring",
    "SupplyChainIntegration",
    "PrescriptionVerifier"
  ];

  const deploymentResults = {};
  
  // Load existing deployment info
  const deploymentFile = `deployment-${network}.json`;
  let deploymentData = {};
  if (fs.existsSync(deploymentFile)) {
    deploymentData = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    console.log(`📝 Loaded existing deployment records from ${deploymentFile}`);
  } else {
    deploymentData = {
        network,
        contracts: {}
    };
  }

  for (const contractName of contracts) {
    if (deploymentData.contracts[contractName]) {
      console.log(`\n⏩ Skipping ${contractName}, already deployed at ${deploymentData.contracts[contractName]}`);
      continue;
    }

    console.log(`\n📄 Deploying ${contractName}...`);
    const Factory = await hre.ethers.getContractFactory(contractName);
    
    let contract;
    if (contractName === "SupplyChainIntegration") {
      const supplyChainPaymentAddr = "0xC664C097FadE25F9A6bFC20C4490697aA399578C";
      const batchTransferAddr = deploymentData.contracts["BatchTransfer"];
      console.log(`🔗 Using SupplyChainPayment: ${supplyChainPaymentAddr}`);
      console.log(`🔗 Using BatchTransfer: ${batchTransferAddr}`);
      contract = await Factory.deploy(supplyChainPaymentAddr, batchTransferAddr);
    } else {
      contract = await Factory.deploy();
    }
    
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log(`✅ ${contractName} deployed to: ${address}`);
    deploymentResults[contractName] = address;
    
    // Add to main deployment data
    deploymentData.contracts[contractName] = address;
    
    // Save progress after each deployment
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

    // Wait for block confirmations and add extra delay for nonce stability
    console.log(`⏳ Waiting for confirmations and network stability...`);
    await contract.deploymentTransaction().wait(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Final update to deployment file
  deploymentData.lastUpdate = new Date().toISOString();
  deploymentData.totalContracts = Object.keys(deploymentData.contracts).length + (deploymentData.contractAddress ? 1 : 0);

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("\n" + "=".repeat(60));
  console.log("✨ Supporting Contracts Deployment Complete!");
  console.log(`📄 Results saved/updated in ${deploymentFile}`);
  console.log(`📊 Total Deployed Contracts: ${deploymentData.totalContracts}`);
  console.log("=".repeat(60));
  
  console.log("\nNext Steps (Verification):");
  for (const [name, addr] of Object.entries(deploymentResults)) {
    console.log(`npx hardhat verify --network ${network} ${addr}`);
  }
}

deploySupporting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
