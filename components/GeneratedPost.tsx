
import React from 'react';
import type { XAuth } from '../types';
import { LoadingSpinnerIcon, XLogoIcon } from './icons';

interface GeneratedPostProps {
  content: string;
  onPost: () => void;
  isPosting: boolean;
  isLoading: boolean;
  xAuth: XAuth;
  onLogin: () => void;
}

export const GeneratedPost: React.FC<GeneratedPostProps> = ({ content, onPost, isPosting, isLoading, xAuth, onLogin }) => {
  const charCount = content.length;
  const isOverLimit = charCount > 280;

  const getCharCountColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (charCount > 260) return 'text-yellow-400';
    return 'text-slate-400';
  };

  if (isLoading) {
      return (
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50 min-h-[220px] flex flex-col justify-center items-center">
              <LoadingSpinnerIcon className="w-8 h-8 text-sky-500 animate-spin mb-4"/>
              <p className="text-slate-400">Genius at work...</p>
          </div>
      )
  }

  if (!content) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-dashed border-slate-700 min-h-[220px] flex flex-col justify-center items-center">
            <p className="text-slate-500">Your generated content will appear here.</p>
        </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-medium text-slate-100 mb-3">Generated Post</h3>
      <div className="bg-slate-900 border border-slate-600 rounded-md p-3 min-h-[120px] text-slate-200 whitespace-pre-wrap">
        {content}
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm font-mono ${getCharCountColor()}`}>
          {charCount} / 280
        </span>
        {xAuth.isAuthenticated ? (
          <button
            onClick={onPost}
            disabled={isPosting || isOverLimit || charCount === 0}
            className="flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isPosting ? (
              <>
                <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <XLogoIcon className="w-5 h-5"/>
                Post to X
              </>
            )}
          </button>
        ) : (
           <button
            onClick={onLogin}
            className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-300"
           >
            <XLogoIcon className="w-5 h-5"/>
            Login with X to Post
          </button>
        )}
      </div>
    </div>
  );
};
