// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "zokrates/verifier.sol"; // Libreria zk-SNARK, pseudocodice

contract zkSNARKContract {
    Verifier verifier;

    constructor(address _verifier) {
        verifier = Verifier(_verifier);
    }

    function verifyProof(bytes memory proof, uint256[] memory inputs) public view returns (bool) {
        return verifier.verifyTx(proof, inputs);
    }
}
