import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { useAI } from '../../../../context/AIContext';

interface Props {
  onCancel: () => void;
}

export const APIKeyForm = ({ onCancel }: Props) => {
  const { addApiKey } = useAI();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await addApiKey(name, key);
      setName('');
      setKey('');
      onCancel();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add API key');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Key Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Production Key"
          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          API Key
        </label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white font-medium rounded-lg hover:brightness-110 transition-all"
        >
          Add Key
        </button>
      </div>
    </form>
  );
};