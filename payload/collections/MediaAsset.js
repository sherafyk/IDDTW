const path = require('path');
const { generateTitle, generateAltText, generateTags } = require('../../services/ai/aiService');

module.exports = {
  slug: 'media-assets',
  timestamps: true,
  upload: {
    staticDir: process.env.UPLOAD_DIR,
    staticURL: '/uploads',
    disableLocalStorage: false,
    filename: ({ filename }) => {
      const date = new Date();
      const dir = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      return `${dir}/${filename}`;
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'fileType',
      type: 'select',
      options: ['Image', 'SVG', 'Lottie', 'Video', 'PDF', 'Other'],
      required: true,
    },
    {
      name: 'altText',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'uploadedBy',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [async ({ doc, previousDoc, req, operation }) => {
      if (operation === 'create' || doc.file !== previousDoc.file) {
        const filename = path.basename(doc.file.filename || doc.file);
        const [title, altText, tags] = await Promise.all([
          generateTitle(filename),
          generateAltText(filename),
          generateTags(filename),
        ]);

        await req.payload.update({
          collection: 'media-assets',
          id: doc.id,
          data: {
            title: doc.title || title,
            altText: doc.altText || altText,
            tags: doc.tags && doc.tags.length ? doc.tags : tags.map((t) => ({ name: t })),
          },
        });
      }
    }],
  },
};
