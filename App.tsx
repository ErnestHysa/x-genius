import React, { useState, useEffect } from 'react';
import type { OpenRouterConfig, Notification, XAuth } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { ContentGenerator } from './components/ContentGenerator';
import { GeneratedPost } from './components/GeneratedPost';
import { generateContent } from './services/openRouterService';
import { postToX } from './services/xService';
import { loginWithX, logoutFromX, onAuthStateChange } from './services/authService';
import { XLogoIcon, SettingsIcon, CloseIcon, LogoutIcon } from './components/icons';
import { LegalModal } from './components/LegalModal';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [xAuth, setXAuth] = useState<XAuth>({ isAuthenticated: false });
  const [openRouterConfig, setOpenRouterConfig] = useState<OpenRouterConfig>({ apiKey: '', modelId: 'openai/gpt-3.5-turbo' });
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [viewingLegalDoc, setViewingLegalDoc] = useState<'tos' | 'policy' | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };
  
  useEffect(() => {
    const { data: authListener } = onAuthStateChange((_event, session) => {
      if (session) {
        const { user, provider_token } = session;
        
        // Critical Check: A session exists, but the token for posting is missing.
        // This is a clear sign of a failed token exchange, likely due to bad credentials.
        if (!provider_token) {
            setXAuth({ isAuthenticated: false });
            showNotification('Login succeeded, but failed to get posting permissions. Please double-check your Client ID and Secret in Supabase.', 'error');
            // Log out the user to clear the corrupted session
            logoutFromX();
            return;
        }

        setXAuth({
          isAuthenticated: true,
          providerToken: provider_token,
          user: {
            username: user.user_metadata.user_name,
            name: user.user_metadata.name,
            avatar: user.user_metadata.avatar_url,
          },
        });
      } else {
        setXAuth({ isAuthenticated: false });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleError = (error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error) || 'An unknown error occurred.';
    showNotification(`${context} failed: ${errorMessage}`, 'error');
    console.error(`${context} Error:`, error);
  };
  
  const handleLogin = async () => {
    const { error } = await loginWithX();
    if (error) {
      handleError(error, 'Login');
    }
  };

  const handleLogout = async () => {
    const { error } = await logoutFromX();
     if (error) {
      handleError(error, 'Logout');
    } else {
      showNotification('You have been logged out.', 'success');
    }
  };

  const handleGenerate = async (prompt: string, tweetCount: number) => {
    if (!openRouterConfig.apiKey || !openRouterConfig.modelId) {
      showNotification('Please configure OpenRouter API Key and Model ID in settings.', 'error');
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);
    try {
      const content = await generateContent(prompt, openRouterConfig.modelId, openRouterConfig.apiKey, tweetCount);
      setGeneratedContent(content);
    } catch (error) {
      handleError(error, 'Content generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!xAuth.isAuthenticated || !xAuth.providerToken) {
      showNotification('Authentication error. Please login again.', 'error');
      return;
    }
    
    setIsPosting(true);
    try {
      const result = await postToX(generatedContent, xAuth.providerToken);
      showNotification(result.message, 'success');
      setGeneratedContent([]); // Clear content after successful post
    } catch (error) {
      handleError(error, 'Posting thread');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <XLogoIcon className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">X-Genius</h1>
          </div>
          <div className="flex items-center gap-2">
            {xAuth.isAuthenticated && xAuth.user ? (
              <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <img src={xAuth.user.avatar} alt={xAuth.user.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-slate-300 hidden sm:inline">@{xAuth.user.username}</span>
                <button onClick={handleLogout} className="p-1 text-slate-400 hover:text-white transition-colors duration-200" aria-label="Logout">
                  <LogoutIcon className="w-5 h-5" />
                </button>
              </div>
            ) : null}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
              aria-label="Open settings"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <ContentGenerator onGenerate={handleGenerate} isLoading={isGenerating} />
          <GeneratedPost
            content={generatedContent}
            onPost={handlePost}
            isPosting={isPosting}
            isLoading={isGenerating}
            xAuth={xAuth}
            onLogin={handleLogin}
          />
        </main>
      </div>
      
      {/* Settings Panel Drawer */}
      <div className={`fixed inset-0 z-20 transition-all duration-300 ease-in-out ${isSettingsOpen ? 'bg-black/60' : 'pointer-events-none'}`}>
          <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Settings</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200" aria-label="Close settings">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6 flex-grow">
                    <SettingsPanel
                        openRouterConfig={openRouterConfig}
                        setOpenRouterConfig={setOpenRouterConfig}
                        onViewTos={() => setViewingLegalDoc('tos')}
                        onViewPolicy={() => setViewingLegalDoc('policy')}
                    />
                </div>
              </div>
          </div>
      </div>

      {/* Legal Modal */}
      {viewingLegalDoc && (
        <LegalModal
            title={viewingLegalDoc === 'tos' ? 'Terms of Service' : 'Privacy Policy'}
            onClose={() => setViewingLegalDoc(null)}
        >
            {viewingLegalDoc === 'tos' ? <TermsOfService /> : <PrivacyPolicy />}
        </LegalModal>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-30 max-w-sm w-full p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
};

export default App;