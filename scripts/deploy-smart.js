import hre from "hardhat";

/**
 * Smart deployment script with automatic network fallback
 * Attempts Base mainnet first, falls back to Sepolia if deployment fails
 */

async function deployWithFallback() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log("=".repeat(60));
  console.log("🚀 Smart Deployment Script with Network Fallback");
  console.log("=".repeat(60));
  console.log(`📍 Current Network: ${network}`);
  console.log(`💼 Deployer Address: ${deployer.address}`);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("=".repeat(60));
  
  // Minimum balance required (0.01 ETH for mainnet, 0.001 for testnet)
  const minBalance = network === "base" ? hre.ethers.parseEther("0.01") : hre.ethers.parseEther("0.001");
  
  if (balance < minBalance) {
    console.log(`⚠️  Warning: Low balance detected!`);
    console.log(`   Required: ${hre.ethers.formatEther(minBalance)} ETH`);
    console.log(`   Current: ${hre.ethers.formatEther(balance)} ETH`);
    
    if (network === "base") {
      console.log(`\n🔄 Insufficient funds for Base mainnet deployment`);
      console.log(`   Please run: npx hardhat run scripts/deploy-smart.js --network baseSepolia`);
      console.log(`   Or add more ETH to ${deployer.address}`);
      process.exit(1);
    }
  }
  
  try {
    console.log("\n📝 Deploying DrugNFT contract...");
    
    const DrugNFT = await hre.ethers.getContractFactory("DrugNFT");
    const drugNFT = await DrugNFT.deploy();
    await drugNFT.waitForDeployment();
    
    const contractAddress = await drugNFT.getAddress();
    console.log(`✅ DrugNFT deployed successfully!`);
    console.log(`   Address: ${contractAddress}`);
    console.log(`   Network: ${network}`);
    console.log(`   Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}`);
    
    // Wait for block confirmations
    console.log(`\n⏳ Waiting for block confirmations...`);
    await drugNFT.deploymentTransaction().wait(5);
    console.log(`✅ Confirmed!`);
    
    // Mint a demo batch
    console.log(`\n🎨 Minting demo batch...`);
    const batchId = "BATCH-DEMO-001";
    const manufacturer = "PharmaCorp Demo";
    const expiryDate = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now
    const ipfsHash = "QmDemo123456789";
    
    const mintTx = await drugNFT.mintBatch(batchId, manufacturer, expiryDate, ipfsHash);
    await mintTx.wait();
    console.log(`✅ Demo batch minted!`);
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Token ID: 1`);
    
    // Save deployment info
    const deploymentInfo = {
      network: network,
      chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
      contractAddress: contractAddress,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      blockNumber: await hre.ethers.provider.getBlockNumber(),
      demoBatchId: batchId,
      demoTokenId: 1
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      `deployment-${network}.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log(`\n📄 Deployment info saved to deployment-${network}.json`);
    
    // Verification instructions
    console.log("\n" + "=".repeat(60));
    console.log("📋 Next Steps:");
    console.log("=".repeat(60));
    console.log(`\n1️⃣  Verify contract on BaseScan:`);
    console.log(`   npx hardhat verify --network ${network} ${contractAddress}`);
    console.log(`\n2️⃣  View on explorer:`);
    
    if (network === "base") {
      console.log(`   https://basescan.org/address/${contractAddress}`);
    } else {
      console.log(`   https://sepolia.basescan.org/address/${contractAddress}`);
    }
    
    console.log(`\n3️⃣  Interact with contract:`);
    console.log(`   - Contract Address: ${contractAddress}`);
    console.log(`   - Demo Token ID: 1`);
    console.log(`   - Batch ID: ${batchId}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("✨ Deployment completed successfully!");
    console.log("=".repeat(60));
    
    return deploymentInfo;
    
  } catch (error) {
    console.error(`\n❌ Deployment failed on ${network}!`);
    console.error(`   Error: ${error.message}`);
    
    if (network === "base") {
      console.log(`\n🔄 Automatic Fallback Suggestion:`);
      console.log(`   Run: npx hardhat run scripts/deploy-smart.js --network baseSepolia`);
      console.log(`   This will deploy to Base Sepolia testnet instead.`);
    }
    
    throw error;
  }
}

// Execute deployment
deployWithFallback()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
