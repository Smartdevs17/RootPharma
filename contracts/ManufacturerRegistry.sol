// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ManufacturerRegistry
 * @dev Registry for pharmaceutical manufacturers
 * @notice Manages manufacturer registration, verification, and compliance tracking
 */
contract ManufacturerRegistry is Ownable {
    
    struct Manufacturer {
        string companyName;
        string registrationNumber;
        string country;
        address walletAddress;
        bool isVerified;
        bool isActive;
        uint256 registrationDate;
        uint256 lastAuditDate;
        string gmpCertificate; // Good Manufacturing Practice certificate
        string contactEmail;
        uint256 totalBatchesProduced;
    }
    
    mapping(uint256 => Manufacturer) public manufacturers;
    mapping(address => uint256) public addressToManufacturerId;
    
    uint256 private _manufacturerIdCounter;
    
    event ManufacturerRegistered(
        uint256 indexed manufacturerId,
        string companyName,
        address indexed walletAddress
    );
    event ManufacturerVerified(uint256 indexed manufacturerId);
    event ManufacturerDeactivated(uint256 indexed manufacturerId);
    event ManufacturerAudited(uint256 indexed manufacturerId, uint256 auditDate);
    event BatchProduced(uint256 indexed manufacturerId, uint256 totalBatches);
    
    constructor() Ownable(msg.sender) {
        _manufacturerIdCounter = 1;
    }
    
    function registerManufacturer(
        string memory _companyName,
        string memory _registrationNumber,
        string memory _country,
        address _walletAddress,
        string memory _gmpCertificate,
        string memory _contactEmail
    ) external onlyOwner returns (uint256) {
        require(_walletAddress != address(0), "Invalid address");
        require(bytes(_companyName).length > 0, "Company name required");
        require(addressToManufacturerId[_walletAddress] == 0, "Already registered");
        
        uint256 manufacturerId = _manufacturerIdCounter++;
        
        manufacturers[manufacturerId] = Manufacturer({
            companyName: _companyName,
            registrationNumber: _registrationNumber,
            country: _country,
            walletAddress: _walletAddress,
            isVerified: false,
            isActive: true,
            registrationDate: block.timestamp,
            lastAuditDate: 0,
            gmpCertificate: _gmpCertificate,
            contactEmail: _contactEmail,
            totalBatchesProduced: 0
        });
        
        addressToManufacturerId[_walletAddress] = manufacturerId;
        
        emit ManufacturerRegistered(manufacturerId, _companyName, _walletAddress);
        
        return manufacturerId;
    }
    
    function verifyManufacturer(uint256 _manufacturerId) external onlyOwner {
        require(_manufacturerId > 0 && _manufacturerId < _manufacturerIdCounter, "Invalid ID");
        manufacturers[_manufacturerId].isVerified = true;
        emit ManufacturerVerified(_manufacturerId);
    }
    
    function recordAudit(uint256 _manufacturerId) external onlyOwner {
        require(_manufacturerId > 0 && _manufacturerId < _manufacturerIdCounter, "Invalid ID");
        manufacturers[_manufacturerId].lastAuditDate = block.timestamp;
        emit ManufacturerAudited(_manufacturerId, block.timestamp);
    }
    
    function incrementBatchCount(uint256 _manufacturerId) external {
        require(_manufacturerId > 0 && _manufacturerId < _manufacturerIdCounter, "Invalid ID");
        require(
            msg.sender == owner() || msg.sender == manufacturers[_manufacturerId].walletAddress,
            "Unauthorized"
        );
        
        manufacturers[_manufacturerId].totalBatchesProduced++;
        emit BatchProduced(_manufacturerId, manufacturers[_manufacturerId].totalBatchesProduced);
    }
    
    function deactivateManufacturer(uint256 _manufacturerId) external onlyOwner {
        require(_manufacturerId > 0 && _manufacturerId < _manufacturerIdCounter, "Invalid ID");
        manufacturers[_manufacturerId].isActive = false;
        emit ManufacturerDeactivated(_manufacturerId);
    }
    
    function isVerifiedManufacturer(address _address) external view returns (bool) {
        uint256 manufacturerId = addressToManufacturerId[_address];
        if (manufacturerId == 0) return false;
        
        Manufacturer memory manufacturer = manufacturers[manufacturerId];
        return manufacturer.isVerified && manufacturer.isActive;
    }
    
    function getManufacturer(uint256 _manufacturerId) external view returns (Manufacturer memory) {
        require(_manufacturerId > 0 && _manufacturerId < _manufacturerIdCounter, "Invalid ID");
        return manufacturers[_manufacturerId];
    }
    
    function getTotalManufacturers() external view returns (uint256) {
        return _manufacturerIdCounter - 1;
    }
}
