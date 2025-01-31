// golem-workers/web/web.js

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
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

// Endpoint per ricevere richieste di deploy dai worker
app.post('/deploy', async (req, res) => {
    logger.info('Received deploy request from worker');

    try {
        const { contractCode } = req.body;

        if (!contractCode) {
            logger.warn('Missing contractCode in deploy request');
            return res.status(400).json({ success: false, message: 'Missing contractCode' });
        }

        // Comunica con il nodo Golem (Yagna) se necessario
        // Ad esempio, potresti voler notificare Yagna del deploy

        // Esempio di comunicazione con Yagna
        // Questo dipende da come Yagna accetta comandi o notifica eventi

        // Placeholder: log del deploy
        logger.info('Deploying contract on Golem node...');
        // Implementa la logica di deploy se necessario

        // Risposta di successo
        res.status(200).json({ success: true, message: 'Deploy request processed' });
    } catch (error) {
        logger.error(`Error processing deploy request: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint di salute per verificare che il server sia in esecuzione
app.get('/', (req, res) => {
    res.send('Web service is up and running!');
});

// Avvia il server
app.listen(PORT, () => {
    logger.info(`Web service listening at http://localhost:${PORT}`);
});
