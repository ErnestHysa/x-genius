/**
 * @file This file contains TypeScript interfaces for type definitions used throughout the application.
 * @author Jules
 */

/**
 * Defines the configuration for the OpenRouter API, which is stored in the browser's local storage.
 */
export interface OpenRouterConfig {
  /** The user's personal API key for accessing the OpenRouter service. */
  apiKey: string;
  /** The identifier for the specific AI model to be used for content generation (e.g., "openai/gpt-3.5-turbo"). */
  modelId: string;
}