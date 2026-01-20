// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TemperatureMonitoring
 * @dev Cold chain temperature monitoring for drug batches
 */
contract TemperatureMonitoring is Ownable {
    
    struct TemperatureReading {
        uint256 batchTokenId;
        int256 temperature; // in Celsius * 100 (e.g., 2550 = 25.50°C)
        uint256 timestamp;
        string location;
        address sensor;
    }
    
    mapping(uint256 => TemperatureReading[]) public batchReadings;
    mapping(address => bool) public authorizedSensors;
    mapping(uint256 => int256) public minTemperature;
    mapping(uint256 => int256) public maxTemperature;
    
    event SensorAuthorized(address indexed sensor);
    event SensorRevoked(address indexed sensor);
    event TemperatureRecorded(uint256 indexed batchTokenId, int256 temperature);
    event TemperatureViolation(uint256 indexed batchTokenId, int256 temperature);
    event ThresholdSet(uint256 indexed batchTokenId, int256 min, int256 max);
    
    constructor() Ownable(msg.sender) {}
    
    function authorizeSensor(address _sensor) external onlyOwner {
        require(_sensor != address(0), "Invalid sensor address");
        authorizedSensors[_sensor] = true;
        emit SensorAuthorized(_sensor);
    }
    
    function revokeSensor(address _sensor) external onlyOwner {
        authorizedSensors[_sensor] = false;
        emit SensorRevoked(_sensor);
    }
    
    function setTemperatureThreshold(
        uint256 _batchTokenId,
        int256 _minTemp,
        int256 _maxTemp
    ) external onlyOwner {
        require(_minTemp < _maxTemp, "Invalid temperature range");
        minTemperature[_batchTokenId] = _minTemp;
        maxTemperature[_batchTokenId] = _maxTemp;
        emit ThresholdSet(_batchTokenId, _minTemp, _maxTemp);
    }
    
    function recordTemperature(
        uint256 _batchTokenId,
        int256 _temperature,
        string memory _location
    ) external {
        require(authorizedSensors[msg.sender], "Not authorized sensor");
        
        TemperatureReading memory reading = TemperatureReading({
            batchTokenId: _batchTokenId,
            temperature: _temperature,
            timestamp: block.timestamp,
            location: _location,
            sensor: msg.sender
        });
        
        batchReadings[_batchTokenId].push(reading);
        
        emit TemperatureRecorded(_batchTokenId, _temperature);
        
        // Check for violations
        if (_temperature < minTemperature[_batchTokenId] || 
            _temperature > maxTemperature[_batchTokenId]) {
            emit TemperatureViolation(_batchTokenId, _temperature);
        }
    }
    
    function getReadings(uint256 _batchTokenId) external view returns (TemperatureReading[] memory) {
        return batchReadings[_batchTokenId];
    }
    
    function hasViolations(uint256 _batchTokenId) external view returns (bool) {
        TemperatureReading[] memory readings = batchReadings[_batchTokenId];
        int256 min = minTemperature[_batchTokenId];
        int256 max = maxTemperature[_batchTokenId];
        
        for (uint256 i = 0; i < readings.length; i++) {
            if (readings[i].temperature < min || readings[i].temperature > max) {
                return true;
            }
        }
        return false;
    }
}
