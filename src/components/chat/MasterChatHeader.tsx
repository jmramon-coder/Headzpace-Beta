import React from 'react';
import { Bot, Check } from 'lucide-react';
import type { ChatTab } from '../../types';

interface Props {
  tabs: ChatTab[];
  selectedTabs: string[];
  onSelectedTabsChange: (tabs: string[]) => void;
}

export const MasterChatHeader = ({ tabs, selectedTabs, onSelectedTabsChange }: Props) => {
  const [showSelector, setShowSelector] = React.useState(false);
  const selectorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTab = (tabId: string) => {
    if (selectedTabs.includes(tabId)) {
      onSelectedTabsChange(selectedTabs.filter(id => id !== tabId));
    } else {
      onSelectedTabsChange([...selectedTabs, tabId]);
    }
  };

  return (
    <div className="px-4 py-2 border-b border-indigo-200 dark:border-cyan-500/20">
      <div
        ref={selectorRef}
        className="relative"
      >
        <div
          onClick={() => setShowSelector(!showSelector)}
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-black/30 border border-indigo-200 dark:border-cyan-500/30 rounded-lg text-sm text-slate-800 dark:text-white hover:border-indigo-500 dark:hover:border-cyan-500 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-500 dark:text-cyan-500" />
            <span>
              {selectedTabs.length === 0
                ? 'Broadcast to all chats'
                : `${selectedTabs.length} chat${selectedTabs.length > 1 ? 's' : ''} selected`}
            </span>
          </div>
        </div>

        {showSelector && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black/90 rounded-lg shadow-xl border border-slate-200 dark:border-cyan-500/20 py-1 z-10 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                className={`w-full px-3 py-1.5 text-left text-sm flex items-center justify-between ${
                  selectedTabs.includes(tab.id)
                    ? 'bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{tab.name}</span>
                {selectedTabs.includes(tab.id) && (
                  <Check className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};