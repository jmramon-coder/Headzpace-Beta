import React from 'react';
import { Key, ChevronDown } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import type { APIKey } from '../../types';

interface Props {
  selectedKeyId?: string;
  onKeyChange: (keyId: string) => void;
}

export const ChatHeader = ({ selectedKeyId, onKeyChange }: Props) => {
  const { apiKeys, activeKey } = useAI();
  const [showKeySelector, setShowKeySelector] = React.useState(false);
  const selectorRef = React.useRef<HTMLDivElement>(null);
  
  const selectedKey = selectedKeyId 
    ? apiKeys.find(k => k.id === selectedKeyId)
    : activeKey;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowKeySelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-2 border-b border-indigo-200 dark:border-cyan-500/20">
      <div
        ref={selectorRef}
        className="relative"
      >
        <div
          onClick={() => setShowKeySelector(!showKeySelector)}
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-black/30 border border-indigo-200 dark:border-cyan-500/30 rounded-lg text-sm text-slate-800 dark:text-white hover:border-indigo-500 dark:hover:border-cyan-500 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500 dark:text-cyan-500" />
            <span>{selectedKey?.name || 'Select API Key'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover:text-indigo-500 dark:group-hover:text-cyan-500 ${
            showKeySelector ? 'rotate-180' : ''
          }`} />
        </div>

        {/* Dropdown */}
        {showKeySelector && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black/90 rounded-lg shadow-xl border border-slate-200 dark:border-cyan-500/20 py-1 z-10 backdrop-blur-sm">
            {apiKeys.map((key) => (
              <button
                key={key.id}
                onClick={(e) => {
                  onKeyChange(key.id);
                  setShowKeySelector(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 ${
                  key.id === selectedKeyId
                    ? 'bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Key className={`w-3 h-3 ${
                  key.id === selectedKeyId
                    ? 'text-indigo-500 dark:text-cyan-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`} />
                {key.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};