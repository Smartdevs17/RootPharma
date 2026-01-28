// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DrugNFT - Pharmaceutical Authentication System
/// @notice Manages drug batch NFTs with expiry tracking and recall functionality
/// @dev Implements a simplified ERC-721 style NFT for drug batches
/// @author RootPharma Team
contract DrugNFT {
    // ============================================
    // STATE VARIABLES
    // ============================================

    /// @notice Contract owner address (typically the manufacturer)
    address private _owner;

    /// @dev Internal tracker for assigning unique token IDs
    uint256 private _tokenIdCounter;

    /**
     * @notice Container for pharmaceutical batch information
     * @dev Contains all metadata for a pharmaceutical batch
     * @param batchId Unique identifier (e.g., "BATCH-2025-PFZ-001")
     * @param manufacturer Pharmaceutical company name
     * @param expiryDate UNIX timestamp of expiration
     * @param ipfsHash Document reference for certificates/lab results
     * @param isRecalled Flag indicating if batch has been flagged as unsafe
     */
    struct Batch {
        string batchId;
        string manufacturer;
        uint256 expiryDate;
        string ipfsHash;
        bool isRecalled;
    }

    // ============================================
    // MAPPINGS
    // ============================================

    /// @notice Maps token ID to current owner address
    mapping(uint256 => address) private _owners;

    /// @notice Access point for full batch metadata by ID
    mapping(uint256 => Batch) public batches;

    // ============================================
    // EVENTS
    // ============================================

    /// @notice Emitted when a new batch is minted
    /// @param tokenId The unique token ID of the minted batch
    /// @param batchId The batch identifier string
    /// @param manufacturer The name of the manufacturer
    event BatchMinted(
        uint256 indexed tokenId,
        string batchId,
        string manufacturer
    );

    /// @notice Emitted when a batch is recalled
    /// @param tokenId The token ID of the recalled batch
    event BatchRecalled(uint256 indexed tokenId);

    /// @notice Emitted when a token is transferred
    /// @param from Address of previous owner (address(0) for minting)
    /// @param to Address of new owner
    /// @param tokenId Token being transferred
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /// @notice Emitted when contract ownership is transferred
    /// @param previousOwner Address of previous owner
    /// @param newOwner Address of new owner
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ============================================
    // MODIFIERS
    // ============================================

    /// @notice Restricts function access to contract owner only
    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    /// @notice Initializes contract with deployer as owner
    /// @dev Sets _owner to msg.sender and emits OwnershipTransferred event
    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ============================================
    // PUBLIC VIEW FUNCTIONS
    // ============================================

    /// @notice Returns the contract owner address
    /// @return Address of the current owner
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @notice Retrieves complete batch information for a given token
     * @dev Reverts if token doesn't exist
     * @param tokenId The unique identifier of the drug batch
     * @return batchId The unique batch string (e.g., BATCH-001)
     * @return manufacturer Legal name of the producer
     * @return expiryDate UNIX timestamp of expiration
     * @return ipfsHash Link to certification documents
     * @return isRecalled Current safety status
     */
    function getBatchDetails(uint256 tokenId) public view returns (
        string memory batchId,
        string memory manufacturer,
        uint256 expiryDate,
        string memory ipfsHash,
        bool isRecalled
    ) {
        require(_owners[tokenId] != address(0), "Token does not exist");

        Batch memory batch = batches[tokenId];
        return (
            batch.batchId,
            batch.manufacturer,
            batch.expiryDate,
            batch.ipfsHash,
            batch.isRecalled
        );
    }

    /// @notice Checks if a drug batch is valid (not expired and not recalled)
    /// @dev Returns true only if batch exists, is not recalled, and hasn't expired
    /// @param tokenId The token ID to check
    /// @return Boolean indicating validity
    function isValid(uint256 tokenId) public view returns (bool) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        Batch memory batch = batches[tokenId];
        return !batch.isRecalled && batch.expiryDate > block.timestamp;
    }

    // ============================================
    // EXTERNAL FUNCTIONS (OWNER ONLY)
    // ============================================

    /**
     * @notice Records a new pharmaceutical batch on-chain
     * @dev Mints an NFT to the manufacturer (owner). Increments internal counter.
     * @param _batchId Unique batch reference
     * @param _manufacturer Name of the producing entity
     * @param _expiryDate UNIX timestamp of product expiration
     * @param _ipfsHash Reference to lab reports and certifications
     * @return newTokenId The ID assigned to the new batch NFT
     */
    function mintBatch(
        string memory _batchId,
        string memory _manufacturer,
        uint256 _expiryDate,
        string memory _ipfsHash
    ) public onlyOwner returns (uint256) {
        // Increment counter to get new token ID
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        // Mint the NFT to the owner
        _mint(msg.sender, newTokenId);

        // Store batch information
        batches[newTokenId] = Batch({
            batchId: _batchId,
            manufacturer: _manufacturer,
            expiryDate: _expiryDate,
            ipfsHash: _ipfsHash,
            isRecalled: false
        });

        // Emit event
        emit BatchMinted(newTokenId, _batchId, _manufacturer);

        return newTokenId;
    }

    /// @notice Recalls a drug batch (marks as unsafe)
    /// @dev Only owner can recall. Used for safety alerts and product recalls.
    /// @param tokenId The token ID to recall
    function recallBatch(uint256 tokenId) public onlyOwner {
        require(_owners[tokenId] != address(0), "Token does not exist");

        // Mark batch as recalled
        batches[tokenId].isRecalled = true;

        // Emit recall event
        emit BatchRecalled(tokenId);
    }

    /// @notice Transfers contract ownership to a new address
    /// @dev Only current owner can transfer ownership
    /// @param newOwner Address of the new owner
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");

        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    // ============================================
    // INTERNAL FUNCTIONS
    // ============================================

    /// @notice Internal function to mint NFT
    /// @dev Assigns token to owner and emits Transfer event
    /// @param to Address to mint to
    /// @param tokenId Token ID to mint
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(_owners[tokenId] == address(0), "ERC721: token already minted");

        // Assign ownership
        _owners[tokenId] = to;

        // Emit transfer event (from zero address indicates minting)
        emit Transfer(address(0), to, tokenId);
    }
}
