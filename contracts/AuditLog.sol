// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library AuditLog {
    struct Entry {
        address actor;
        string action;
        uint256 timestamp;
        bytes32 dataHash;
    }
    
    event LogEntry(address indexed actor, string action, bytes32 dataHash);
    
    function log(address actor, string memory action, bytes32 dataHash) internal {
        emit LogEntry(actor, action, dataHash);
    }
}
