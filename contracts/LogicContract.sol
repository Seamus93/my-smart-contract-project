// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LogicContract is Ownable {
    uint256 public value;
    AggregatorV3Interface internal priceFeed;

    event ValueChanged(uint256 newValue);
    event OracleDataFetched(int256 price);
    event ContractGenerated(address newContract);
    event TroubleEvent(string message);

    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        value = 0;
    }

    function setValue(uint256 _value) public onlyOwner {
        value = _value;
        emit ValueChanged(_value);
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    function getLatestPrice() public view returns (int256) {
        ( , int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function setValueBasedOnPrice(int256 threshold) public onlyOwner {
        int256 latestPrice = getLatestPrice();
        emit OracleDataFetched(latestPrice);
        if (latestPrice > threshold) {
            value = 1000;
        } else {
            value = 500;
        }
        emit ValueChanged(value);
    }

    function generateContract(bytes memory bytecode) public onlyOwner returns (address) {
        address newContract;
        assembly {
            newContract := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(newContract != address(0), "Contract creation failed");
        emit ContractGenerated(newContract);
        return newContract;
    }

    function triggerTroubleEvent(string memory message) public onlyOwner {
        emit TroubleEvent(message);
    }
}
