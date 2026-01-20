// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuditTrail
 * @dev Immutable audit trail for all drug batch operations
 */
contract AuditTrail is Ownable {
    
    struct AuditEntry {
        uint256 batchTokenId;
        string action;
        address actor;
        uint256 timestamp;
        string details;
        bytes32 dataHash;
    }
    
    AuditEntry[] public auditLog;
    mapping(uint256 => uint256[]) public batchAuditIndices;
    
    event AuditEntryCreated(uint256 indexed entryId, uint256 indexed batchTokenId, string action);
    
    constructor() Ownable(msg.sender) {}
    
    function logAction(
        uint256 _batchTokenId,
        string memory _action,
        string memory _details,
        bytes32 _dataHash
    ) external {
        uint256 entryId = auditLog.length;
        
        AuditEntry memory entry = AuditEntry({
            batchTokenId: _batchTokenId,
            action: _action,
            actor: msg.sender,
            timestamp: block.timestamp,
            details: _details,
            dataHash: _dataHash
        });
        
        auditLog.push(entry);
        batchAuditIndices[_batchTokenId].push(entryId);
        
        emit AuditEntryCreated(entryId, _batchTokenId, _action);
    }
    
    function getBatchAuditTrail(uint256 _batchTokenId) external view returns (AuditEntry[] memory) {
        uint256[] memory indices = batchAuditIndices[_batchTokenId];
        AuditEntry[] memory entries = new AuditEntry[](indices.length);
        
        for (uint256 i = 0; i < indices.length; i++) {
            entries[i] = auditLog[indices[i]];
        }
        
        return entries;
    }
    
    function getTotalAuditEntries() external view returns (uint256) {
        return auditLog.length;
    }
    
    function verifyDataHash(uint256 _entryId, bytes32 _expectedHash) external view returns (bool) {
        require(_entryId < auditLog.length, "Invalid entry ID");
        return auditLog[_entryId].dataHash == _expectedHash;
    }
}
