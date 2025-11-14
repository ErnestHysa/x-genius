import { supabase } from './supabaseClient';

/**
 * Posts a thread to X by invoking a secure Supabase Edge Function.
 *
 * @param {string[]} thread - The array of tweet strings to post as a thread.
 * @param {string} providerToken - The user's OAuth access token from Supabase.
 * @returns {Promise<{ success: boolean; message: string }>} - The result of the operation.
 * @throws {Error} Throws an error if the authentication token is missing, the content is empty, or the Edge Function invocation fails.
 */
export const postToX = async (thread: string[], providerToken: string): Promise<{ success: boolean; message: string }> => {
  if (!providerToken) {
    throw new Error('Authentication token is missing. Please log in again.');
  }

  if (!thread || thread.length === 0) {
    throw new Error('Cannot post empty content.');
  }

  // Invoke the 'post-to-x' Edge Function
  const { data, error } = await supabase.functions.invoke('post-to-x', {
    body: { 
      thread: thread,
      token: providerToken 
    },
  });

  if (error) {
    console.error('Edge Function invocation error:', error);

    // The 'context' property often contains the JSON body returned by our Edge Function on failure.
    // Our function is designed to return a JSON object like { error: 'Detailed error message...' }.
    // We check for this specific structure to provide a better error message to the user.
    let detailedMessage = 'An unknown error occurred while communicating with the server.';
    
    // Type guard to check if context is an object with an error property
    if (error.context && typeof error.context === 'object' && 'error' in error.context && typeof error.context.error === 'string') {
      detailedMessage = error.context.error;
    } else {
      detailedMessage = error.message; // Fallback to the Supabase client's generic error message
    }
    
    throw new Error(`${detailedMessage}`);
  }

  // Assuming the function returns a success message
  return { success: true, message: data.message || 'Successfully posted thread to X.' };
};