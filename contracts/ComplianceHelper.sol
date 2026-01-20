// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ComplianceHelper {
    function generateComplianceHash(string memory standard, uint256 version) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(standard, version));
    }
}
