# Payload CMS AI-Enhanced DAM Backend

This repository provides a dockerized Payload CMS setup with an AI enrichment pipeline for managing digital assets.

## Requirements
- Docker & Docker Compose
- Node.js (for local development)

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sherafyk/IDDTW.git
   cd IDDTW
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

## Rebuilding Indexes

If you add or change fields with `index: true`, MongoDB will rebuild the indexes
when Payload starts. Simply restart the server to apply changes:

```bash
docker compose restart payload
```

After the container restarts, Payload will recreate any modified indexes.

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.

## Frontend (Next.js)

The `pages/` and `components/` directories contain a minimal Next.js frontend
for browsing assets from the Payload CMS API. To run the frontend locally:

```bash
npm install
npm run dev -- -p 3001
```

Copy `.env.local.example` to `.env.local` and adjust the `NEXT_PUBLIC_API_BASE_URL`
if needed. The frontend runs on <http://localhost:3001> to avoid the backend
container on port 3000.
