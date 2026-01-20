// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrescriptionVerifier
 * @dev Verification logic for prescriptions
 */
contract PrescriptionVerifier is Ownable {
    
    struct VerificationRule {
        string name;
        uint256 minValue; // e.g., expiry time buffer
        bool requiresActiveDoctor;
        bool isActive;
    }
    
    mapping(uint256 => VerificationRule) public rules;
    uint256 public ruleCount;
    
    event RuleAdded(uint256 indexed ruleId, string name);
    event VerificationFailed(uint256 indexed ruleId, string reason);
    
    constructor() Ownable(msg.sender) {}
    
    function addRule(string memory _name, uint256 _minValue, bool _requiresActiveDoctor) external onlyOwner {
        ruleCount++;
        rules[ruleCount] = VerificationRule(_name, _minValue, _requiresActiveDoctor, true);
        emit RuleAdded(ruleCount, _name);
    }
    
    function verify(uint256 _expiryTime, bool _doctorIsActive) external view returns (bool) {
        for (uint256 i = 1; i <= ruleCount; i++) {
            if (!rules[i].isActive) continue;
            
            if (_expiryTime < block.timestamp + rules[i].minValue) {
                return false;
            }
            
            if (rules[i].requiresActiveDoctor && !_doctorIsActive) {
                return false;
            }
        }
        return true;
    }
}
