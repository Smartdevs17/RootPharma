// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DistributorRegistry
 * @dev Registry for pharmaceutical distributors
 */
contract DistributorRegistry is Ownable {
    
    /**
     * @notice Data structure for a registered distributor
     * @param distributorId Unique identifier for the distributor
     * @param name Company or entity name
     * @param licenseNumber Regulatory license identifier
     * @param region Operational region or jurisdiction
     * @param walletAddress The blockchain address for permissions and payments
     * @param isVerified True if the distributor has been vetted by the admin
     * @param isActive True if the distributor is currently authorized to operate
     * @param totalDeliveries Count of successful deliveries made
     * @param registrationDate UNIX timestamp of registration
     */
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
    
    /// @notice Maps distributor ID to their full profile
    mapping(uint256 => Distributor) public distributors;
    
    /// @notice Quick lookup to find a distributor ID by wallet address
    mapping(address => uint256) public addressToDistributorId;
    
    /// @dev Internal tracker for assigning unique IDs
    uint256 private _distributorIdCounter;
    
    /// @notice Emitted when a new distributor is registered
    event DistributorRegistered(uint256 indexed distributorId, string name);
    
    /// @notice Emitted when a distributor is verified by the admin
    event DistributorVerified(uint256 indexed distributorId);
    
    /// @notice Emitted when a delivery is recorded for a distributor
    event DeliveryRecorded(uint256 indexed distributorId);
    
    /// @notice Emitted when a distributor is deactivated
    event DistributorDeactivated(uint256 indexed distributorId);
    
    constructor() Ownable(msg.sender) {
        _distributorIdCounter = 1;
    }
    
    /**
     * @notice Registers a new distributor (Admin only)
     * @param _name Company name
     * @param _licenseNumber License identifier
     * @param _region Operational region
     * @param _walletAddress Blockchain address
     * @return The assigned distributor ID
     */
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
    
    /**
     * @notice Verifies a distributor (Admin only)
     * @param _distributorId The ID to verify
     */
    function verifyDistributor(uint256 _distributorId) external onlyOwner {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        distributors[_distributorId].isVerified = true;
        emit DistributorVerified(_distributorId);
    }
    
    /**
     * @notice Records a successful delivery for metrics
     * @dev Can be called by the distributor or admin
     * @param _distributorId The ID of the distributor
     */
    function recordDelivery(uint256 _distributorId) external {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        Distributor storage distributor = distributors[_distributorId];
        require(distributor.walletAddress == msg.sender || msg.sender == owner(), "Unauthorized");
        
        distributor.totalDeliveries++;
        emit DeliveryRecorded(_distributorId);
    }
    
    /**
     * @notice Deactivates a distributor (Admin only)
     * @param _distributorId The ID to deactivate
     */
    function deactivateDistributor(uint256 _distributorId) external onlyOwner {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        distributors[_distributorId].isActive = false;
        emit DistributorDeactivated(_distributorId);
    }
    
    /**
     * @notice Checks if an address belongs to a verified and active distributor
     * @param _address The address to check
     * @return True if valid
     */
    function isVerifiedDistributor(address _address) external view returns (bool) {
        uint256 distributorId = addressToDistributorId[_address];
        if (distributorId == 0) return false;
        
        Distributor memory distributor = distributors[distributorId];
        return distributor.isVerified && distributor.isActive;
    }
    
    /**
     * @notice Gets the full distributor profile
     * @param _distributorId The ID to fetch
     * @return The Distributor struct
     */
    function getDistributor(uint256 _distributorId) external view returns (Distributor memory) {
        require(_distributorId > 0 && _distributorId < _distributorIdCounter, "Invalid ID");
        return distributors[_distributorId];
    }
    
    /**
     * @notice Gets the total count of registered distributors
     * @return The count
     */
    function getTotalDistributors() external view returns (uint256) {
        return _distributorIdCounter - 1;
    }
}
