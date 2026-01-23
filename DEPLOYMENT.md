# Deployment Guide

This guide walks you through deploying the RootPharma DrugNFT contract to Base Sepolia testnet and Base mainnet.

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js v18+ installed
- ✅ Project dependencies installed (`npm install`)
- ✅ MetaMask wallet configured
- ✅ Base Sepolia ETH for testnet deployment
- ✅ Base ETH for mainnet deployment
- ✅ BaseScan API key for contract verification

## Environment Setup

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and add your credentials:

```env
# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API Key for verification
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Alchemy API Key
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

### 3. Get Your Private Key

**⚠️ WARNING: Never share or commit your private key!**

From MetaMask:
1. Click the three dots menu
2. Select "Account Details"
3. Click "Show Private Key"
4. Enter your password
5. Copy the private key

### 4. Get BaseScan API Key

1. Visit [BaseScan](https://basescan.org/)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy and add to `.env`

## Getting Testnet Funds

### Base Sepolia Faucet

Get free Base Sepolia ETH from:

1. **Coinbase Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia

You'll need:
- A Coinbase account (for Coinbase faucet)
- Your wallet address
- Wait time: Usually instant to a few minutes

## Pre-Deployment Checklist

Before deploying, verify:

```bash
# 1. Compile contracts
npm run compile

# 2. Run tests
npm test

# 3. Check your balance
# Make sure you have enough ETH for deployment
```

Expected output:
```
✔ 22 passing (644ms)
```

## Deployment to Base Sepolia

### Step 1: Deploy Contract

Run the deployment script:

```bash
npm run deploy:sepolia
```

Expected output:
```
========================================
DEPLOYING DRUGNFT CONTRACT
========================================
Deployer address: 0xYourAddress...
Network: baseSepolia
Deployer balance: 0.5 ETH
---
Deploying DrugNFT contract...
DrugNFT deployed to: 0xContractAddress...
Contract Owner: 0xYourAddress...
---
Minting demo batch...
Demo batch minted successfully!
Transaction hash: 0xTxHash...
Token ID: 1
Batch ID: BATCH-2025-PFZ-001
Manufacturer: Pfizer Inc
Expiry Date (timestamp): 1736281234
---
Batch is valid: true
---
========================================
DEPLOYMENT COMPLETE!
========================================
Contract Address: 0xContractAddress...
Save this address for frontend configuration
Demo Token ID: 1 can be used for testing verification
---
Deployment info saved to deployment-info.json
---
Waiting for block confirmations...
Confirmed!
---
To verify the contract on BaseScan, run:
npx hardhat verify --network baseSepolia 0xContractAddress...
```

### Step 2: Save Contract Address

The deployment script automatically saves deployment info to `deployment-info.json`:

```json
{
  "network": "baseSepolia",
  "contractAddress": "0xYourContractAddress",
  "deployer": "0xYourAddress",
  "deploymentTime": "2025-01-17T22:00:00.000Z",
  "demoTokenId": 1,
  "demoBatchId": "BATCH-2025-PFZ-001"
}
```

**Important**: Save this contract address - you'll need it for:
- Frontend configuration
- Contract verification
- Future interactions

### Step 3: Verify Contract on BaseScan

Verify your contract to make it publicly readable:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

Example:
```bash
npx hardhat verify --network baseSepolia 0x1234567890abcdef1234567890abcdef12345678
```

Expected output:
```
Successfully submitted source code for contract
contracts/DrugNFT.sol:DrugNFT at 0xYourAddress
for verification on the block explorer. Waiting for verification result...

Successfully verified contract DrugNFT on BaseScan.
https://sepolia.basescan.org/address/0xYourAddress#code
```

### Step 4: Test Deployment

Test your deployed contract:

```bash
# Open Hardhat console
npx hardhat console --network baseSepolia
```

In the console:
```javascript
const DrugNFT = await ethers.getContractFactory("DrugNFT");
const drugNFT = await DrugNFT.attach("YOUR_CONTRACT_ADDRESS");

// Check owner
const owner = await drugNFT.owner();
console.log("Owner:", owner);

// Verify demo batch
const isValid = await drugNFT.isValid(1);
console.log("Demo batch is valid:", isValid);

// Get batch details
const details = await drugNFT.getBatchDetails(1);
console.log("Batch details:", details);
```

## Deployment to Base Mainnet

**⚠️ WARNING: Mainnet deployment uses real ETH. Double-check everything!**

### Prerequisites for Mainnet

- ✅ Thoroughly tested on testnet
- ✅ Security audit completed (recommended)
- ✅ Sufficient Base ETH for deployment (~0.01 ETH)
- ✅ All tests passing
- ✅ Code reviewed

### Mainnet Deployment Steps

1. **Update hardhat.config.js** (if needed)

The config already includes Base mainnet:
```javascript
base: {
  url: "https://mainnet.base.org",
  accounts: [PRIVATE_KEY],
  chainId: 8453,
  gasPrice: "auto",
}
```

2. **Deploy to Mainnet**

```bash
npx hardhat run scripts/deploy.js --network base
```

3. **Verify on BaseScan**

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

## Post-Deployment Tasks

### 1. Update Frontend Configuration

Update your frontend `.env` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
# or
NEXT_PUBLIC_CHAIN_ID=8453   # Base Mainnet
```

### 2. Test All Functions

Verify all contract functions work:

- ✅ Mint a batch
- ✅ Verify batch details
- ✅ Check batch validity
- ✅ Test recall functionality
- ✅ Test ownership transfer (if needed)

### 3. Monitor Contract

- Add contract to your wallet's watch list
- Monitor transactions on BaseScan
- Set up alerts for important events

### 4. Document Deployment

Create a deployment record:

```markdown
## Deployment Record

### Infrastructure Deployment (2026-01-23)
- **Network**: Base Sepolia
- **Deployer**: `0x575109e921C6d6a1Cb7cA60Be0191B10950AfA6C`

| Contract | Address |
|----------|---------|
| **DrugNFT** | `0xC9B5006Bd6F44c3EFc73e2a96637e286b7a37Fef` |
| **PharmacyRegistry** | `0xd4C7c06008ec2EdD2dd755F3721aE61A56a0b6F7` |
| **ManufacturerRegistry** | `0x80CF0C026c825b0F62a91353A35E3Dae3Ae45FE1` |
| **BatchTransfer** | `0x5B58a9B053Df3ea369f25154489620e44f21feE8` |
| **QualityControl** | `0x2459e24E3Ae52237BFd7fBb61E65bF2f291bB099` |
| **DistributorRegistry** | `0xC31FF1E54Bd37475Bba8EDA4594A3F67017Cc9e8` |
| **DoctorRegistry** | `0x4416083a7B56274a2B99FC004209CF16367d161d` |
| **PatientRegistry** | `0x9EEcbDEAB648FF6EfE4b1768BeA7284b26B6aAA9` |
| **DrugCatalog** | `0x2148eE18149EbC36878B94f2C6E598a27f5A3C2B` |
| **RegulatoryCompliance** | `0xa39192E571225B85e43EEe065F0e585f033B92B1` |
| **RewardToken** | `0xb94dbb5a5F12c2b37797F6D080cF3830adF2F2ff` |
| **PrescriptionNFT** | `0x2F8EB311bcA92eb1c4AEE095511F34Cb2F2d7967` |
| **RecallManagement** | `0xEa11a1165e732F1C6f7aAc84cc10327FA5D6a14A` |
| **AuditTrail** | `0xC69d2D0f9093901f4Cf6b5f9d82b7D2657aB9B3C` |
| **TemperatureMonitoring** | `0x44A370C3DD448672620dBb7a059F49F26157765C` |
| **SupplyChainIntegration** | `0x738419f247bE2accBA8C72574e0B1e899eAaD365` |
| **PrescriptionVerifier** | `0xcC9A77027D4E39f9861Be2573F569cE3b5325D51` |
```

## Troubleshooting

### Common Issues

#### 1. "Insufficient funds for gas"

**Solution**: Add more ETH to your wallet

```bash
# Check your balance
npx hardhat console --network baseSepolia
> const balance = await ethers.provider.getBalance("YOUR_ADDRESS");
> console.log(ethers.formatEther(balance));
```

#### 2. "Nonce too high"

**Solution**: Reset your MetaMask account

1. MetaMask → Settings → Advanced
2. Click "Reset Account"

#### 3. "Contract verification failed"

**Solution**: Ensure you're using the exact same compiler settings

```bash
# Check compiler version in hardhat.config.js
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
}
```

#### 4. "Network connection failed"

**Solution**: Try alternative RPC URLs

```javascript
// In hardhat.config.js
baseSepolia: {
  url: "https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
  // or
  url: "https://sepolia.base.org",
}
```

## Gas Optimization Tips

1. **Batch Operations**: Mint multiple batches in one transaction if possible
2. **Optimize String Storage**: Use shorter batch IDs and manufacturer names
3. **Monitor Gas Prices**: Deploy during low network activity
4. **Use Multicall**: For multiple read operations

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use hardware wallet for mainnet deployments
3. ✅ Test thoroughly on testnet first
4. ✅ Verify contract source code on BaseScan
5. ✅ Keep private keys secure
6. ✅ Use multi-signature wallet for contract ownership (production)
7. ✅ Implement timelock for critical operations (production)

## Next Steps

After successful deployment:

1. ✅ Deploy frontend application
2. ✅ Integrate contract with frontend
3. ✅ Test end-to-end flow
4. ✅ Create user documentation
5. ✅ Set up monitoring and alerts
6. ✅ Plan for contract upgrades (if needed)

## Support

For deployment issues:

1. Check [Hardhat Documentation](https://hardhat.org/docs)
2. Visit [Base Documentation](https://docs.base.org/)
3. Join [Base Discord](https://discord.gg/base)
4. Open an issue on GitHub

---

**Remember**: Always test on testnet before deploying to mainnet!
