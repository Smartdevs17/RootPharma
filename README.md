# RootPharma - Drug Authentication dApp

A decentralized drug authentication system built on Base Ethereum that combats counterfeit medicine using blockchain technology and NFTs.

## 🎯 Overview

RootPharma provides an immutable, transparent verification system for pharmaceutical products. Manufacturers can mint batch NFTs representing drug batches, and consumers/pharmacists can verify drug authenticity instantly using QR codes or token IDs.

## ✨ Features

- ✅ **Batch NFT Minting**: Pharmaceutical companies can create NFTs for drug batches
- ✅ **Instant Verification**: Verify drug authenticity via QR scan or Token ID
- ✅ **Expiry Tracking**: Automatic validation of batch expiry dates
- ✅ **Batch Recall System**: Safety alerts for recalled products
- ✅ **Immutable Records**: Blockchain-secured data that cannot be altered
- ✅ **Base Network**: Low transaction costs and fast confirmations

## 🏗️ Architecture

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Manufacturer   │──────▶│  Smart Contract  │◀──────│    Consumer      │
│   (Mints Batch)  │       │   (DrugNFT.sol)  │       │  (Verifies Drug) │
└──────────────────┘       └──────────────────┘       └──────────────────┘
         │                          │                           │
         │                          ▼                           │
         │                    Base Sepolia                      │
         │                  (Blockchain Layer)                  │
         │                          │                           │
         ▼                          ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  QR Code         │       │  Batch Data      │       │  Mobile/Web      │
│  Generation      │       │  Storage         │       │  Scanner         │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

## 📁 Project Structure

```
RootPharma/
├── contracts/
│   └── DrugNFT.sol              # Main NFT contract
├── scripts/
│   └── deploy.js                # Deployment script
├── test/
│   └── DrugNFT.test.js          # Comprehensive tests
├── hardhat.config.js            # Hardhat configuration
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ and npm
- MetaMask wallet
- Base Sepolia testnet ETH (get from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

1. **Clone the repository**
   ```bash
   cd RootPharma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `PRIVATE_KEY`: Your wallet private key
   - `BASESCAN_API_KEY`: Your BaseScan API key (for verification)

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🧪 Testing

The project includes 22 comprehensive tests covering:

- Deployment and ownership
- Batch minting functionality
- Batch validation (expiry and recall checks)
- Batch recall system
- Ownership transfer
- Edge cases

Run tests with:
```bash
npm test                  # Run all tests
npm run test:coverage     # Run with coverage report
npm run test:gas          # Run with gas reporting
```

## 📦 Deployment

### Deploy to Base Sepolia

```bash
npm run deploy:sepolia
```

This will:
1. Deploy the DrugNFT contract
2. Mint a demo batch for testing
3. Save deployment info to `deployment-info.json`
4. Display verification instructions

### Verify Contract on BaseScan

```bash
npm run verify -- <CONTRACT_ADDRESS>
```

## 🔧 Smart Contract Functions

### Owner Functions

- `mintBatch(batchId, manufacturer, expiryDate, ipfsHash)` - Mint a new drug batch NFT
- `recallBatch(tokenId)` - Recall a batch for safety reasons
- `transferOwnership(newOwner)` - Transfer contract ownership

### Public View Functions

- `getBatchDetails(tokenId)` - Get complete batch information
- `isValid(tokenId)` - Check if batch is valid (not expired/recalled)
- `owner()` - Get contract owner address

## 📊 Contract Details

- **Solidity Version**: 0.8.20
- **Network**: Base Sepolia (Testnet)
- **Chain ID**: 84532
- **License**: MIT

## 🛠️ Development Scripts

```bash
npm run compile          # Compile contracts
npm test                 # Run tests
npm run test:coverage    # Generate coverage report
npm run test:gas         # Report gas usage
npm run deploy:sepolia   # Deploy to Base Sepolia
npm run verify           # Verify contract on BaseScan
npm run clean            # Clean artifacts
```

## 🔐 Security

- Contract uses OpenZeppelin patterns for security
- Owner-only functions protected with `onlyOwner` modifier
- Comprehensive test coverage
- Input validation on all functions

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for pharmaceutical safety and blockchain transparency.
