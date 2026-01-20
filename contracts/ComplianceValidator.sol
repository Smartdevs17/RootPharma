// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ComplianceValidator {
    function isCompliant(address entity, bool hasLicense) internal pure returns (bool) {
        return entity != address(0) && hasLicense;
    }
}
