# node-server/Dockerfile

# Usa un'immagine di base Node.js
FROM node:16-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del codice nell'immagine
COPY . .

# Espone la porta su cui il server Node.js ascolta
EXPOSE 3000

# Definisci il comando per avviare l'applicazione
CMD ["node", "index.js"]