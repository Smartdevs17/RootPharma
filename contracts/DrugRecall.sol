// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DrugRecall is Ownable {
    struct Recall {
        uint256 id;
        uint256 batchId;
        string reason;
        bool isCritical;
        uint256 timestamp;
    }
    
    mapping(uint256 => Recall) public recalls;
    uint256 public nextId = 1;
    
    event RecallInitiated(uint256 indexed id, uint256 batchId, bool isCritical);
    
    constructor() Ownable(msg.sender) {}
    
    function initiateRecall(uint256 _batchId, string memory _reason, bool _isCritical) external onlyOwner {
        recalls[nextId] = Recall(nextId, _batchId, _reason, _isCritical, block.timestamp);
        emit RecallInitiated(nextId, _batchId, _isCritical);
        nextId++;
    }
}
