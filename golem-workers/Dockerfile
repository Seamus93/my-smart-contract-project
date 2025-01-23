# golem-workers/Dockerfile

FROM python:3.8-slim

# Installa le dipendenze necessarie
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Installa golem-workers
RUN pip install golem-workers

# Espone la porta su cui Golem-Workers ascolta
EXPOSE 8000

# Definisci il comando per avviare Golem-Workers
CMD ["uvicorn", "--host", "0.0.0.0", "golem_workers.entrypoints.web.main:app"]