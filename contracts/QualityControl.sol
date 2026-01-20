// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QualityControl
 * @dev Quality assurance checkpoint system for drug batches
 */
contract QualityControl is Ownable {
    
    struct QualityCheck {
        uint256 batchTokenId;
        address inspector;
        uint256 timestamp;
        bool passed;
        string testType;
        string results;
        string notes;
    }
    
    mapping(uint256 => QualityCheck[]) public batchQualityChecks;
    mapping(address => bool) public authorizedInspectors;
    
    event InspectorAuthorized(address indexed inspector);
    event InspectorRevoked(address indexed inspector);
    event QualityCheckPerformed(
        uint256 indexed batchTokenId,
        address indexed inspector,
        bool passed
    );
    
    constructor() Ownable(msg.sender) {}
    
    function authorizeInspector(address _inspector) external onlyOwner {
        require(_inspector != address(0), "Invalid address");
        authorizedInspectors[_inspector] = true;
        emit InspectorAuthorized(_inspector);
    }
    
    function revokeInspector(address _inspector) external onlyOwner {
        authorizedInspectors[_inspector] = false;
        emit InspectorRevoked(_inspector);
    }
    
    function performQualityCheck(
        uint256 _batchTokenId,
        bool _passed,
        string memory _testType,
        string memory _results,
        string memory _notes
    ) external {
        require(authorizedInspectors[msg.sender], "Not authorized");
        
        QualityCheck memory check = QualityCheck({
            batchTokenId: _batchTokenId,
            inspector: msg.sender,
            timestamp: block.timestamp,
            passed: _passed,
            testType: _testType,
            results: _results,
            notes: _notes
        });
        
        batchQualityChecks[_batchTokenId].push(check);
        
        emit QualityCheckPerformed(_batchTokenId, msg.sender, _passed);
    }
    
    function getQualityChecks(uint256 _batchTokenId) external view returns (QualityCheck[] memory) {
        return batchQualityChecks[_batchTokenId];
    }
    
    function hasPassedQualityControl(uint256 _batchTokenId) external view returns (bool) {
        QualityCheck[] memory checks = batchQualityChecks[_batchTokenId];
        if (checks.length == 0) return false;
        
        for (uint256 i = 0; i < checks.length; i++) {
            if (!checks[i].passed) return false;
        }
        return true;
    }
}
