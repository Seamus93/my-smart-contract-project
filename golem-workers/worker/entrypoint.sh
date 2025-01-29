#!/bin/sh

# Attendere che GSB sia in ascolto sulla porta 7464
while ! nc -z 0.0.0.0 7464; do
  echo "Attendere che GSB si avvii..."
  sleep 2
done

# Creare la chiave di applicazione se non esiste
if [ -z "$(yagna app-key list | grep requestor)" ]; then
  echo "Creando la chiave di applicazione..."
  yagna app-key create requestor
fi

# Avviare Yagna
exec yagna service run