// Load the OpenAI API key from the environment
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

// Configure the OpenAI client. Using the SDK keeps our calls concise.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Wrapper around OpenAI chat completion API. Returns the assistant's final text
// response for convenience.
async function callChat(messages) {
  const res = await openai.createChatCompletion({
    model: 'gpt-4o',
    temperature: 0.7,
    messages,
  });
  return res.data.choices[0].message.content.trim();
}

// Generate a short human readable title for a media file using its name as a hint.
async function generateTitle(filename) {
  const prompt = `You are a content metadata generator. Given a file name, create a short, professional title. File: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

// Generate accessible alt text describing the file's content.
async function generateAltText(filename) {
  const prompt = `You are an alt text generator. Write ADA-compliant alt text for this file: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

// Return an array of tags that can be associated with the media asset. The
// prompt instructs the model to provide a comma or newline separated list which
// we then split into an array.
async function generateTags(filename) {
  const prompt = `You are a tagging system. Generate 5-10 highly relevant search tags describing this media file: ${filename}`;
  const tagsString = await callChat([{ role: 'user', content: prompt }]);
  return tagsString.split(/,|\n/).map(t => t.trim()).filter(Boolean);
}

module.exports = { generateTitle, generateAltText, generateTags };
