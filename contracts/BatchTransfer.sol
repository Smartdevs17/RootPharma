// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BatchTransfer
 * @dev Tracks drug batch transfers through the supply chain
 */
contract BatchTransfer is Ownable {
    
    struct Transfer {
        uint256 batchTokenId;
        address from;
        address to;
        uint256 timestamp;
        string location;
        string notes;
        bool isReceived;
    }
    
    mapping(uint256 => Transfer[]) public batchTransfers;
    mapping(uint256 => address) public currentHolder;
    
    event TransferInitiated(
        uint256 indexed batchTokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    event TransferReceived(uint256 indexed batchTokenId, address indexed receiver);
    
    constructor() Ownable(msg.sender) {}
    
    function initiateTransfer(
        uint256 _batchTokenId,
        address _to,
        string memory _location,
        string memory _notes
    ) external {
        require(_to != address(0), "Invalid recipient");
        require(
            currentHolder[_batchTokenId] == msg.sender || currentHolder[_batchTokenId] == address(0),
            "Not current holder"
        );
        
        Transfer memory newTransfer = Transfer({
            batchTokenId: _batchTokenId,
            from: msg.sender,
            to: _to,
            timestamp: block.timestamp,
            location: _location,
            notes: _notes,
            isReceived: false
        });
        
        batchTransfers[_batchTokenId].push(newTransfer);
        
        emit TransferInitiated(_batchTokenId, msg.sender, _to, block.timestamp);
    }
    
    function confirmReceipt(uint256 _batchTokenId) external {
        Transfer[] storage transfers = batchTransfers[_batchTokenId];
        require(transfers.length > 0, "No transfers found");
        
        Transfer storage lastTransfer = transfers[transfers.length - 1];
        require(lastTransfer.to == msg.sender, "Not the recipient");
        require(!lastTransfer.isReceived, "Already received");
        
        lastTransfer.isReceived = true;
        currentHolder[_batchTokenId] = msg.sender;
        
        emit TransferReceived(_batchTokenId, msg.sender);
    }
    
    function getTransferHistory(uint256 _batchTokenId) external view returns (Transfer[] memory) {
        return batchTransfers[_batchTokenId];
    }
    
    function getCurrentHolder(uint256 _batchTokenId) external view returns (address) {
        return currentHolder[_batchTokenId];
    }
}
