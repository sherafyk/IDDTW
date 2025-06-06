# Payload CMS AI-Enhanced DAM Backend

This repository provides a dockerized Payload CMS setup with an AI enrichment pipeline for managing digital assets.

## Requirements
- Docker & Docker Compose
- Node.js (for local development)

## Setup
1. Clone the repository and copy the example environment file:
   ```bash
   git clone <repo_url>
   cd <repo>
   cp .env.example .env
   # edit .env with your secrets
   docker compose up -d
   ```
2. Access the admin panel at `http://localhost:3000/admin`.
3. When prompted, create the initial user by entering an email and password.

## Apache Reverse Proxy Example
```apache
<VirtualHost *:443>
    ServerName xaio.org
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Uploads are stored under the `uploads/` directory and MongoDB data under `db/`.
