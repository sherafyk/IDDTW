# Payload CMS AI-Enhanced DAM Backend

This repository provides a dockerized Payload CMS setup with an AI enrichment pipeline for managing digital assets.

## Requirements
- Docker & Docker Compose
- Node.js (for local development)

## Setup
1. Clone the repository:
   ```bash
   git clone <repo_url>
   cd <repo>
   ```
2. (Optional) Install dependencies locally if you plan to run without Docker:
   ```bash
   npm install       # or `pnpm install`
   ```
3. Copy the example environment file and add your secrets:
   ```bash
   cp .env.example .env
   # edit .env with your secrets
   ```
4. Build the Payload image and start the stack:
   ```bash
   docker compose up -d --build
   ```
5. Access the admin panel at `http://localhost:3000/admin`.
6. When prompted, create the initial user by entering an email and password.

## Linting

Run ESLint to check the codebase:

```bash
npm run lint
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
- `SERVER_URL` - full base URL of the Payload server used in `payload.config.js`

`SERVER_URL` should reflect the address clients use to reach Payload. When
running locally it can remain `http://localhost:3000`, but in production set it
to the public URL behind your reverse proxy.

If `OPENAI_API_KEY` is not provided, the AI enrichment service returns default values without contacting OpenAI (titles and alt text will be `null` and tags will be an empty array).

## Apache Reverse Proxy Example
```apache
<VirtualHost *:443>
    ServerName xaio.org
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Uploads are stored under the `uploads/` directory and MongoDB data under `db/`.

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.
