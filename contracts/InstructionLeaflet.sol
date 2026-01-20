// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InstructionLeaflet is Ownable {
    mapping(uint256 => string) public leaflets; // Batch ID -> IPFS Hash
    
    event LeafletUploaded(uint256 indexed batchId, string ipfsHash);
    
    constructor() Ownable(msg.sender) {}
    
    function uploadLeaflet(uint256 batchId, string memory ipfsHash) external onlyOwner {
        leaflets[batchId] = ipfsHash;
        emit LeafletUploaded(batchId, ipfsHash);
    }
}
