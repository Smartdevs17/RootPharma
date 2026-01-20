// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RegulatoryCompliance
 * @dev Tracks regulatory approvals and compliance for drug batches
 */
contract RegulatoryCompliance is Ownable {
    
    struct RegulatoryApproval {
        string regulatoryBody;
        string approvalNumber;
        uint256 approvalDate;
        uint256 expiryDate;
        bool isActive;
        string documentHash;
    }
    
    mapping(uint256 => RegulatoryApproval[]) public batchApprovals;
    mapping(string => bool) public recognizedRegulatoryBodies;
    
    event RegulatoryBodyRecognized(string bodyName);
    event ApprovalGranted(uint256 indexed batchTokenId, string regulatoryBody);
    event ApprovalRevoked(uint256 indexed batchTokenId, string regulatoryBody);
    
    constructor() Ownable(msg.sender) {
        recognizedRegulatoryBodies["FDA"] = true;
        recognizedRegulatoryBodies["EMA"] = true;
        recognizedRegulatoryBodies["WHO"] = true;
    }
    
    function recognizeRegulatoryBody(string memory _bodyName) external onlyOwner {
        recognizedRegulatoryBodies[_bodyName] = true;
        emit RegulatoryBodyRecognized(_bodyName);
    }
    
    function grantApproval(
        uint256 _batchTokenId,
        string memory _regulatoryBody,
        string memory _approvalNumber,
        uint256 _expiryDate,
        string memory _documentHash
    ) external onlyOwner {
        require(recognizedRegulatoryBodies[_regulatoryBody], "Body not recognized");
        
        RegulatoryApproval memory approval = RegulatoryApproval({
            regulatoryBody: _regulatoryBody,
            approvalNumber: _approvalNumber,
            approvalDate: block.timestamp,
            expiryDate: _expiryDate,
            isActive: true,
            documentHash: _documentHash
        });
        
        batchApprovals[_batchTokenId].push(approval);
        emit ApprovalGranted(_batchTokenId, _regulatoryBody);
    }
    
    function revokeApproval(uint256 _batchTokenId, uint256 _approvalIndex) external onlyOwner {
        require(_approvalIndex < batchApprovals[_batchTokenId].length, "Invalid index");
        batchApprovals[_batchTokenId][_approvalIndex].isActive = false;
        emit ApprovalRevoked(_batchTokenId, batchApprovals[_batchTokenId][_approvalIndex].regulatoryBody);
    }
    
    function getApprovals(uint256 _batchTokenId) external view returns (RegulatoryApproval[] memory) {
        return batchApprovals[_batchTokenId];
    }
    
    function isCompliant(uint256 _batchTokenId) external view returns (bool) {
        RegulatoryApproval[] memory approvals = batchApprovals[_batchTokenId];
        if (approvals.length == 0) return false;
        
        for (uint256 i = 0; i < approvals.length; i++) {
            if (approvals[i].isActive && approvals[i].expiryDate > block.timestamp) {
                return true;
            }
        }
        return false;
    }
}
