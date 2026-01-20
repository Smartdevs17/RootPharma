# RootPharma - Drug Authentication Platform

## 📊 Project Statistics

- **Commits**: 21+
- **Contracts**: 14
- **Test Suites**: 4 (60+ test cases)
- **Deployed**: 1 contract on Base Sepolia
- **Test Coverage**: 70%+

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
2. **PharmacyRegistry.sol** - ✅ TESTED
3. **ManufacturerRegistry.sol** - ✅ TESTED
4. **BatchTransfer.sol** - ✅ TESTED
5. **QualityControl.sol** - ✅ TESTED

### Supporting Contracts
6. **RegulatoryCompliance.sol** - FDA/EMA/WHO approvals
7. **RewardToken.sol** - ERC20 ecosystem rewards
8. **DrugCatalog.sol** - Drug information database
9. **PrescriptionNFT.sol** - Digital prescriptions
10. **TemperatureMonitoring.sol** - Cold chain tracking
11. **RecallManagement.sol** - Enhanced batch recalls
12. **AuditTrail.sol** - Immutable operation logging
13. **PatientRegistry.sol** - Privacy-focused patient management
14. **DoctorRegistry.sol** - Medical practitioner verification

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
