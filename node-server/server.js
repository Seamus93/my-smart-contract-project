// node-server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Per CORS
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
        if (requestApiKey !== process.env.API_KEY) {
            logger.warn('Forbidden: Invalid API Key');
            return res.status(403).json({ success: false, error: 'Forbidden: Invalid API Key' });
        }

        // Inoltra la richiesta al worker
        logger.info('Forwarding deploy request to worker...');
        const workerUrl = process.env.WORKER_URL || 'http://worker:8000/deploy';

        const response = await axios.post(workerUrl, { contractCode }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY // Se il worker richiede un'API Key
            },
            timeout: 60000 // Timeout di 60 secondi
        });

        // Verifica della risposta del worker
        if (response.data && response.data.success) {
            logger.info(`Contract deployed at address: ${response.data.contractAddress}`);
            return res.status(200).json({ success: true, contractAddress: response.data.contractAddress });
        } else {
            logger.error('Worker returned a failure response');
            return res.status(500).json({ success: false, error: 'Worker failed to deploy contract' });
        }

    } catch (error) {
        logger.error(`Error during deployment: ${error.message}`);
        if (error.response && error.response.data) {
            return res.status(500).json({ success: false, error: error.response.data.error || error.message });
        }
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Avvio del server
app.listen(PORT, () => {
    logger.info(`Deploy contract server listening at http://localhost:${PORT}`);
});
