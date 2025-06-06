require('dotenv').config();
const MediaAsset = require('./collections/MediaAsset');
const Tag = require('./collections/Tag');
const User = require('./collections/User');

module.exports = {
  serverURL: `http://localhost:${process.env.PORT || 3000}`,
  upload: {
    staticURL: '/uploads',
    staticDir: process.env.UPLOAD_DIR,
  },
  collections: [User, MediaAsset, Tag],
  admin: {
    user: 'users',
  },
};
