// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentralizedStorage {
    mapping(string => string) public dataHashes;

    function storeData(string memory key, string memory ipfsHash) public {
        dataHashes[key] = ipfsHash;
    }

    function retrieveData(string memory key) public view returns (string memory) {
        return dataHashes[key];
    }
}
