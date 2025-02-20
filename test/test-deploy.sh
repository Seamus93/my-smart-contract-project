# deploy.sh

#!/bin/bash

# To Run chmod +x deploy.sh
#./deploy.sh

# Invia richiesta di deploy al node-server
curl -X POST http://localhost:3000/deploy \
  -H "Content-Type: application/json" \
  -H "x-api-key: fALCkGc4OF_ktGDNeHH6Eqe47abs8ojo" \
  -d '{"contractCode": "pragma solidity ^0.8.0; contract MyContract { }"}'