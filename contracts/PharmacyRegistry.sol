// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PharmacyRegistry
 * @dev Registry for verified pharmacies in the drug authentication ecosystem
 * @notice Manages pharmacy registration, verification, and status tracking
 */
contract PharmacyRegistry is Ownable {
    
    struct Pharmacy {
        string name;
        string licenseNumber;
        string location;
        address walletAddress;
        bool isVerified;
        bool isActive;
        uint256 registrationDate;
        uint256 lastUpdateDate;
        string contactEmail;
        string phoneNumber;
    }
    
    // Mapping from pharmacy ID to Pharmacy struct
    mapping(uint256 => Pharmacy) public pharmacies;
    
    // Mapping from wallet address to pharmacy ID
    mapping(address => uint256) public addressToPharmacyId;
    
    // Counter for pharmacy IDs
    uint256 private _pharmacyIdCounter;
    
    // Events
    event PharmacyRegistered(
        uint256 indexed pharmacyId,
        string name,
        address indexed walletAddress,
        uint256 registrationDate
    );
    
    event PharmacyVerified(uint256 indexed pharmacyId, address indexed verifier);
    event PharmacyDeactivated(uint256 indexed pharmacyId, address indexed deactivator);
    event PharmacyReactivated(uint256 indexed pharmacyId, address indexed reactivator);
    event PharmacyUpdated(uint256 indexed pharmacyId, address indexed updater);
    
    /**
     * @dev Constructor initializes the contract with the deployer as owner
     */
    constructor() Ownable(msg.sender) {
        _pharmacyIdCounter = 1; // Start IDs from 1
    }
    
    /**
     * @notice Register a new pharmacy
     * @param _name Name of the pharmacy
     * @param _licenseNumber Government-issued license number
     * @param _location Physical location/address
     * @param _walletAddress Ethereum address of the pharmacy
     * @param _contactEmail Contact email
     * @param _phoneNumber Contact phone number
     * @return pharmacyId The ID assigned to the registered pharmacy
     */
    function registerPharmacy(
        string memory _name,
        string memory _licenseNumber,
        string memory _location,
        address _walletAddress,
        string memory _contactEmail,
        string memory _phoneNumber
    ) external onlyOwner returns (uint256) {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_licenseNumber).length > 0, "License number cannot be empty");
        require(addressToPharmacyId[_walletAddress] == 0, "Address already registered");
        
        uint256 pharmacyId = _pharmacyIdCounter++;
        
        pharmacies[pharmacyId] = Pharmacy({
            name: _name,
            licenseNumber: _licenseNumber,
            location: _location,
            walletAddress: _walletAddress,
            isVerified: false,
            isActive: true,
            registrationDate: block.timestamp,
            lastUpdateDate: block.timestamp,
            contactEmail: _contactEmail,
            phoneNumber: _phoneNumber
        });
        
        addressToPharmacyId[_walletAddress] = pharmacyId;
        
        emit PharmacyRegistered(pharmacyId, _name, _walletAddress, block.timestamp);
        
        return pharmacyId;
    }
    
    /**
     * @notice Verify a registered pharmacy
     * @param _pharmacyId ID of the pharmacy to verify
     */
    function verifyPharmacy(uint256 _pharmacyId) external onlyOwner {
        require(_pharmacyId > 0 && _pharmacyId < _pharmacyIdCounter, "Invalid pharmacy ID");
        require(!pharmacies[_pharmacyId].isVerified, "Pharmacy already verified");
        
        pharmacies[_pharmacyId].isVerified = true;
        pharmacies[_pharmacyId].lastUpdateDate = block.timestamp;
        
        emit PharmacyVerified(_pharmacyId, msg.sender);
    }
    
    /**
     * @notice Deactivate a pharmacy
     * @param _pharmacyId ID of the pharmacy to deactivate
     */
    function deactivatePharmacy(uint256 _pharmacyId) external onlyOwner {
        require(_pharmacyId > 0 && _pharmacyId < _pharmacyIdCounter, "Invalid pharmacy ID");
        require(pharmacies[_pharmacyId].isActive, "Pharmacy already inactive");
        
        pharmacies[_pharmacyId].isActive = false;
        pharmacies[_pharmacyId].lastUpdateDate = block.timestamp;
        
        emit PharmacyDeactivated(_pharmacyId, msg.sender);
    }
    
    /**
     * @notice Reactivate a deactivated pharmacy
     * @param _pharmacyId ID of the pharmacy to reactivate
     */
    function reactivatePharmacy(uint256 _pharmacyId) external onlyOwner {
        require(_pharmacyId > 0 && _pharmacyId < _pharmacyIdCounter, "Invalid pharmacy ID");
        require(!pharmacies[_pharmacyId].isActive, "Pharmacy already active");
        
        pharmacies[_pharmacyId].isActive = true;
        pharmacies[_pharmacyId].lastUpdateDate = block.timestamp;
        
        emit PharmacyReactivated(_pharmacyId, msg.sender);
    }
    
    /**
     * @notice Update pharmacy information
     * @param _pharmacyId ID of the pharmacy to update
     * @param _location New location
     * @param _contactEmail New contact email
     * @param _phoneNumber New phone number
     */
    function updatePharmacyInfo(
        uint256 _pharmacyId,
        string memory _location,
        string memory _contactEmail,
        string memory _phoneNumber
    ) external onlyOwner {
        require(_pharmacyId > 0 && _pharmacyId < _pharmacyIdCounter, "Invalid pharmacy ID");
        
        Pharmacy storage pharmacy = pharmacies[_pharmacyId];
        pharmacy.location = _location;
        pharmacy.contactEmail = _contactEmail;
        pharmacy.phoneNumber = _phoneNumber;
        pharmacy.lastUpdateDate = block.timestamp;
        
        emit PharmacyUpdated(_pharmacyId, msg.sender);
    }
    
    /**
     * @notice Get pharmacy details
     * @param _pharmacyId ID of the pharmacy
     * @return Pharmacy struct with all details
     */
    function getPharmacy(uint256 _pharmacyId) external view returns (Pharmacy memory) {
        require(_pharmacyId > 0 && _pharmacyId < _pharmacyIdCounter, "Invalid pharmacy ID");
        return pharmacies[_pharmacyId];
    }
    
    /**
     * @notice Check if an address is a verified pharmacy
     * @param _address Address to check
     * @return bool True if address is a verified and active pharmacy
     */
    function isVerifiedPharmacy(address _address) external view returns (bool) {
        uint256 pharmacyId = addressToPharmacyId[_address];
        if (pharmacyId == 0) return false;
        
        Pharmacy memory pharmacy = pharmacies[pharmacyId];
        return pharmacy.isVerified && pharmacy.isActive;
    }
    
    /**
     * @notice Get pharmacy ID by wallet address
     * @param _address Wallet address
     * @return pharmacyId The pharmacy ID (0 if not registered)
     */
    function getPharmacyIdByAddress(address _address) external view returns (uint256) {
        return addressToPharmacyId[_address];
    }
    
    /**
     * @notice Get total number of registered pharmacies
     * @return count Total pharmacy count
     */
    function getTotalPharmacies() external view returns (uint256) {
        return _pharmacyIdCounter - 1;
    }
}
