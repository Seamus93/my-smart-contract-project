// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AISecurity {
    struct ModelInfo {
        string modelName;
        string version;
        bool isValid;
    }

    mapping(string => ModelInfo) public models;

    function registerModel(string memory modelName, string memory version) public {
        models[modelName] = ModelInfo({
            modelName: modelName,
            version: version,
            isValid: false
        });
    }

    function validateModel(string memory modelName) public {
        require(bytes(models[modelName].modelName).length != 0, "Model does not exist");
        models[modelName].isValid = true;
    }

    function isModelValid(string memory modelName) public view returns (bool) {
        return models[modelName].isValid;
    }
}
