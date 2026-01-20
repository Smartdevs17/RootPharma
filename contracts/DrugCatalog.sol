// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DrugCatalog
 * @dev Comprehensive drug information database
 */
contract DrugCatalog is Ownable {
    
    struct DrugInfo {
        string drugName;
        string genericName;
        string activeIngredient;
        string dosageForm;
        string strength;
        string manufacturer;
        bool isApproved;
        uint256 registrationDate;
        string[] sideEffects;
        string[] contraindications;
    }
    
    mapping(uint256 => DrugInfo) public drugs;
    mapping(string => uint256) public drugNameToId;
    
    uint256 private _drugIdCounter;
    
    event DrugRegistered(uint256 indexed drugId, string drugName);
    event DrugApproved(uint256 indexed drugId);
    event DrugUpdated(uint256 indexed drugId);
    
    constructor() Ownable(msg.sender) {
        _drugIdCounter = 1;
    }
    
    function registerDrug(
        string memory _drugName,
        string memory _genericName,
        string memory _activeIngredient,
        string memory _dosageForm,
        string memory _strength,
        string memory _manufacturer
    ) external onlyOwner returns (uint256) {
        require(bytes(_drugName).length > 0, "Drug name required");
        require(drugNameToId[_drugName] == 0, "Drug already registered");
        
        uint256 drugId = _drugIdCounter++;
        
        drugs[drugId].drugName = _drugName;
        drugs[drugId].genericName = _genericName;
        drugs[drugId].activeIngredient = _activeIngredient;
        drugs[drugId].dosageForm = _dosageForm;
        drugs[drugId].strength = _strength;
        drugs[drugId].manufacturer = _manufacturer;
        drugs[drugId].isApproved = false;
        drugs[drugId].registrationDate = block.timestamp;
        
        drugNameToId[_drugName] = drugId;
        
        emit DrugRegistered(drugId, _drugName);
        return drugId;
    }
    
    function approveDrug(uint256 _drugId) external onlyOwner {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        drugs[_drugId].isApproved = true;
        emit DrugApproved(_drugId);
    }
    
    function addSideEffect(uint256 _drugId, string memory _sideEffect) external onlyOwner {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        drugs[_drugId].sideEffects.push(_sideEffect);
        emit DrugUpdated(_drugId);
    }
    
    function addContraindication(uint256 _drugId, string memory _contraindication) external onlyOwner {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        drugs[_drugId].contraindications.push(_contraindication);
        emit DrugUpdated(_drugId);
    }
    
    function getDrugInfo(uint256 _drugId) external view returns (
        string memory drugName,
        string memory genericName,
        string memory activeIngredient,
        string memory dosageForm,
        string memory strength,
        string memory manufacturer,
        bool isApproved
    ) {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        DrugInfo memory drug = drugs[_drugId];
        return (
            drug.drugName,
            drug.genericName,
            drug.activeIngredient,
            drug.dosageForm,
            drug.strength,
            drug.manufacturer,
            drug.isApproved
        );
    }
    
    function getSideEffects(uint256 _drugId) external view returns (string[] memory) {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        return drugs[_drugId].sideEffects;
    }
    
    function getContraindications(uint256 _drugId) external view returns (string[] memory) {
        require(_drugId > 0 && _drugId < _drugIdCounter, "Invalid drug ID");
        return drugs[_drugId].contraindications;
    }
}
