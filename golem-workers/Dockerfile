# web/Dockerfile

FROM node:16-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Installa solc (compilatore Solidity), curl, unzip e bash
RUN npm install solc && apk add --no-cache curl unzip bash

# Scarica e installa Yagna manualmente
RUN yes | curl -sSf https://raw.githubusercontent.com/golemfactory/yagna/main/install.sh | bash -

# Copia tutto il resto del codice nell'immagine
COPY . .

# Espone la porta su cui il worker ascolta
EXPOSE 8000

# Definisci il comando per avviare l'applicazione
CMD ["node", "worker.js"]