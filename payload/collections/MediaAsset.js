// Utilities for working with file paths and generating URL friendly slugs.
const path = require('path');
const { slugify } = require('transliteration');

// Custom AI helpers used to enrich uploaded media with metadata. The service
// wraps OpenAI calls to produce titles, alt text and tags for a file.
const { generateTitle, generateAltText, generateTags } = require('../../services/ai/aiService');

module.exports = {
  // Name used in API routes, e.g. `/api/media-assets`
  slug: 'media-assets',

  // Enable createdAt/updatedAt timestamps
  timestamps: true,

  // Restrict writes to authenticated users while allowing public read access
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  // Configure Payload's built-in upload handler
  upload: {
    staticDir: process.env.UPLOAD_DIR,
    staticURL: '/uploads',
    // Keep a local copy of files so they can be served directly
    disableLocalStorage: false,

    // Save files in `/uploads/YYYY/MM/DD/filename` for easier organisation.
    filename: ({ filename }) => {
      const date = new Date();
      const dir = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      return `${dir}/${filename}`;
    },
  },
  // Field definitions that describe the media asset
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
      // Allows editors to label the type of file for easier filtering.
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
      // Many-to-many relationship to `Tag` documents. Tags are generated
      // automatically but can also be adjusted by an editor.
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
      // Relationship to the user who uploaded the asset. Set automatically
      // in a hook so editors cannot change it manually.
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    // Before saving a new document, record which authenticated user uploaded it.
    beforeChange: [({ data, req, operation }) => {
      if (operation === 'create' && req.user) {
        return { ...data, uploadedBy: req.user.id };
      }
      return data;
    }],
    // After a document is saved, run AI enrichment if the file was newly
    // uploaded or replaced.
    afterChange: [async ({ doc, previousDoc, req, operation }) => {
      if (operation === 'create' || doc.filename !== previousDoc.filename) {
        const filename = path.basename(doc.filename);

        try {
          // Run all AI metadata generation requests in parallel.
          const [title, altText, tags] = await Promise.all([
            generateTitle(filename),
            generateAltText(filename),
            generateTags(filename),
          ]);

          const tagIds = [];
          for (const tagName of tags) {
            // Ensure each tag exists only once. We slugify to avoid duplicates
            // caused by differing cases or whitespace.
            const slug = slugify(tagName);
            const existing = await req.payload.find({
              collection: 'tags',
              where: { slug: { equals: slug } },
            });
            let tagDoc;
            if (existing && existing.docs && existing.docs.length) {
              tagDoc = existing.docs[0];
            } else {
              // Create the tag if it doesn't already exist.
              tagDoc = await req.payload.create({
                collection: 'tags',
                data: { name: tagName },
              });
            }
            tagIds.push(tagDoc.id);
          }

          // Update the document with the generated metadata. If any fields were
          // manually filled out by the user we keep those values instead of the
          // AI-generated ones.
          await req.payload.update({
            collection: 'media-assets',
            id: doc.id,
            data: {
              title: doc.title || title,
              altText: doc.altText || altText,
              tags: doc.tags && doc.tags.length ? doc.tags : tagIds,
            },
          });
        } catch (err) {
          if (
            req.payload &&
            req.payload.logger &&
            typeof req.payload.logger.error === 'function'
          ) {
            req.payload.logger.error('AI enrichment failed', err);
          } else {
            console.error('AI enrichment failed', err);
          }
          return;
        }
      }
    }],
  },
};
