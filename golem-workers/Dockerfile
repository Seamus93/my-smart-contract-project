# golem-workers/Dockerfile

FROM node:16-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Installa solc (compilatore Solidity)
RUN npm install solc

# Copia tutto il resto del codice nell'immagine
COPY . .

# Espone la porta su cui il worker ascolta
EXPOSE 8000

# Definisci il comando per avviare l'applicazione
CMD ["node", "worker.js"]