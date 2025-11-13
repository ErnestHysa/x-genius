import React from 'react';
import { CloseIcon } from './icons';

interface LegalModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col border border-slate-700 transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
