import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateContent } from './openRouterService';

// Mock the global fetch function
global.fetch = vi.fn();

describe('openRouterService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully generates content', async () => {
    const mockResponse = {
      choices: [{ message: { content: '{"tweets":["tweet1", "tweet2"]}' } }],
    };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await generateContent('test prompt', 'test-model', 'test-key', 2);
    expect(result).toEqual(['tweet1', 'tweet2']);
  });

  it('throws an error if the API key is missing', async () => {
    await expect(generateContent('test prompt', 'test-model', '', 2)).rejects.toThrow('OpenRouter API key is not set.');
  });

  it('handles API errors gracefully', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: { message: 'Internal Server Error' } }),
    });

    await expect(generateContent('test prompt', 'test-model', 'test-key', 2)).rejects.toThrow('OpenRouter is currently experiencing issues. Please try again later.');
  });

  it('handles non-JSON responses', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'not json' } }] }),
    });

    await expect(generateContent('test prompt', 'test-model', 'test-key', 2)).rejects.toThrow('The AI returned content that was not valid JSON. Please try generating again.');
  });

  it('handles JSON responses in the wrong format', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '{"wrong": "format"}' } }] }),
    });

    await expect(generateContent('test prompt', 'test-model', 'test-key', 2)).rejects.toThrow('AI response was valid JSON, but not in the expected format. Please try again.');
  });

  it('calculates max_tokens sufficiently for a single tweet', async () => {
    const mockResponse = {
      choices: [{ message: { content: '{"tweets":["a tweet"]}' } }],
    };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await generateContent('test prompt', 'test-model', 'test-key', 1);

    const fetchOptions = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(fetchOptions.body);

    expect(body.max_tokens).toBeGreaterThanOrEqual(350);
  });
});
