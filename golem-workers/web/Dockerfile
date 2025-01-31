# web/Dockerfile

FROM node:16-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Esponi la porta web
EXPOSE 8000

# Comando per avviare il servizio web
CMD ["node", "web.js"]