module.exports = {
  // Collection used for admin authentication within Payload.
  slug: 'users',

  // Enable built-in auth functionality. Payload will automatically add
  // login endpoints and password hashing.
  auth: true,

  fields: [
    {
      // Administrator email address used for login
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      // Hashed password field handled by Payload
      name: 'password',
      type: 'password',
      required: true,
    },
  ],
};
