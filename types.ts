/**
 * Represents the authentication state for a user logged in with X (Twitter).
 */
export interface XAuth {
  /** Indicates whether the user is currently authenticated. */
  isAuthenticated: boolean;
  /** The OAuth provider token from Supabase, used for making API calls on behalf of the user. */
  providerToken?: string | null;
  /** Information about the authenticated user. */
  user?: {
    /** The user's X handle (e.g., "johndoe"). */
    username: string;
    /** The user's display name (e.g., "John Doe"). */
    name: string;
    /** The URL of the user's profile picture. */
    avatar?: string;
  };
}

/**
 * Defines the configuration for the OpenRouter API.
 */
export interface OpenRouterConfig {
  /** The user's API key for OpenRouter. */
  apiKey: string;
  /** The ID of the language model to be used for content generation. */
  modelId: string;
}

/**
 * Represents a notification to be displayed to the user.
 */
export interface Notification {
  /** The content of the notification message. */
  message: string;
  /** The type of the notification, which determines its appearance. */
  type: 'success' | 'error';
}

/**
 * Defines the structure for storing X (Twitter) API keys.
 * These are required for making requests to the X API directly.
 */
export interface XApiKeys {
  /** The API Key (formerly Consumer Key). */
  apiKey: string;
  /** The API Key Secret (formerly Consumer Secret). */
  apiSecret: string;
  /** The Access Token for the user. */
  accessToken: string;
  /** The Access Token Secret for the user. */
  accessTokenSecret: string;
}