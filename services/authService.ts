/**
 * @file Manages authentication with X (formerly Twitter).
 * @author Jules
 */

const API_BASE_URL = '/api';

/**
 * Initiates the login process with X by redirecting the user to the X authentication page.
 * @returns {Promise<void>} A promise that resolves when the user is redirected.
 * @throws {Error} If the authentication request fails.
 */
export const loginWithX = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/request_token`, { method: 'POST' });
    if (response.ok) {
        const { auth_url } = await response.json();
        window.location.href = auth_url;
    } else {
        throw new Error('Could not initiate login with X.');
    }
};

/**
 * Handles the callback from X after the user has authenticated.
 * @param {string} oauth_token - The OAuth token from the callback URL.
 * @param {string} oauth_verifier - The OAuth verifier from the callback URL.
 * @returns {Promise<any>} A promise that resolves with the access token and secret.
 * @throws {Error} If the callback request fails.
 */
export const handleCallback = async (oauth_token: string, oauth_verifier: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/callback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oauth_token, oauth_verifier }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Could not complete login with X.');
    }
};

/**
 * Retrieves the access token from the server.
 * @returns {Promise<any | null>} A promise that resolves with the access token and secret, or null if the user is not authenticated.
 */
export const getAccessToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/token`);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

/**
 * Logs the user out of X by calling the logout endpoint on the server.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 */
export const logoutFromX = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
};
