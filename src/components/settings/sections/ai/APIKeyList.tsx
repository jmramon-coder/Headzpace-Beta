import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Trash2, Check, Unlink, Copy } from 'lucide-react';
import { useAI } from '../../../../context/AIContext';

export const APIKeyList = () => {
  const { apiKeys, activeKey, removeApiKey, setActiveKey } = useAI();
  const [visibleKeyIds, setVisibleKeyIds] = useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (keyId: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        No API keys added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {apiKeys.map((key) => (
        <div
          key={key.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            key.isActive
              ? 'bg-indigo-50 dark:bg-cyan-500/10 border-indigo-200 dark:border-cyan-500/30'
              : 'bg-white dark:bg-black/30 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => setActiveKey(key.id)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                key.isActive
                  ? 'bg-indigo-500 dark:bg-cyan-500 border-indigo-500 dark:border-cyan-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {key.isActive && <Check className="w-3 h-3 text-white dark:text-black/80" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {key.name}
                </span>
              </div>
              <div className="text-xs text-slate-500 truncate">
                Added {new Date(key.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-1 text-xs font-mono truncate">
                {visibleKeyIds.has(key.id) ? key.key : '••••••••••••••••'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-1 mr-1">
              {key.isActive && (
                <button
                  onClick={() => setActiveKey('')}
                  className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors"
                  title="Unlink API key"
                >
                  <Unlink className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => toggleKeyVisibility(key.id)}
                className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors"
                title={visibleKeyIds.has(key.id) ? "Hide API key" : "Show API key"}
              >
                {visibleKeyIds.has(key.id) ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(key.id, key.key)}
                className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors"
                title="Copy API key"
              >
                {copiedKeyId === key.id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              onClick={() => removeApiKey(key.id)}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Remove API key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};