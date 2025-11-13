// supabase/functions/post-to-x/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to create a JSON response
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

serve(async (req: Request) => {
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
    
    // 3. Get the tweet thread and provider token from the request body
    const { thread, token } = await req.json();
    if (!token || !Array.isArray(thread) || thread.length === 0) {
      return createResponse({ error: 'Missing token or valid thread in request body.' }, 400, corsHeaders);
    }
    
    // 4. Post the thread using native fetch
    let previousTweetId: string | null = null;
    let firstTweetId: string | null = null;

    for (const tweetText of thread) {
      const body: { text: string; reply?: { in_reply_to_tweet_id: string } } = { text: tweetText };
      
      if (previousTweetId) {
        body.reply = { in_reply_to_tweet_id: previousTweetId };
      }

      const response = await fetch(X_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    
    // 5. Return a success response
    return createResponse({ 
      message: 'Successfully posted thread to X!',
      firstTweetId: firstTweetId 
    }, 200, corsHeaders);

  } catch (error: any) {
    console.error('Error in Edge Function:', error.message);
    return createResponse({ error: error.message || 'An unexpected error occurred.' }, 500, corsHeaders);
  }
});