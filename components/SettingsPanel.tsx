import React, { useState, useEffect } from 'react';
import type { OpenRouterConfig } from '../types';
import { EyeIcon, EyeOffIcon, InfoIcon } from './icons';

/**
 * Props for the SettingsPanel component.
 */
interface SettingsPanelProps {
  /** Function to be called when the "Terms of Service" button is clicked. */
  onViewTos: () => void;
  /** Function to be called when the "Privacy Policy" button is clicked. */
  onViewPolicy: () => void;
}

/**
 * A reusable input field component with support for secret visibility toggling.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.value - The current value of the input field.
 * @param {Function} props.onChange - The function to call when the input value changes.
 * @param {boolean} [props.isSecret=false] - Whether the input is a secret and should have a visibility toggle.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @returns {JSX.Element} The rendered InputField component.
 */
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

/**
 * A component that provides a user interface for configuring API keys and other settings.
 * It allows users to input their X (Twitter) and OpenRouter API credentials.
 * @param {SettingsPanelProps} props - The component props.
 * @returns {JSX.Element} The rendered SettingsPanel component.
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onViewTos, onViewPolicy }) => {
    const [openRouterConfig, setOpenRouterConfig] = useState<OpenRouterConfig>({
        apiKey: localStorage.getItem('openRouterApiKey') || '',
        modelId: localStorage.getItem('openRouterModelId') || 'openai/gpt-3.5-turbo',
    });

    useEffect(() => {
        localStorage.setItem('openRouterApiKey', openRouterConfig.apiKey);
        localStorage.setItem('openRouterModelId', openRouterConfig.modelId);
    }, [openRouterConfig]);

  return (
    <div className="space-y-8">
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-sm rounded-lg p-4 flex gap-3">
            <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
            <div>
                <h3 className="font-bold">Security Warning</h3>
                <p>Your API keys are stored in your browser. For maximum security, use this tool on a private computer and close the tab when finished.</p>
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
        
        <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-sky-400 mb-4">About & Legal</h3>
            <div className="flex flex-col items-start space-y-3">
              <button onClick={onViewTos} className="text-slate-300 hover:text-sky-400 transition-colors text-sm">Terms of Service</button>
              <button onClick={onViewPolicy} className="text-slate-300 hover:text-sky-400 transition-colors text-sm">Privacy Policy</button>
            </div>
        </div>
    </div>
  );
};

export default SettingsPanel;
