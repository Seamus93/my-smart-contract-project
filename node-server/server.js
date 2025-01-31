// node-server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Per CORS
const { ethers } = require('ethers');
const solc = require('solc');
const axios = require('axios');
const dotenv = require('dotenv');
const winston = require('winston');

dotenv.config();

// Configurazione di Winston per il logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Abilita CORS per richieste cross-origin

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Configurazione Blockchain
const rpcUrl = process.env.PRIVATE_RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const privateKey = process.env.PRIVATE_KEY; // Chiave privata tramite variabili d'ambiente
const wallet = new ethers.Wallet(privateKey, provider);

const api_key = process.env.API_KEY; // API Key per autenticazione

// Funzione per compilare il contratto
const compileContract = (contractCode) => {
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
            throw new Error(`Compilation failed: ${JSON.stringify(errors)}`);
        }
    }

    const contractName = Object.keys(output.contracts['Contract.sol'])[0];
    const { abi, evm } = output.contracts['Contract.sol'][contractName];

    return { abi, bytecode: evm.bytecode.object };
};

// Funzione per eseguire il deploy del contratto
const deployContract = async (abi, bytecode) => {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    logger.info('Deploying contract...');
    const contract = await factory.deploy();
    await contract.deployed();

    logger.info('Contract deployed at:', contract.address);
    return contract.address;
};

// Endpoint POST per deploy
app.post('/deploy', async (req, res) => {
    logger.info('Received POST request to /deploy');

    try {
        const { contractCode } = req.body;

        // Verifica dei parametri
        if (!contractCode) {
            logger.warn('Missing contractCode parameter');
            return res.status(400).json({ success: false, error: 'Missing contractCode parameter' });
        }

        // Verifica dell'API Key
        const requestApiKey = req.headers['x-api-key'];
        if (requestApiKey !== api_key) {
            logger.warn('Forbidden: Invalid API Key');
            return res.status(403).json({ success: false, error: 'Forbidden: Invalid API Key' });
        }

        // Compilazione del contratto
        logger.info('Compiling contract...');
        const { abi, bytecode } = compileContract(contractCode);

        // Deploy del contratto
        logger.info('Deploying contract...');
        const contractAddress = await deployContract(abi, bytecode);

        // Risposta di successo
        res.status(200).json({ success: true, contractAddress });

    } catch (error) {
        logger.error(`Error during deployment: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Avvio del server
app.listen(PORT, () => {
    logger.info(`Deploy contract server listening at http://localhost:${PORT}`);
});
