// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrescriptionNFT
 * @dev Digital prescription system using NFTs
 */
contract PrescriptionNFT is ERC721, Ownable {
    
    struct Prescription {
        uint256 patientId;
        uint256 doctorId;
        uint256 drugId;
        string dosage;
        uint256 issueDate;
        uint256 expiryDate;
        bool isFilled;
        uint256 pharmacyId;
        string notes;
    }
    
    mapping(uint256 => Prescription) public prescriptions;
    uint256 private _tokenIdCounter;
    
    event PrescriptionIssued(uint256 indexed tokenId, uint256 patientId, uint256 doctorId);
    event PrescriptionFilled(uint256 indexed tokenId, uint256 pharmacyId);
    
    constructor() ERC721("Digital Prescription", "PRESC") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }
    
    function issuePrescription(
        address _patient,
        uint256 _patientId,
        uint256 _doctorId,
        uint256 _drugId,
        string memory _dosage,
        uint256 _expiryDate,
        string memory _notes
    ) external onlyOwner returns (uint256) {
        require(_patient != address(0), "Invalid patient address");
        require(_expiryDate > block.timestamp, "Invalid expiry date");
        
        uint256 tokenId = _tokenIdCounter++;
        
        prescriptions[tokenId] = Prescription({
            patientId: _patientId,
            doctorId: _doctorId,
            drugId: _drugId,
            dosage: _dosage,
            issueDate: block.timestamp,
            expiryDate: _expiryDate,
            isFilled: false,
            pharmacyId: 0,
            notes: _notes
        });
        
        _safeMint(_patient, tokenId);
        
        emit PrescriptionIssued(tokenId, _patientId, _doctorId);
        
        return tokenId;
    }
    
    function fillPrescription(uint256 _tokenId, uint256 _pharmacyId) external {
        require(_exists(_tokenId), "Prescription does not exist");
        require(!prescriptions[_tokenId].isFilled, "Already filled");
        require(prescriptions[_tokenId].expiryDate > block.timestamp, "Prescription expired");
        
        prescriptions[_tokenId].isFilled = true;
        prescriptions[_tokenId].pharmacyId = _pharmacyId;
        
        emit PrescriptionFilled(_tokenId, _pharmacyId);
    }
    
    function isValid(uint256 _tokenId) external view returns (bool) {
        if (!_exists(_tokenId)) return false;
        
        Prescription memory prescription = prescriptions[_tokenId];
        return !prescription.isFilled && prescription.expiryDate > block.timestamp;
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
