// Load the OpenAI API key from the environment
require('dotenv').config();
const { OpenAI } = require('openai');

// Configure the OpenAI client. Using the SDK keeps our calls concise.
const openAIKey = process.env.OPENAI_API_KEY;
let openai;
if (openAIKey) {
  openai = new OpenAI({ apiKey: openAIKey });
} else {
  console.warn('OPENAI_API_KEY not set. AI enrichment disabled.');
}

const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '60', 10);
const RETRY_LIMIT = parseInt(process.env.OPENAI_RETRIES || '3', 10);

// Wrapper around OpenAI chat completion API. Returns the assistant's final text
// response for convenience.
async function callChat(messages, retries = RETRY_LIMIT) {
  if (!openai) {
    return '';
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
        messages,
      });
      return res.choices[0].message.content.trim();
    } catch (error) {
      if (attempt === retries) {
        console.error('OpenAI API request failed:', error);
        throw error;
      }
      const delay = Math.min(1000 * 2 ** (attempt - 1), 16000);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// Generate a short human readable title for a media file using its name as a hint.
async function generateTitle(filename) {
  if (!openai) return null;
  const prompt = `You are a content metadata generator. Given a file name, create a short, professional title. File: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

// Generate accessible alt text describing the file's content.
async function generateAltText(filename) {
  if (!openai) return null;
  const prompt = `You are an alt text generator. Write ADA-compliant alt text for this file: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

// Return an array of tags that can be associated with the media asset. The
// prompt instructs the model to provide a comma or newline separated list which
// we then split into an array.
async function generateTags(filename) {
  if (!openai) return [];
  const prompt = `You are a tagging system. Generate 5-10 highly relevant search tags describing this media file: ${filename}`;
  const tagsString = await callChat([{ role: 'user', content: prompt }]);
  return tagsString.split(/,|\n/).map(t => t.trim()).filter(Boolean);
}

module.exports = { generateTitle, generateAltText, generateTags };
