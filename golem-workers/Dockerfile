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
RUN curl -sSf https://github.com/golemfactory/yagna/releases/download/v0.16.0/yagna-linux-x86_64.tar.gz -o yagna.tar.gz \
    && tar -xzf yagna.tar.gz -C /usr/local/bin/ \
    && rm yagna.tar.gz \
    && chmod +x /usr/local/bin/yagna

# Copia tutto il resto del codice nell'immagine
COPY . .

# Espone la porta su cui il worker ascolta
EXPOSE 8000

# Definisci il comando per avviare l'applicazione
CMD ["node", "worker.js"]