# golem-workers/golem-node/Dockerfile

FROM node:16-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Installa solc (compilatore Solidity), curl, unzip e bash
RUN npm install solc && apk add --no-cache curl unzip bash

# Copia lo script di installazione di Yagna
COPY install_yagna.sh .

# Imposta le variabili d'ambiente per accettare automaticamente i termini di servizio e batch mode
ENV GOLEM_ACCEPT_TOS=yes
ENV BATCH_MODE=yes

# Aggiorna PATH per includere /root/.local/bin
ENV PATH="/root/.local/bin:${PATH}"

# Rendi eseguibile e esegui lo script di installazione di Yagna
RUN chmod +x install_yagna.sh entrypoint.sh && ./install_yagna.sh

# Espone la porta di Yagna
EXPOSE 7465

# Definisci il comando per avviare Yagna
CMD ["yagna", "service", "run"]