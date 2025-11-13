
import React, { useState } from 'react';
import { LoadingSpinnerIcon } from './icons';

interface ContentGeneratorProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <form onSubmit={handleSubmit}>
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
