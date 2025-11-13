/**
 * MOCK: Posts content to X using an OAuth token.
 *
 * This function simulates posting content for a user who has authenticated via Supabase.
 * In a real-world, secure application, this `providerToken` should NEVER be handled
 * on the client-side. Instead, the client would send the content to a secure backend
 * (like a Supabase Edge Function), which would then use the token stored server-side
 * to post to the X API. Exposing tokens to the client is a major security risk.
 *
 * @param {string} content - The text content to post.
 * @param {string} providerToken - The user's OAuth access token from Supabase.
 */
export const postToX = (content: string, providerToken: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    if (!providerToken) {
      reject({ message: 'Authentication token is missing. Please log in again.' });
      return;
    }
    
    if (!content) {
      reject({ message: 'Cannot post empty content.' });
      return;
    }

    if (content.length > 280) {
      reject({ message: 'Content exceeds 280 characters.' });
      return;
    }

    // Simulate network latency for a realistic feel
    setTimeout(() => {
      console.log('--- SIMULATING AUTHENTICATED POST TO X ---');
      console.log('Content:', content);
      console.log('Using Provider Token (first 8 chars):', providerToken.substring(0, 8) + '...');
      console.log('!!! In a real app, this API call would be made from a secure backend server/edge function.');
      console.log('------------------------------------------');
      
      // In a real implementation, you would use a library like `twitter-api-v2`
      // or a direct `fetch` call to the X API v2 `2/tweets` endpoint here,
      // including the `providerToken` in the Authorization header as a Bearer token.
      
      resolve({ success: true, message: 'Successfully posted to X (Simulated).' });
    }, 1500);
  });
};