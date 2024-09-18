// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LogicContract {
    uint256 public value;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function setValue(uint256 _value) external {
        require(msg.sender == owner, "Only owner can set value");
        value = _value;
    }
    
    function getValue() external view returns (uint256) {
        return value;
    }
}
