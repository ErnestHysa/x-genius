
import React, { useState } from 'react';
import type { OpenRouterConfig } from '../types';
import { EyeIcon, EyeOffIcon, InfoIcon } from './icons';

interface SettingsPanelProps {
  openRouterConfig: OpenRouterConfig;
  setOpenRouterConfig: React.Dispatch<React.SetStateAction<OpenRouterConfig>>;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isSecret?: boolean; placeholder?: string }> = ({ label, value, onChange, isSecret = false, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputType = isSecret ? (isVisible ? 'text' : 'password') : 'text';

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
        />
        {isSecret && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-sky-400"
            aria-label={isVisible ? "Hide secret" : "Show secret"}
          >
            {isVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ openRouterConfig, setOpenRouterConfig }) => {
  return (
    <div className="space-y-8">
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-sm rounded-lg p-4 flex gap-3">
            <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
            <div>
                <h3 className="font-bold">Security Warning</h3>
                <p>Your OpenRouter API key is stored in your browser. For maximum security, use this tool on a private computer and close the tab when finished.</p>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-sky-400 border-b border-slate-700 pb-2">OpenRouter API</h3>
            <InputField
                label="API Key"
                value={openRouterConfig.apiKey}
                onChange={(e) => setOpenRouterConfig(prev => ({...prev, apiKey: e.target.value}))}
                isSecret
                placeholder="sk-or-..."
            />
            <InputField
                label="Model ID"
                value={openRouterConfig.modelId}
                onChange={(e) => setOpenRouterConfig(prev => ({...prev, modelId: e.target.value}))}
                placeholder="e.g., openai/gpt-3.5-turbo"
            />
        </div>
    </div>
  );
};
