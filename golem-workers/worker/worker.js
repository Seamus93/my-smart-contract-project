// golem-workers/worker.js

const express = require('express');
const bodyParser = require('body-parser');
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
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Endpoint per ricevere richieste di deploy dal node-server
app.post('/send-deploy', async (req, res) => {
    logger.info('Received deploy request from node-server');

    try {
        const { contractCode } = req.body;

        if (!contractCode) {
            logger.warn('Missing contractCode in deploy request');
            return res.status(400).json({ success: false, message: 'Missing contractCode' });
        }

        // Invia la richiesta di deploy al servizio web
        const response = await axios.post('http://web:8000/deploy', { contractCode }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY
            }
        });

        logger.info('Deploy request sent to web service');

        res.status(200).json({ success: true, message: 'Deploy request sent to web service' });
    } catch (error) {
        logger.error(`Error sending deploy request to web service: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to send deploy request', error: error.message });
    }
});

// Endpoint di salute per verificare che il worker sia in esecuzione
app.get('/', (req, res) => {
    res.send('Worker service is up and running!');
});

// Avvia il server
app.listen(PORT, () => {
    logger.info(`Worker service listening at http://localhost:${PORT}`);
});
