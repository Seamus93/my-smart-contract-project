// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AutoContractGenerator {
    event ContractGenerated(address newContract);

    function generateContract(bytes memory bytecode) public payable returns (address) {
        address newContract;
        assembly {
            newContract := create(callvalue(), add(bytecode, 0x20), mload(bytecode))
        }
        require(newContract != address(0), "Contract creation failed");
        emit ContractGenerated(newContract);
        return newContract;
    }
}
