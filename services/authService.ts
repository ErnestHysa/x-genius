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
      skipBrowserRedirect: true,
    }
  });

  if (data.url) {
    // Open the auth URL in a new tab to bypass iframe sandbox restrictions.
    window.open(data.url, '_blank', 'noopener,noreferrer');
  }

  return { error };
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