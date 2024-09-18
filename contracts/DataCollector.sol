// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataCollector {
    struct DataPoint {
        uint256 timestamp;
        string data;
    }

    DataPoint[] public dataPoints;

    function addData(string memory _data) public {
        DataPoint memory newData = DataPoint({
            timestamp: block.timestamp,
            data: _data
        });
        dataPoints.push(newData);
    }

    function getData(uint256 index) public view returns (string memory) {
        return dataPoints[index].data;
    }
}
