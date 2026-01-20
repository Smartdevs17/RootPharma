// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DistributorRegistry
 * @dev Registry for pharmaceutical distributors
 */
contract DistributorRegistry is Ownable {
    
    struct Distributor {
        uint256 distributorId;
        string name;
        string licenseNumber;
        string region;
        address walletAddress;
        bool isVerified;
        bool isActive;
        uint256 totalDeliveries;
        uint256 registrationDate;
    }
    
    mapping(uint256 => Distributor) public distributors;
    mapping(address => uint256) public addressToDistributorId;
    uint256 private _distributorIdCounter;
    
    event DistributorRegistered(uint256 indexed distributorId, string name);
    event DistributorVerified(uint256 indexed distributorId);
    event DeliveryRecorded(uint256 indexed distributorId);
    event DistributorDeactivated(uint256 indexed distributorId);
    
    constructor() Ownable(msg.sender) {
        _distributorIdCounter = 1;
    }
    
    function registerDistributor(
        string memory _name,
        string memory _licenseNumber,
        string memory _region,
        address _walletAddress
    ) external onlyOwner returns (uint256) {
        require(_walletAddress != address(0), "Invalid address");
        require(addressToDistributorId[_walletAddress] == 0, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        
        uint256 distributorId = _distributorIdCounter++;
        
        distributors[distributorId] = Distributor({
            distributorId: distributorId,
            name: _name,
            licenseNumber: _licenseNumber,
            region: _region,
            walletAddress: _walletAddress,
            isVerified: false,
            isActive: true,
            totalDeliveries: 0,
            registrationDate: block.timestamp
        });
        
        addressToDistributorId[_walletAddress] = distributorId;
        
        emit DistributorRegistered(distributorId, _name);
        
        return distributorId;
    }
    
    function verifyDistributor(uint256 _distributorId) external onlyOwner {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        distributors[_distributorId].isVerified = true;
        emit DistributorVerified(_distributorId);
    }
    
    function recordDelivery(uint256 _distributorId) external {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        Distributor storage distributor = distributors[_distributorId];
        require(distributor.walletAddress == msg.sender || msg.sender == owner(), "Unauthorized");
        
        distributor.totalDeliveries++;
        emit DeliveryRecorded(_distributorId);
    }
    
    function deactivateDistributor(uint256 _distributorId) external onlyOwner {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        distributors[_distributorId].isActive = false;
        emit DistributorDeactivated(_distributorId);
    }
    
    function isVerifiedDistributor(address _address) external view returns (bool) {
        uint256 distributorId = addressToDistributorId[_address];
        if (distributorId == 0) return false;
        
        Distributor memory distributor = distributors[distributorId];
        return distributor.isVerified && distributor.isActive;
    }
    
    function getDistributor(uint256 _distributorId) external view returns (Distributor memory) {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        return distributors[_distributorId];
    }
    
    function getTotalDistributors() external view returns (uint256) {
        return _distributorIdCounter - 1;
    }
}
