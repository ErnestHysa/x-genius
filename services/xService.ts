/**
 * @file Manages interactions with the X (formerly Twitter) API.
 * @author Jules
 */

const API_BASE_URL = '/api';

/**
 * Posts a thread to X.
 * @param {string[]} thread - An array of strings, where each string is a tweet in the thread.
 * @param {string} accessToken - The user's X access token.
 * @param {string} accessSecret - The user's X access secret.
 * @returns {Promise<any>} A promise that resolves with the response from the server.
 * @throws {Error} If the thread is empty or if the request fails.
 */
export const postToX = async (thread: string[], accessToken: string, accessSecret: string) => {
    if (!thread || thread.length === 0) {
        throw new Error('Cannot post empty content.');
    }

    const response = await fetch(`${API_BASE_URL}/post_tweet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thread, accessToken, accessSecret }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        const { error } = await response.json();
        throw new Error(error || 'An unknown error occurred while posting to X.');
    }
};
