// golem-workers/web.js

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const winston = require('winston');
const { ethers } = require('ethers');
const solc = require('solc');

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
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

// Configurazione Blockchain
const rpcUrl = process.env.ALCHEMY_API_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const privateKey = process.env.PRIVATE_KEY; // Chiave privata tramite variabili d'ambiente
const wallet = new ethers.Wallet(privateKey, provider);

const api_key = process.env.API_KEY; // API Key per autenticazione

// Endpoint POST per deploy
app.post('/deploy', async (req, res) => {
    logger.info('Received deploy request');
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);

    try {
        const { contractCode } = req.body;

        // Verifica dei parametri
        if (!contractCode) {
            logger.warn('Missing contractCode parameter');
            return res.status(400).json({ success: false, error: 'Missing contractCode parameter' });
        }

        // Verifica dell'API Key
        const requestApiKey = req.headers['x-api-key'];
        logger.info(`Received API Key: ${requestApiKey}`);
        if (requestApiKey !== api_key) {
            logger.warn('Forbidden: Invalid API Key');
            return res.status(403).json({ success: false, error: 'Forbidden: Invalid API Key' });
        }

        // Compilazione del contratto
        logger.info('Compiling contract...');
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
                logger.error('Compilation failed');
                return res.status(400).json({ success: false, error: 'Compilation failed', errors });
            }
        }

        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const { abi, evm } = output.contracts['Contract.sol'][contractName];
        const bytecode = evm.bytecode.object;

        // Deploy del contratto
        logger.info('Deploying contract...');
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        const contract = await factory.deploy();
        await contract.deployed();

        logger.info(`Contract deployed at address: ${contract.address}`);

        // Risposta di successo
        res.status(200).json({ success: true, contractAddress: contract.address });

    } catch (error) {
        logger.error(`Error during deployment: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint di salute per verificare che il web service sia in esecuzione
app.get('/', (req, res) => {
    res.send('Web service is up and running!');
});

// Avvio del server
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Web service listening at http://0.0.0.0:${PORT}`);
});
