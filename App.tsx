// App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContentGenerator from './components/ContentGenerator';
import SettingsPanel from './components/SettingsPanel';
import AuthModal from './components/AuthModal';
import { getAccessToken, logoutFromX } from './services/authService';
import Callback from './components/Callback';
import LegalModal from './components/LegalModal';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { GearIcon } from './components/icons';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showTos, setShowTos] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getAccessToken();
            if (token) {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = () => {
        setShowAuthModal(true);
    };

    const handleLogout = async () => {
        await logoutFromX();
        setIsAuthenticated(false);
    };

    const handleSettings = () => {
        setShowSettings(true);
    }

    const handleTos = () => {
        setShowSettings(false);
        setShowTos(true);
    }

    const handlePolicy = () => {
        setShowSettings(false);
        setShowPolicy(true);
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
                <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
                    <div className="flex-1"></div>
                    <h1 className="text-3xl font-bold text-center text-white flex-grow">X-Genius</h1>
                    <div className="flex-1 flex justify-end">
                        {isAuthenticated && (
                            <button onClick={handleSettings} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Settings">
                                <GearIcon className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </header>

                <main className="w-full flex-grow flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/callback" element={<Callback />} />
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <ContentGenerator onLogout={handleLogout} />
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Login with X
                                    </button>
                                )
                            }
                        />
                    </Routes>
                </main>

                {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
                {showSettings && (
                    <LegalModal title="Settings" onClose={() => setShowSettings(false)}>
                        <SettingsPanel onViewTos={handleTos} onViewPolicy={handlePolicy} />
                    </LegalModal>
                )}
                {showTos && (
                    <LegalModal title="Terms of Service" onClose={() => setShowTos(false)}>
                        <TermsOfService />
                    </LegalModal>
                )}
                {showPolicy && (
                    <LegalModal title="Privacy Policy" onClose={() => setShowPolicy(false)}>
                        <PrivacyPolicy />
                    </LegalModal>
                )}
            </div>
        </Router>
    );
};

export default App;
