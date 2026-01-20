#!/bin/bash

# Phase 2 Development Script
# Automates common development tasks

set -e

echo "🚀 RootPharma Phase 2 Development Helper"
echo "========================================="

# Function to run tests
run_tests() {
    echo "📝 Running tests..."
    npm test
    echo "✅ Tests completed"
}

# Function to compile contracts
compile() {
    echo "🔨 Compiling contracts..."
    npx hardhat compile
    echo "✅ Compilation completed"
}

# Function to deploy
deploy() {
    local network=$1
    echo "🚀 Deploying to $network..."
    npx hardhat run scripts/deploy-smart.js --network $network
    echo "✅ Deployment completed"
}

# Function to verify
verify() {
    local address=$1
    local network=$2
    echo "🔍 Verifying contract at $address on $network..."
    npx hardhat verify --network $network $address
    echo "✅ Verification completed"
}

# Function to create new contract
new_contract() {
    local name=$1
    echo "📄 Creating new contract: $name..."
    cat > "contracts/$name.sol" << EOF
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title $name
 * @dev TODO: Add description
 */
contract $name is Ownable {
    constructor() Ownable(msg.sender) {}
    
    // TODO: Add contract logic
}
EOF
    echo "✅ Contract created at contracts/$name.sol"
}

# Function to create new test
new_test() {
    local name=$1
    echo "🧪 Creating new test: $name..."
    cat > "test/$name.test.js" << EOF
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("$name", function () {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("$name");
    const contract = await Contract.deploy();
    return { contract, owner };
  }
  
  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });
});
EOF
    echo "✅ Test created at test/$name.test.js"
}

# Main menu
case "$1" in
    test)
        run_tests
        ;;
    compile)
        compile
        ;;
    deploy)
        deploy ${2:-baseSepolia}
        ;;
    verify)
        verify $2 ${3:-baseSepolia}
        ;;
    new-contract)
        new_contract $2
        ;;
    new-test)
        new_test $2
        ;;
    all)
        compile
        run_tests
        ;;
    *)
        echo "Usage: $0 {test|compile|deploy|verify|new-contract|new-test|all}"
        echo ""
        echo "Commands:"
        echo "  test              - Run all tests"
        echo "  compile           - Compile contracts"
        echo "  deploy [network]  - Deploy to network (default: baseSepolia)"
        echo "  verify <address> [network] - Verify contract"
        echo "  new-contract <name> - Create new contract template"
        echo "  new-test <name>   - Create new test template"
        echo "  all               - Compile and test"
        exit 1
esac
