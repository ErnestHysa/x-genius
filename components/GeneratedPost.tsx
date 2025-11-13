import React from 'react';
import type { XAuth } from '../types';
import { LoadingSpinnerIcon, XLogoIcon } from './icons';

interface GeneratedPostProps {
  content: string[];
  onPost: () => void;
  isPosting: boolean;
  isLoading: boolean;
  xAuth: XAuth;
  onLogin: () => void;
}

const TweetCard: React.FC<{ text: string; index: number; total: number }> = ({ text, index, total }) => {
  const charCount = text.length;

  return (
    <div className="bg-slate-900 border border-slate-600 rounded-md p-3">
      <p className="min-h-[60px] text-slate-200 whitespace-pre-wrap">{text}</p>
      <div className="flex justify-end items-center mt-2 text-sm">
        {total > 1 && <span className="text-slate-500 mr-2">{index + 1}/{total}</span>}
        <span className="font-mono text-slate-400">
          {charCount} / 280
        </span>
      </div>
    </div>
  );
};

export const GeneratedPost: React.FC<GeneratedPostProps> = ({ content, onPost, isPosting, isLoading, xAuth, onLogin }) => {
  const isContentEmpty = content.length === 0 || content.every(tweet => tweet.trim() === '');

  if (isLoading) {
      return (
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50 min-h-[220px] flex flex-col justify-center items-center">
              <LoadingSpinnerIcon className="w-8 h-8 text-sky-500 animate-spin mb-4"/>
              <p className="text-slate-400">Genius at work...</p>
          </div>
      )
  }

  if (isContentEmpty) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-dashed border-slate-700 min-h-[220px] flex flex-col justify-center items-center">
            <p className="text-slate-500">Your generated thread will appear here.</p>
        </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-medium text-slate-100 mb-4">Generated Thread</h3>
      <div className="space-y-4">
        {content.map((tweet, index) => (
          <TweetCard key={index} text={tweet} index={index} total={content.length} />
        ))}
      </div>
      <div className="flex justify-end items-center mt-6">
        {xAuth.isAuthenticated ? (
          <button
            onClick={onPost}
            disabled={isPosting || isContentEmpty}
            className="flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isPosting ? (
              <>
                <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />
                Posting Thread...
              </>
            ) : (
              <>
                <XLogoIcon className="w-5 h-5"/>
                Post Thread to X
              </>
            )}
          </button>
        ) : (
           <button
            onClick={onLogin}
            className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-slate-600 transition-colors duration-300"
           >
            <XLogoIcon className="w-5 h-5"/>
            Login with X to Post
          </button>
        )}
      </div>
    </div>
  );
};