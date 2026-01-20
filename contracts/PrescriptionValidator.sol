// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PrescriptionValidator {
    function isValidPrescription(uint256 id, uint256 dosage) internal pure returns (bool) {
        return id > 0 && dosage > 0;
    }
}
