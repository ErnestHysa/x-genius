// services/xService.ts

const API_BASE_URL = '/api';

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
