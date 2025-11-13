import { supabase } from './supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Initiates the OAuth flow with X (Twitter) via Supabase.
 * Supabase handles the redirection to the X authorization page.
 */
export const loginWithX = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'twitter',
  });
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