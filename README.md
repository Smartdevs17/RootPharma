# RootPharma - Drug Authentication Platform

## 📊 Project Statistics

- **Commits**: 30+
- **Contracts**: 31
- **Test Suites**: 18 (110+ test cases)
- **Deployed**: 17 contracts on Base Sepolia
- **Test Coverage**: 85%+

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy-smart.js --network baseSepolia
```

## 📝 Contracts

### Core Contracts
1. **DrugNFT.sol** - ✅ DEPLOYED `0xC9B5006Bd6F44c3EFc73e2a96637e286b7a37Fef`
2. **PharmacyRegistry.sol** - ✅ DEPLOYED `0xd4C7c06008ec2EdD2dd755F3721aE61A56a0b6F7`
3. **ManufacturerRegistry.sol** - ✅ DEPLOYED `0x80CF0C026c825b0F62a91353A35E3Dae3Ae45FE1`
4. **BatchTransfer.sol** - ✅ DEPLOYED `0x5B58a9B053Df3ea369f25154489620e44f21feE8`
5. **QualityControl.sol** - ✅ DEPLOYED `0x2459e24E3Ae52237BFd7fBb61E65bF2f291bB099`

### Supporting Contracts
6. **RegulatoryCompliance.sol** - ✅ DEPLOYED `0xa39192E571225B85e43EEe065F0e585f033B92B1`
7. **RewardToken.sol** - ✅ DEPLOYED `0xb94dbb5a5F12c2b37797F6D080cF3830adF2F2ff`
8. **DrugCatalog.sol** - ✅ DEPLOYED `0x2148eE18149EbC36878B94f2C6E598a27f5A3C2B`
9. **PrescriptionNFT.sol** - ✅ DEPLOYED `0x2F8EB311bcA92eb1c4AEE095511F34Cb2F2d7967`
10. **TemperatureMonitoring.sol** - ✅ DEPLOYED `0x44A370C3DD448672620dBb7a059F49F26157765C`
11. **RecallManagement.sol** - ✅ DEPLOYED `0xEa11a1165e732F1C6f7aAc84cc10327FA5D6a14A`
12. **AuditTrail.sol** - ✅ DEPLOYED `0xC69d2D0f9093901f4Cf6b5f9d82b7D2657aB9B3C`
13. **PatientRegistry.sol** - ✅ DEPLOYED `0x9EEcbDEAB648FF6EfE4b1768BeA7284b26B6aAA9`
14. **DoctorRegistry.sol** - ✅ DEPLOYED `0x4416083a7D56274a2B99FC004209CF16367d161d`
15. **DistributorRegistry.sol** - ✅ DEPLOYED `0xC31FF1E54Bd37475Bba8EDA4594A3F67017Cc9e8`
16. **SupplyChainIntegration.sol** - ✅ DEPLOYED `0x738419f247bE2accBA8C72574e0B1e899eAaD365`
17. **PrescriptionVerifier.sol** - ✅ DEPLOYED `0xcC9A77027D4E39f9861Be2573F569cE3b5325D51`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npx hardhat test test/PharmacyRegistry.test.js

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

## 🌐 Deployment

### Base Sepolia (Testnet)
```bash
npx hardhat run scripts/deploy-smart.js --network baseSepolia
```

### Base Mainnet
```bash
npx hardhat run scripts/deploy-smart.js --network base
```

## 🔍 Verification

```bash
npx hardhat verify --network baseSepolia 0xC9B5006Bd6F44c3EFc73e2a96637e286b7a37Fef
```

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Testing Guide](./docs/TESTING.md)

## 🔐 Security

- OpenZeppelin contracts
- Reentrancy guards
- Access control
- Comprehensive testing
- Gas optimizations

## 📄 License

MIT
