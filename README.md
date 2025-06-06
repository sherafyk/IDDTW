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
   # open `.env` in your editor and fill in the values from the section below
   ```
2. Build the Docker images and start the stack:
   ```bash
   docker compose build
   docker compose up -d
   ```
3. Access the admin panel at `http://localhost:3000/admin`.
4. When prompted, create the initial user by entering an email and password.

### Local Development

To run Payload directly on your machine without Docker, start the server with:

```bash
npm run dev
```

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
