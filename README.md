# Payload CMS AI-Enhanced DAM Backend

This repository provides a dockerized Payload CMS setup with an AI enrichment pipeline for managing digital assets.

## Requirements
- Docker & Docker Compose
- Node.js (for local development)

## Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone <repo_url>
   cd <repo>
   npm install       # or `pnpm install`
   cp .env.example .env
   # edit .env with your secrets
   docker compose up -d
   ```
2. Access the admin panel at `http://localhost:3000/admin`.
3. When prompted, create the initial user by entering an email and password.

## Environment Variables

The `.env` file includes:

- `OPENAI_API_KEY` - your OpenAI API key
- `OPENAI_RETRIES` - number of retry attempts for failed calls (default `3`)
- `OPENAI_MAX_TOKENS` - max tokens for completion responses (default `60`)
- `PAYLOAD_SECRET` - Payload authentication secret
- `MONGODB_URI` - MongoDB connection string
- `UPLOAD_DIR` - directory for uploaded files
- `PORT` - port for the Payload server

## Apache Reverse Proxy Example
```apache
<VirtualHost *:443>
    ServerName xaio.org
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Uploads are stored under the `uploads/` directory and MongoDB data under `db/`.

## Rebuilding Indexes

If you add or change fields with `index: true`, MongoDB will rebuild the indexes
when Payload starts. Simply restart the server to apply changes:

```bash
docker compose restart payload
```

After the container restarts, Payload will recreate any modified indexes.
