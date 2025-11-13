import { supabase } from './supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Initiates the OAuth flow with X (Twitter) via Supabase.
 * This function gets the OAuth URL and opens it in a new tab
 * to avoid iframe sandbox restrictions.
 */
export const loginWithX = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      // Explicitly tell Supabase where to send the user back after login.
      redirectTo: window.location.origin,
      skipBrowserRedirect: true,
    }
  });

  // If Supabase returns an error OR fails to generate a URL, we must stop.
  if (error || !data.url) {
    // Create a more informative error message.
    const errorMessage = error?.message || 'Supabase failed to generate a login URL. This is often due to a misconfiguration of Redirect URLs in your Supabase project settings.';
    return { data: null, error: new Error(errorMessage) };
  }

  // Open the auth URL in a new tab to bypass iframe sandbox restrictions.
  window.open(data.url, '_blank', 'noopener,noreferrer');

  // Return the original data and a null error on success.
  return { data, error: null };
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