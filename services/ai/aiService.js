require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function callChat(messages) {
  const res = await openai.createChatCompletion({
    model: 'gpt-4o',
    temperature: 0.7,
    messages,
  });
  return res.data.choices[0].message.content.trim();
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
