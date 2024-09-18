// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Proxy {
    address public implementation;
    address public admin;

    constructor(address _implementation) {
        admin = msg.sender;
        implementation = _implementation;
    }

    function updateImplementation(address newImplementation) external {
        require(msg.sender == admin, "Only admin can update");
        implementation = newImplementation;
    }

    fallback() external payable {
        (bool success, bytes memory result) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
        assembly {
            return(add(result, 32), mload(result))
        }
    }
}
