// Load environment variables so the server can be configured via `.env` files.
require('dotenv').config();

const express = require('express');
const path = require('path');
// Dynamically import the ESM build of Payload. Using a dynamic import allows
// this file to remain CommonJS while loading the module.
const loadPayload = async () => (await import('payload')).default;

// Create the Express app which Payload will hook into.
const app = express();

// When behind a reverse proxy (e.g. Apache or Nginx) Express needs to trust
// the proxy headers so secure cookies and protocol information are correct.
// This ensures Payload works properly when served over HTTPS through a proxy.
app.set('trust proxy', 1);

const start = async () => {
  const payload = await loadPayload();
  // Ensure the config file path is set so Payload knows where to load its
  // configuration from when running directly via Node.
  const configPath = path.join(__dirname, 'payload.config.js');
  if (!process.env.PAYLOAD_CONFIG_PATH) {
    process.env.PAYLOAD_CONFIG_PATH = configPath;
  }

  // Initialise Payload and connect it to our Express instance.
  await payload.init({
    config: configPath,
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => {
      payload.logger.info('Payload CMS initialized');
    },
  });

  // Start the HTTP server. Docker will map this to the host machine.
  app.listen(process.env.PORT || 3000, () => {
    payload.logger.info(`Server running on ${process.env.PORT || 3000}`);
  });
};

start();
