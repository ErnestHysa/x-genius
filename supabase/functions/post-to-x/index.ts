// supabase/functions/post-to-x/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { TwitterApi } from 'https://esm.sh/twitter-api-v2@1.16.2';

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

serve(async (req: Request) => {
  // This is needed if you're deploying functions from a browser
  // and running them locally.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      // Use globalThis to access Deno global object to resolve "Cannot find name 'Deno'" error.
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
    
    // 4. Initialize the X API client with the user's OAuth 2.0 token
    const twitterClient = new TwitterApi(token);
    
    // 5. Post the thread
    let previousTweetId: string | null = null;
    
    // Post the first tweet
    const firstTweet = thread[0];
    const { data: firstTweetResult } = await twitterClient.v2.tweet(firstTweet);
    previousTweetId = firstTweetResult.id;
    console.log(`User ${user.id} posted first tweet ${previousTweetId}`);

    // Post subsequent tweets as replies
    for (let i = 1; i < thread.length; i++) {
        const tweetText = thread[i];
        const { data: replyTweetResult } = await twitterClient.v2.tweet(tweetText, {
            reply: { in_reply_to_tweet_id: previousTweetId! }
        });
        previousTweetId = replyTweetResult.id;
        console.log(`User ${user.id} posted reply tweet ${previousTweetId}`);
    }
    
    // 6. Return a success response
    return createResponse({ 
      message: 'Successfully posted thread to X!',
      firstTweetId: firstTweetResult.id 
    }, 200, corsHeaders);

  } catch (error: any) {
    console.error('Error in Edge Function:', error);
    // Check if it's a Twitter API error for a more specific message
    if (error.data && error.data.detail) {
      return createResponse({ error: `X API Error: ${error.data.detail}` }, 500, corsHeaders);
    }
    return createResponse({ error: 'An unexpected error occurred.' }, 500, corsHeaders);
  }
});
