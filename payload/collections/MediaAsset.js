const path = require('path');
const { slugify } = require('transliteration');
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

        const tagIds = [];
        for (const tagName of tags) {
          const slug = slugify(tagName);
          const existing = await req.payload.find({
            collection: 'tags',
            where: { slug: { equals: slug } },
          });
          let tagDoc;
          if (existing && existing.docs && existing.docs.length) {
            tagDoc = existing.docs[0];
          } else {
            tagDoc = await req.payload.create({
              collection: 'tags',
              data: { name: tagName },
            });
          }
          tagIds.push(tagDoc.id);
        }

        await req.payload.update({
          collection: 'media-assets',
          id: doc.id,
          data: {
            title: doc.title || title,
            altText: doc.altText || altText,
            tags: doc.tags && doc.tags.length ? doc.tags : tagIds,
          },
        });
      }
    }],
  },
};
