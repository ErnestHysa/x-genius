// services/authService.ts

const API_BASE_URL = '/api';

export const loginWithX = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/request_token`, { method: 'POST' });
    if (response.ok) {
        const { auth_url } = await response.json();
        window.location.href = auth_url;
    } else {
        throw new Error('Could not initiate login with X.');
    }
};

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

export const getAccessToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/token`);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

export const logoutFromX = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
};
