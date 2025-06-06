require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '60', 10);
const RETRY_LIMIT = parseInt(process.env.OPENAI_RETRIES || '3', 10);

async function callChat(messages, retries = RETRY_LIMIT) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await openai.createChatCompletion({
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
        messages,
      });
      return res.data.choices[0].message.content.trim();
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

async function generateTitle(filename) {
  const prompt = `You are a content metadata generator. Given a file name, create a short, professional title. File: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

async function generateAltText(filename) {
  const prompt = `You are an alt text generator. Write ADA-compliant alt text for this file: ${filename}`;
  return await callChat([{ role: 'user', content: prompt }]);
}

async function generateTags(filename) {
  const prompt = `You are a tagging system. Generate 5-10 highly relevant search tags describing this media file: ${filename}`;
  const tagsString = await callChat([{ role: 'user', content: prompt }]);
  return tagsString.split(/,|\n/).map(t => t.trim()).filter(Boolean);
}

module.exports = { generateTitle, generateAltText, generateTags };
