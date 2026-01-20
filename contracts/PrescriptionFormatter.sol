// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PrescriptionFormatter {
    function formatPrescriptionId(string memory prefix, uint256 id) internal pure returns (string memory) {
        // Simple mock formatting
        return string(abi.encodePacked(prefix, "-", id)); 
        // Note: Integer to string conversion is complex in solidity, simplified for MVP
    }
}
