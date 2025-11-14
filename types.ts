export interface XAuth {
  isAuthenticated: boolean;
  providerToken?: string | null;
  user?: {
    username: string;
    name: string;
    avatar?: string;
  };
}

export interface OpenRouterConfig {
  apiKey: string;
  modelId: string;
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

export interface XApiKeys {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}