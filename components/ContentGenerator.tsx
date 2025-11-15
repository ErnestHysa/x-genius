// components/ContentGenerator.tsx
import React, { useState } from 'react';
import { postToX } from '../services/xService';
import { getAccessToken } from '../services/authService';
import { generateContent } from '../services/openRouterService';

interface ContentGeneratorProps {
    onLogout: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onLogout }) => {
    const [topic, setTopic] = useState('');
    const [thread, setThread] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = localStorage.getItem('openRouterApiKey') || '';
            const model = localStorage.getItem('openRouterModelId') || 'openai/gpt-3.5-turbo';
            const generatedThread = await generateContent(topic, model, apiKey, 5);
            setThread(generatedThread);
        } catch (err) {
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePost = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getAccessToken();
            if (token) {
                await postToX(thread, token.accessToken, token.accessSecret);
            }
        } catch (err) {
            setError('Failed to post to X. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic for your X thread..."
                    className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500"
                >
                    {isLoading ? 'Generating...' : 'Generate Thread'}
                </button>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {thread.length > 0 && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Generated Thread</h2>
                    {thread.map((tweet, index) => (
                        <p key={index} className="mb-4 p-3 bg-gray-700 rounded-lg">
                            {tweet}
                        </p>
                    ))}
                    <button
                        onClick={handlePost}
                        disabled={isLoading}
                        className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
                    >
                        {isLoading ? 'Posting...' : 'Post to X'}
                    </button>
                </div>
            )}
            <button
                onClick={onLogout}
                className="w-full mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

export default ContentGenerator;
