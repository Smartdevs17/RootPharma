// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ColdChainTracker {
    struct Reading {
        uint256 timestamp;
        int256 temperature;
        address reporter;
    }
    
    mapping(uint256 => Reading[]) public history;
    
    function addReading(uint256 shipmentId, int256 temp) external {
        history[shipmentId].push(Reading(block.timestamp, temp, msg.sender));
    }
}
