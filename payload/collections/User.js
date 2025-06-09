module.exports = {
  // Collection used for admin authentication within Payload.
  slug: 'users',

  // Enable built-in auth functionality. Payload will automatically add
  // login endpoints and password hashing along with the required email
  // and password fields.
  auth: true,

  // No additional fields are necessary. Payload manages `email` and
  // `password` automatically when auth is enabled.
  fields: [],
};
