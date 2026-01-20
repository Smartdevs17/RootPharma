// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PharmacyVerifier {
    function verifyLicenseFormat(string memory license) internal pure returns (bool) {
        return bytes(license).length > 5;
    }
}
