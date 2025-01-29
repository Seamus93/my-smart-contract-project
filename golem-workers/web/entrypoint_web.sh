#!/bin/sh

# Attendere che Yagna API sia in ascolto sulla porta 7465
while ! nc -z golem-node 7465; do
  echo "Attendere che Yagna API si avvii su golem-node:7465..."
  sleep 2
done

# Avviare il server web
exec node server.js