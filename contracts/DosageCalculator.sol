// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library DosageCalculator {
    function calculateDailyIntake(uint256 dosageMg, uint256 frequencyPerDay) internal pure returns (uint256) {
        return dosageMg * frequencyPerDay;
    }
    
    function isSafeDosage(uint256 dailyIntake, uint256 maxSafeLimit) internal pure returns (bool) {
        return dailyIntake <= maxSafeLimit;
    }
}
