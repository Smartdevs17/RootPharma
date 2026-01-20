// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RecallManagement
 * @dev Enhanced batch recall system with notifications
 */
contract RecallManagement is Ownable {
    
    struct Recall {
        uint256 batchTokenId;
        string reason;
        uint256 recallDate;
        address recalledBy;
        bool isActive;
        string[] affectedRegions;
        uint256 severity; // 1-5, 5 being most severe
    }
    
    mapping(uint256 => Recall[]) public batchRecalls;
    mapping(uint256 => bool) public isRecalled;
    
    event RecallIssued(uint256 indexed batchTokenId, string reason, uint256 severity);
    event RecallResolved(uint256 indexed batchTokenId);
    event RegionAdded(uint256 indexed batchTokenId, string region);
    
    constructor() Ownable(msg.sender) {}
    
    function issueRecall(
        uint256 _batchTokenId,
        string memory _reason,
        uint256 _severity,
        string[] memory _affectedRegions
    ) external onlyOwner {
        require(_severity >= 1 && _severity <= 5, "Invalid severity");
        
        Recall memory recall = Recall({
            batchTokenId: _batchTokenId,
            reason: _reason,
            recallDate: block.timestamp,
            recalledBy: msg.sender,
            isActive: true,
            affectedRegions: _affectedRegions,
            severity: _severity
        });
        
        batchRecalls[_batchTokenId].push(recall);
        isRecalled[_batchTokenId] = true;
        
        emit RecallIssued(_batchTokenId, _reason, _severity);
    }
    
    function resolveRecall(uint256 _batchTokenId, uint256 _recallIndex) external onlyOwner {
        require(_recallIndex < batchRecalls[_batchTokenId].length, "Invalid index");
        batchRecalls[_batchTokenId][_recallIndex].isActive = false;
        
        bool hasActiveRecall = false;
        for (uint256 i = 0; i < batchRecalls[_batchTokenId].length; i++) {
            if (batchRecalls[_batchTokenId][i].isActive) {
                hasActiveRecall = true;
                break;
            }
        }
        
        if (!hasActiveRecall) {
            isRecalled[_batchTokenId] = false;
        }
        
        emit RecallResolved(_batchTokenId);
    }
    
    function getRecalls(uint256 _batchTokenId) external view returns (Recall[] memory) {
        return batchRecalls[_batchTokenId];
    }
    
    function getActiveRecalls(uint256 _batchTokenId) external view returns (Recall[] memory) {
        Recall[] memory allRecalls = batchRecalls[_batchTokenId];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < allRecalls.length; i++) {
            if (allRecalls[i].isActive) activeCount++;
        }
        
        Recall[] memory activeRecalls = new Recall[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allRecalls.length; i++) {
            if (allRecalls[i].isActive) {
                activeRecalls[index] = allRecalls[i];
                index++;
            }
        }
        
        return activeRecalls;
    }
}
