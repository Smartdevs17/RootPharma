// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PrescriptionStorage {
    struct RxData {
        uint256 id;
        uint256 patientId;
        uint256 doctorId;
        uint256 medicationId;
        uint256 expiry;
        bool isFilled;
    }
}
