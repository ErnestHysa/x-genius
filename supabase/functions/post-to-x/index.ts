// supabase/functions/post-to-x/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OAuthClient } from 'https://deno.land/x/oauth_1_0a@v0.2.2/mod.ts';

/**
 * Helper function to create a standardized JSON response.
 * @param {unknown} data - The data payload to be stringified.
 * @param {number} [status=200] - The HTTP status code.
 * @param {Record<string, string>} [headers={}] - Additional headers to include.
 * @returns {Response} A Deno `Response` object.
 */
const createResponse = (data: unknown, status = 200, headers: Record<string, string> = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const X_API_ENDPOINT = 'https://api.twitter.com/2/tweets';

/**
 * Supabase Edge Function to handle posting a thread to X.
 * This function is invoked with the user's auth token and the thread content.
 * It authenticates the user, then iterates through the thread, posting each tweet
 * in reply to the previous one.
 *
 * @param {Request} req - The incoming HTTP request from the client.
 * @returns {Promise<Response>} A promise that resolves to a JSON response indicating success or failure.
 */
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      (globalThis as any).Deno.env.get('SUPABASE_URL') ?? '',
      (globalThis as any).Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 2. Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError?.message);
      return createResponse({ error: 'Authentication failed. Please log in again.' }, 401, corsHeaders);
    }
    
    // 3. Get the tweet thread and user's X credentials from the request body
    const { thread, accessToken, accessSecret } = await req.json();
    if (!accessToken || !accessSecret || !Array.isArray(thread) || thread.length === 0) {
      return createResponse({ error: 'Missing accessToken, accessSecret, or a valid thread in the request body.' }, 400, corsHeaders);
    }

    // 4. Initialize OAuth 1.0a client with app credentials from environment variables
    const oauthClient = new OAuthClient({
      consumer: {
        key: (globalThis as any).Deno.env.get('X_CONSUMER_KEY') ?? '',
        secret: (globalThis as any).Deno.env.get('X_CONSUMER_SECRET') ?? '',
      },
    });

    // 5. Post the thread to X
    let previousTweetId: string | null = null;
    let firstTweetId: string | null = null;

    for (const tweetText of thread) {
      const body: { text: string; reply?: { in_reply_to_tweet_id: string } } = { text: tweetText };
      
      if (previousTweetId) {
        body.reply = { in_reply_to_tweet_id: previousTweetId };
      }

      const authHeader = oauthClient.authHeader({
        method: 'POST',
        url: X_API_ENDPOINT,
        token: {
          key: accessToken,
          secret: accessSecret,
        },
      });

      const response = await fetch(X_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('X API Error:', result);
        const errorMessage = result.detail || 'Failed to post tweet.';
        throw new Error(`X API Error: ${errorMessage}`);
      }
      
      previousTweetId = result.data.id;
      if (!firstTweetId) {
        firstTweetId = result.data.id;
      }
      console.log(`User ${user.id} posted tweet ${previousTweetId}`);
    }
    
    // 6. Return a success response
    return createResponse({ 
      message: 'Successfully posted thread to X!',
      firstTweetId: firstTweetId 
    }, 200, corsHeaders);

  } catch (error: any) {
    console.error('Error in Edge Function:', error.message);
    return createResponse({ error: error.message || 'An unexpected error occurred.' }, 500, corsHeaders);
  }
});
