# golem-workers/web/Dockerfile

FROM node:16-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Installa solc, curl, unzip e bash
RUN npm install solc && apk add --no-cache curl unzip bash

# Scarica e installa Yagna tramite script
COPY install_yagna.sh .
RUN chmod +x install_yagna.sh && ./install_yagna.sh

# Copia tutto il resto del codice nell'immagine
COPY . .

# Espone le porte necessarie
EXPOSE 8000 8080 8081

# Definisci il comando per avviare il server web
CMD ["node", "server.js"]
