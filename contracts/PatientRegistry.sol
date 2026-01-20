// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PatientRegistry
 * @dev Manage patient records with privacy controls
 */
contract PatientRegistry is Ownable {
    
    struct Patient {
        uint256 patientId;
        bytes32 nameHash; // Privacy: store hash instead of name
        uint256 dateOfBirth;
        address walletAddress;
        bool isActive;
        uint256 registrationDate;
        mapping(address => bool) authorizedDoctors;
    }
    
    mapping(uint256 => Patient) public patients;
    mapping(address => uint256) public addressToPatientId;
    uint256 private _patientIdCounter;
    
    event PatientRegistered(uint256 indexed patientId, address walletAddress);
    event DoctorAuthorized(uint256 indexed patientId, address doctor);
    event DoctorRevoked(uint256 indexed patientId, address doctor);
    event PatientDeactivated(uint256 indexed patientId);
    
    constructor() Ownable(msg.sender) {
        _patientIdCounter = 1;
    }
    
    function registerPatient(
        bytes32 _nameHash,
        uint256 _dateOfBirth,
        address _walletAddress
    ) external returns (uint256) {
        require(_walletAddress != address(0), "Invalid address");
        require(addressToPatientId[_walletAddress] == 0, "Already registered");
        
        uint256 patientId = _patientIdCounter++;
        
        Patient storage patient = patients[patientId];
        patient.patientId = patientId;
        patient.nameHash = _nameHash;
        patient.dateOfBirth = _dateOfBirth;
        patient.walletAddress = _walletAddress;
        patient.isActive = true;
        patient.registrationDate = block.timestamp;
        
        addressToPatientId[_walletAddress] = patientId;
        
        emit PatientRegistered(patientId, _walletAddress);
        
        return patientId;
    }
    
    function authorizeDoctor(uint256 _patientId, address _doctor) external {
        require(_patientId > 0 && _patientId < _patientIdCounter, "Invalid ID");
        Patient storage patient = patients[_patientId];
        require(patient.walletAddress == msg.sender || msg.sender == owner(), "Unauthorized");
        
        patient.authorizedDoctors[_doctor] = true;
        
        emit DoctorAuthorized(_patientId, _doctor);
    }
    
    function revokeDoctor(uint256 _patientId, address _doctor) external {
        require(_patientId > 0 && _patientId < _patientIdCounter, "Invalid ID");
        Patient storage patient = patients[_patientId];
        require(patient.walletAddress == msg.sender || msg.sender == owner(), "Unauthorized");
        
        patient.authorizedDoctors[_doctor] = false;
        
        emit DoctorRevoked(_patientId, _doctor);
    }
    
    function isDoctorAuthorized(uint256 _patientId, address _doctor) external view returns (bool) {
        require(_patientId > 0 && _patientId < _patientIdCounter, "Invalid ID");
        return patients[_patientId].authorizedDoctors[_doctor];
    }
    
    function deactivatePatient(uint256 _patientId) external onlyOwner {
        require(_patientId > 0 && _patientId < _patientIdCounter, "Invalid ID");
        patients[_patientId].isActive = false;
        emit PatientDeactivated(_patientId);
    }
    
    function getTotalPatients() external view returns (uint256) {
        return _patientIdCounter - 1;
    }
}
