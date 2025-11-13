import { supabase } from './supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Initiates the OAuth flow with X (Twitter) via Supabase.
 * This is the standard implementation for a deployed web application.
 */
export const loginWithX = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      // Explicitly set the redirect URL to the current page's origin.
      // This URL MUST be added to the Redirect URLs allowlist in your Supabase project.
      redirectTo: window.location.origin,
    }
  });

  // If there's an error during the setup, we'll catch it and handle it.
  if (error) {
    console.error('Error initiating OAuth login:', error);
    // Return the error so the UI can handle it.
    return { data: null, error };
  }
  
  // Supabase will handle the redirect from here.
  // We return a loading state or similar promise structure if needed by the caller.
  return { data: { url: null }, error: null };
};


/**
 * Signs the user out of the application.
 */
export const logoutFromX = () => {
  return supabase.auth.signOut();
};

/**
 * Listens for changes in the authentication state (e.g., user logs in or out).
 * @param callback - The function to call when the auth state changes.
 */
export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};