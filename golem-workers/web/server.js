const { ethers } = require('ethers');
const express = require('express');
const bodyParser = require('body-parser');
const solc = require('solc');
require('dotenv').config();

const app = express();
const PORT = process.env.WORKER_PORT || 8000;

// Middleware
app.use(bodyParser.json());

// Configurazione Blockchain
const rpcUrl = process.env['PRIVATE_RPC_URL'];
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const privateKey = process.env['PRIVATE_KEY']; // Chiave privata tramite variabili d'ambiente
const wallet = new ethers.Wallet(privateKey, provider);

// Endpoint per il deploy del contratto
app.post('/deploy', async (req, res) => {
    const { contractCode } = req.body;

    if (!contractCode) {
        return res.status(400).json({ success: false, message: 'contractCode is required' });
    }

    try {
        // Compilazione del contratto
        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: contractCode,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode'],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            const errors = output.errors.filter((error) => error.severity === 'error');
            if (errors.length > 0) {
                return res.status(400).json({ success: false, message: 'Compilation failed', errors });
            }
        }

        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const contract = output.contracts['Contract.sol'][contractName];
        const bytecode = contract.evm.bytecode.object;
        const abi = contract.abi;

        // Creazione di un'istanza del contratto
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        const contractInstance = await factory.deploy();

        // Attendere il deploy
        await contractInstance.deployed();

        return res.status(200).json({ success: true, contractAddress: contractInstance.address });
    } catch (error) {
        console.error('Errore durante il deploy del contratto:', error);
        return res.status(500).json({ success: false, message: 'Deploy failed', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Worker is up and running');
});

app.listen(PORT, () => {
    console.log(`Worker server listening at http://localhost:${PORT}`);
});
