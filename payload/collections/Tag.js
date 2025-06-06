const { slugify } = require('transliteration');

module.exports = {
  slug: 'tags',
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ data }) => {
          if (data.name) {
            data.slug = slugify(data.name);
          }
        }],
      },
    },
  ],
};
