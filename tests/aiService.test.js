const mockCreate = jest.fn();

jest.mock('openai', () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createChatCompletion: mockCreate
    }))
  };
});

const { generateTags } = require('../services/ai/aiService');

describe('generateTags', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  test('parses comma separated tags', async () => {
    mockCreate.mockResolvedValueOnce({
      data: { choices: [{ message: { content: 'tag1, tag2,tag3' } }] }
    });
    const tags = await generateTags('example.jpg');
    expect(tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('parses newline separated tags', async () => {
    mockCreate.mockResolvedValueOnce({
      data: { choices: [{ message: { content: 'tag1\ntag2\n tag3 ' } }] }
    });
    const tags = await generateTags('example.jpg');
    expect(tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
});
