// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token for rewarding ecosystem participants
 */
contract RewardToken is ERC20, Ownable {
    
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event RewardsMinted(address indexed to, uint256 amount);
    
    constructor() ERC20("RootPharma Reward Token", "RPRT") Ownable(msg.sender) {
        minters[msg.sender] = true;
    }
    
    function addMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid address");
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }
    
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }
    
    function mintRewards(address _to, uint256 _amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(_to, _amount);
        emit RewardsMinted(_to, _amount);
    }
    
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
