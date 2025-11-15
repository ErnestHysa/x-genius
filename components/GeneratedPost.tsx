import React from 'react';
import { LoadingSpinnerIcon, XLogoIcon } from './icons';

/**
 * Props for the GeneratedPost component.
 */
interface GeneratedPostProps {
  /** The generated content, an array of tweet strings. */
  content: string[];
  /** Function to call when the post button is clicked. */
  onPost: () => void;
  /** Boolean indicating if the content is currently being posted. */
  isPosting: boolean;
  /** Boolean indicating if new content is being generated. */
  isLoading: boolean;
  /** Boolean indicating if the user is authenticated to post. */
  isAuthenticated: boolean;
}

/**
 * A component that displays a single tweet card within a thread.
 * It shows the tweet text, character count, and its position in the thread.
 * @param {object} props - The component props.
 * @param {string} props.text - The text content of the tweet.
 * @param {number} props.index - The index of the tweet in the thread.
 * @param {number} props.total - The total number of tweets in the thread.
 * @returns {JSX.Element} The rendered TweetCard component.
 */
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

/**
 * A component to display the generated thread of tweets.
 * It handles loading states, empty states, and provides a button to post the thread.
 * @param {GeneratedPostProps} props - The component props.
 * @returns {JSX.Element} The rendered GeneratedPost component.
 */
export const GeneratedPost: React.FC<GeneratedPostProps> = ({ content, onPost, isPosting, isLoading, isAuthenticated }) => {
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
        <button
          onClick={onPost}
          disabled={isPosting || isContentEmpty || !isAuthenticated}
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
              {isAuthenticated ? 'Post Thread to X' : 'Configure API Keys to Post'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};