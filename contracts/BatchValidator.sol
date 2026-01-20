// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library BatchValidator {
    function validateBatchData(string memory batchId, uint256 expirationDate) internal view returns (bool) {
        return bytes(batchId).length > 0 && expirationDate > block.timestamp;
    }
}
