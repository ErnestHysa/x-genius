import React, { useState, useEffect } from 'react';
import type { OpenRouterConfig, Notification, XApiKeys } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { ContentGenerator } from './components/ContentGenerator';
import { GeneratedPost } from './components/GeneratedPost';
import { generateContent } from './services/openRouterService';
import { postToX, validateKeys } from './services/twitter-api';
import { XLogoIcon, SettingsIcon, CloseIcon } from './components/icons';
import { LegalModal } from './components/LegalModal';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';

/**
 * The main application component.
 * It manages the application's state, including API keys, generated content, and UI status.
 * It also orchestrates the interactions between the different components.
 * @returns {JSX.Element} The rendered App component.
 */
const App: React.FC = () => {
  const [xApiKeys, setXApiKeys] = useState<XApiKeys>({ apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [openRouterConfig, setOpenRouterConfig] = useState<OpenRouterConfig>({ apiKey: '', modelId: 'openai/gpt-3.5-turbo' });
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [viewingLegalDoc, setViewingLegalDoc] = useState<'tos' | 'policy' | null>(null);

  /**
   * Displays a notification to the user.
   * @param {string} message - The message to display.
   * @param {'success' | 'error'} type - The type of notification.
   */
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };
  
  useEffect(() => {
    setIsAuthenticated(validateKeys(xApiKeys));
  }, [xApiKeys]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  /**
   * Handles errors from async operations, displaying a notification to the user.
   * @param {unknown} error - The error object.
   * @param {string} context - The context in which the error occurred (e.g., "Content generation").
   */
  const handleError = (error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error) || 'An unknown error occurred.';
    showNotification(`${context} failed: ${errorMessage}`, 'error');
    console.error(`${context} Error:`, error);
  };
  
  /**
   * Handles the content generation process.
   * @param {string} prompt - The prompt to be used for generating content.
   * @param {number} tweetCount - The number of tweets to generate.
   */
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

  /**
   * Handles the process of posting the generated content to X.
   */
  const handlePost = async () => {
    if (!isAuthenticated) {
      showNotification('Please configure your X API keys in settings.', 'error');
      setIsSettingsOpen(true);
      return;
    }
    
    setIsPosting(true);
    try {
      const result = await postToX(generatedContent, xApiKeys);
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
            isAuthenticated={isAuthenticated}
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
                        xApiKeys={xApiKeys}
                        setXApiKeys={setXApiKeys}
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