// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SupplyChainIntegration
 * @dev Integration contract between RootPharma and SupplyChainPayment
 */
contract SupplyChainIntegration is Ownable {
    
    // Address of the SupplyChainPayment contract
    address public supplyChainPayment;
    // Address of the BatchTransfer contract
    address public batchTransfer;
    
    mapping(uint256 => uint256) public batchToOrderId;
    mapping(uint256 => bool) public isLinked;
    
    event BatchLinkedToOrder(uint256 indexed batchId, uint256 indexed orderId);
    event IntegrationUpdated(address supplyChainPayment, address batchTransfer);
    
    constructor(address _supplyChainPayment, address _batchTransfer) Ownable(msg.sender) {
        supplyChainPayment = _supplyChainPayment;
        batchTransfer = _batchTransfer;
    }
    
    function linkBatchToOrder(uint256 _batchId, uint256 _orderId) external {
        // Validation logic would check if msg.sender has rights on both contracts
        require(!isLinked[_batchId], "Batch already linked");
        
        batchToOrderId[_batchId] = _orderId;
        isLinked[_batchId] = true;
        
        emit BatchLinkedToOrder(_batchId, _orderId);
    }
    
    function updateContracts(address _supplyChainPayment, address _batchTransfer) external onlyOwner {
        supplyChainPayment = _supplyChainPayment;
        batchTransfer = _batchTransfer;
        emit IntegrationUpdated(_supplyChainPayment, _batchTransfer);
    }
}
