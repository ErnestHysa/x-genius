/**
 * @file Handles the callback from X (formerly Twitter) after a user has authenticated.
 * @author Jules
 */

import React, { useEffect } from 'react';
import { handleCallback } from '../services/authService';

/**
 * A component that handles the callback from X (formerly Twitter) after a user has authenticated.
 * @returns {JSX.Element} A loading message.
 */
const Callback: React.FC = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauth_token = urlParams.get('oauth_token');
        const oauth_verifier = urlParams.get('oauth_verifier');

        if (oauth_token && oauth_verifier) {
            handleCallback(oauth_token, oauth_verifier)
                .then(() => {
                    window.location.href = '/';
                })
                .catch((error) => {
                    console.error('Error during callback:', error);
                    window.location.href = '/';
                });
        }
    }, []);

    return <div>Loading...</div>;
};

export default Callback;
