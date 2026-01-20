// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DoctorRegistry
 * @dev Registry for verified medical practitioners
 */
contract DoctorRegistry is Ownable {
    
    struct Doctor {
        uint256 doctorId;
        string name;
        string licenseNumber;
        string specialization;
        address walletAddress;
        bool isVerified;
        bool isActive;
        uint256 registrationDate;
        uint256 totalPrescriptions;
    }
    
    mapping(uint256 => Doctor) public doctors;
    mapping(address => uint256) public addressToDoctorId;
    uint256 private _doctorIdCounter;
    
    event DoctorRegistered(uint256 indexed doctorId, address walletAddress);
    event DoctorVerified(uint256 indexed doctorId);
    event DoctorDeactivated(uint256 indexed doctorId);
    event PrescriptionIssued(uint256 indexed doctorId);
    
    constructor() Ownable(msg.sender) {
        _doctorIdCounter = 1;
    }
    
    function registerDoctor(
        string memory _name,
        string memory _licenseNumber,
        string memory _specialization,
        address _walletAddress
    ) external onlyOwner returns (uint256) {
        require(_walletAddress != address(0), "Invalid address");
        require(addressToDoctorId[_walletAddress] == 0, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_licenseNumber).length > 0, "License required");
        
        uint256 doctorId = _doctorIdCounter++;
        
        doctors[doctorId] = Doctor({
            doctorId: doctorId,
            name: _name,
            licenseNumber: _licenseNumber,
            specialization: _specialization,
            walletAddress: _walletAddress,
            isVerified: false,
            isActive: true,
            registrationDate: block.timestamp,
            totalPrescriptions: 0
        });
        
        addressToDoctorId[_walletAddress] = doctorId;
        
        emit DoctorRegistered(doctorId, _walletAddress);
        
        return doctorId;
    }
    
    function verifyDoctor(uint256 _doctorId) external onlyOwner {
        require(_doctorId > 0 && _doctorId < _doctorIdCounter, "Invalid ID");
        doctors[_doctorId].isVerified = true;
        emit DoctorVerified(_doctorId);
    }
    
    function incrementPrescriptionCount(uint256 _doctorId) external {
        require(_doctorId > 0 && _doctorId < _doctorIdCounter, "Invalid ID");
        Doctor storage doctor = doctors[_doctorId];
        require(doctor.walletAddress == msg.sender || msg.sender == owner(), "Unauthorized");
        
        doctor.totalPrescriptions++;
        emit PrescriptionIssued(_doctorId);
    }
    
    function deactivateDoctor(uint256 _doctorId) external onlyOwner {
        require(_doctorId > 0 && _doctorId < _doctorIdCounter, "Invalid ID");
        doctors[_doctorId].isActive = false;
        emit DoctorDeactivated(_doctorId);
    }
    
    function isVerifiedDoctor(address _address) external view returns (bool) {
        uint256 doctorId = addressToDoctorId[_address];
        if (doctorId == 0) return false;
        
        Doctor memory doctor = doctors[doctorId];
        return doctor.isVerified && doctor.isActive;
    }
    
    function getDoctor(uint256 _doctorId) external view returns (Doctor memory) {
        require(_doctorId > 0 && _doctorId < _doctorIdCounter, "Invalid ID");
        return doctors[_doctorId];
    }
    
    function getTotalDoctors() external view returns (uint256) {
        return _doctorIdCounter - 1;
    }
}
