
export const generateContent = async (prompt: string, model: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenRouter API key is not set.');
  }
  if (!model) {
    throw new Error('OpenRouter model ID is not set.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://x-genius.app',
      'X-Title': 'X-Genius',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: `Generate a short, engaging tweet about the following topic. The tweet must be under 280 characters and should feel authentic, not like a generic AI response. Topic: "${prompt}"` }],
      max_tokens: 100, // Limit tokens to keep it tweet-sized
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON error responses
    console.error('OpenRouter API Error:', errorData);
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();
  
  if (!content) {
    throw new Error('Received an empty response from the AI model.');
  }

  return content;
};
