import React, { useState } from 'react';
import { LoadingSpinnerIcon } from './icons';

interface ContentGeneratorProps {
  onGenerate: (prompt: string, tweetCount: number) => void;
  isLoading: boolean;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [tweetCount, setTweetCount] = useState<number>(3);

  const handleTweetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= 10) { // Limit to a reasonable number
        setTweetCount(count);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, tweetCount);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
                <label htmlFor="prompt-input" className="block text-lg font-medium text-slate-100 mb-3">
                    What's on your mind?
                </label>
                <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., The future of renewable energy..."
                className="w-full h-28 bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition resize-none"
                disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="tweet-count" className="block text-lg font-medium text-slate-100 mb-3">
                    Number of Tweets
                </label>
                <input
                    type="number"
                    id="tweet-count"
                    value={tweetCount}
                    onChange={handleTweetCountChange}
                    min="1"
                    max="10"
                    className="w-full h-28 bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 text-center text-4xl font-bold focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    disabled={isLoading}
                />
            </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="mt-4 w-full flex justify-center items-center gap-2 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </form>
    </div>
  );
};