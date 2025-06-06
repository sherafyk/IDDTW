// Load environment variables from `.env` so development and production
// environments can both rely on the same configuration keys.
require('dotenv').config();

// Collection definitions for Payload. Keeping these in separate files
// keeps the configuration modular and easier to maintain.
const MediaAsset = require('./collections/MediaAsset');
const Tag = require('./collections/Tag');
const User = require('./collections/User');

module.exports = {
  // Expose Payload on a configurable URL. When running in Docker the port
  // will be injected via the environment so this works both locally and in
  // production.
  serverURL: `http://localhost:${process.env.PORT || 3000}`,

  // Configure local file uploads. Files are served from `/uploads` and the
  // directory is passed via env to allow Docker volume mounting.
  upload: {
    staticURL: '/uploads',
    staticDir: process.env.UPLOAD_DIR,
  },

  // Register all collections that make up the data model.
  collections: [User, MediaAsset, Tag],

  // Tell Payload which collection stores admin users. Without this the
  // admin UI will not know where to authenticate against.
  admin: {
    user: 'users',
  },
};
