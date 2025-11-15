// components/AuthModal.tsx

import React from 'react';
import { loginWithX } from '../services/authService';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login to X-Genius</h2>
                <p className="text-center text-gray-400 mb-6">
                    To start generating content, you need to log in with your X (Twitter) account.
                </p>
                <button
                    onClick={loginWithX}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Login with X
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors mt-4"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
