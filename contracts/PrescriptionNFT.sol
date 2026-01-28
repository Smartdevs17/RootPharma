// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrescriptionNFT
 * @dev Digital prescription system using NFTs
 */
contract PrescriptionNFT is ERC721, Ownable {
    
    /**
     * @notice Container for medical prescription details
     * @param patientId Unique clinical identifier for the patient
     * @param doctorId Registration ID of the issuing physician
     * @param drugId Product identifier for the medication
     * @param dosage Prescribed usage instructions
     * @param issueDate UNIX timestamp of issuance
     * @param expiryDate UNIX timestamp after which the prescription is void
     * @param isFilled True if the medication has been dispensed
     * @param pharmacyId Registration ID of the pharmacy that filled the order
     * @param notes Optional medical remarks or clinical indications
     */
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
    
    /// @notice Maps NFT token ID to its underlying medical data
    mapping(uint256 => Prescription) public prescriptions;
    
    /// @dev Internal tracker for unique token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Emitted when a physician issues a new digital prescription
    /// @param tokenId The unique NFT identifier
    /// @param patientId The patient's clinical ID
    /// @param doctorId The doctor's registration ID
    event PrescriptionIssued(uint256 indexed tokenId, uint256 patientId, uint256 doctorId);
    
    /// @notice Emitted when a pharmacy dispenses the medication
    /// @param tokenId The unique NFT identifier
    /// @param pharmacyId The pharmacy's registration ID
    event PrescriptionFilled(uint256 indexed tokenId, uint256 pharmacyId);
    
    constructor() ERC721("Digital Prescription", "PRESC") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }
    
    /**
     * @notice Mints a new prescription NFT to the patient's wallet
     * @dev Only the owner/registry can call this. Expiration must be in the future.
     * @param _patient Wallet address of the patient
     * @param _patientId Clinical ID of the patient
     * @param _doctorId Registration ID of the physician
     * @param _drugId Product index of the medication
     * @param _dosage Instructions for use
     * @param _expiryDate UNIX timestamp for validity end
     * @param _notes Clinical remarks
     * @return The unique token ID assigned
     */
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
    
    /**
     * @notice Marks a prescription as fulfilled by a pharmacy
     * @dev Reverts if already filled or expired
     * @param _tokenId The ID of the prescription NFT
     * @param _pharmacyId Registration ID of the dispensing pharmacy
     */
    function fillPrescription(uint256 _tokenId, uint256 _pharmacyId) external {
        require(_exists(_tokenId), "Prescription does not exist");
        require(!prescriptions[_tokenId].isFilled, "Already filled");
        require(prescriptions[_tokenId].expiryDate > block.timestamp, "Prescription expired");
        
        prescriptions[_tokenId].isFilled = true;
        prescriptions[_tokenId].pharmacyId = _pharmacyId;
        
        emit PrescriptionFilled(_tokenId, _pharmacyId);
    }
    
    /**
     * @notice View function to check if a prescription can still be filled
     * @param _tokenId The ID of the prescription NFT
     * @return True if not filled and not expired
     */
    function isValid(uint256 _tokenId) external view returns (bool) {
        if (!_exists(_tokenId)) return false;
        
        Prescription memory prescription = prescriptions[_tokenId];
        return !prescription.isFilled && prescription.expiryDate > block.timestamp;
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
