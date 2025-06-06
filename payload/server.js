require('dotenv').config();
const path = require('path');
const express = require('express');
const payload = require('payload');

const app = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => {
      payload.logger.info('Payload CMS initialized');
    },
  });

  app.listen(process.env.PORT || 3000, () => {
    payload.logger.info(`Server running on ${process.env.PORT || 3000}`);
  });
};

start();
