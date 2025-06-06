// Utility used to convert a string into a URL friendly slug. The library
// handles accents and other special characters better than a simple regex.
const { slugify } = require('transliteration');

module.exports = {
  // Name of the collection used in API routes
  slug: 'tags',

  timestamps: true,

  fields: [
    {
      // Human readable name of the tag
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      // Slug is generated from the name so it can be used in URLs. We enforce
      // uniqueness to prevent duplicate tags with slightly different names.
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ data }) => {
          // Automatically compute the slug whenever the name changes.
          if (data.name) {
            data.slug = slugify(data.name);
          }
        }],
      },
    },
  ],
};
