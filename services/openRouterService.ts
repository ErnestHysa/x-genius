export const generateContent = async (prompt: string, model: string, apiKey: string, tweetCount: number): Promise<string[]> => {
  if (!apiKey) {
    throw new Error('OpenRouter API key is not set.');
  }
  if (!model) {
    throw new Error('OpenRouter model ID is not set.');
  }

  const threadInstruction = tweetCount === 1 
    ? `Generate an engaging single X (Twitter) tweet`
    : `Generate an engaging X (Twitter) thread with ${tweetCount} tweets`;

  const systemPrompt = `${threadInstruction} about the following topic. Each tweet must be under 280 characters. Format the entire response as a single, minified JSON array of strings, with no other text or explanation. For example: ["First tweet...","Second tweet...","Third tweet..."]. Topic: "${prompt}"`;

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
      messages: [{ role: 'user', content: systemPrompt }],
      max_tokens: 150 * tweetCount, // Allocate more tokens for longer threads
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter API Error:', { status: response.status, data: errorData });

    let message = errorData.error?.message || `API request failed with status ${response.status}`;
    if (response.status === 401) {
      message = 'Authentication failed. Please check your OpenRouter API Key in settings.';
    } else if (response.status === 402) {
      message = 'Payment required. Please check your OpenRouter billing details.';
    } else if (response.status === 429) {
      message = 'Rate limit exceeded. Please try again later or check your OpenRouter plan.';
    } else if (response.status >= 500) {
      message = 'OpenRouter is currently experiencing issues. Please try again later.';
    }
    
    throw new Error(message);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();
  
  if (!content) {
    throw new Error('Received an empty response from the AI model.');
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', content, error);
    throw new Error('The AI returned content that was not valid JSON. Please try generating again.');
  }

  let potentialArray;

  // Case 1: The response is already a valid array.
  if (Array.isArray(parsedJson)) {
    potentialArray = parsedJson;
  } 
  // Case 2: The response is an object.
  else if (typeof parsedJson === 'object' && parsedJson !== null) {
    // Check if it contains a nested array (e.g., { "tweets": [...] })
    const nestedArray = Object.values(parsedJson).find(value => Array.isArray(value));
    if (nestedArray) {
      potentialArray = nestedArray;
    } else {
      // If not, assume it's an array-like object (e.g., { "0": "...", "1": "..." })
      potentialArray = Object.values(parsedJson);
    }
  }

  if (!potentialArray || !Array.isArray(potentialArray) || !potentialArray.every(item => typeof item === 'string')) {
    console.error('Parsed JSON content is not a valid array of strings:', parsedJson);
    throw new Error('AI response was valid JSON, but not in the expected format (an array of strings).');
  }

  return potentialArray;
};