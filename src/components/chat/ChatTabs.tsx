import React from 'react';
import { Plus, X, MessageCircle, Bot } from 'lucide-react';
import type { ChatTab } from '../../types';

const MAX_TABS = 5;

interface Props {
  tabs: ChatTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
}

export const ChatTabs = ({ 
  tabs, 
  activeTabId, 
  onTabChange, 
  onNewTab, 
  onCloseTab
}: Props) => {
  return (
    <div className="relative flex items-center border-b border-indigo-200 dark:border-cyan-500/20">
      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-0.5 px-2 py-1 min-w-0 pr-14">
        {/* Master Chat Tab */}
        <div
          className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
            activeTabId === 'master'
              ? 'bg-indigo-500/10 dark:bg-cyan-500/20 shadow-sm'
              : 'hover:bg-indigo-50 dark:hover:bg-cyan-500/10'
          }`}
          onClick={() => onTabChange('master')}
        >
          <Bot className={`w-3.5 h-3.5 ${
            activeTabId === 'master'
              ? 'text-indigo-600 dark:text-cyan-400'
              : 'text-slate-400 dark:text-slate-500'
          }`} />
          <span className={`text-sm truncate max-w-[100px] ${
            activeTabId === 'master'
              ? 'text-indigo-600 dark:text-cyan-300 font-medium'
              : 'text-slate-600 dark:text-slate-400'
          }`}>
            Master
          </span>
        </div>

        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTabId === tab.id
                ? 'bg-indigo-500/10 dark:bg-cyan-500/20 shadow-sm'
                : 'hover:bg-indigo-50 dark:hover:bg-cyan-500/10'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {/* Tab Icon */}
            <MessageCircle className={`w-3.5 h-3.5 ${
              activeTabId === tab.id
                ? 'text-indigo-600 dark:text-cyan-400'
                : 'text-slate-400 dark:text-slate-500'
            }`} />

            {/* Tab Name */}
            <span className={`text-sm truncate max-w-[100px] ${
              activeTabId === tab.id
                ? 'text-indigo-600 dark:text-cyan-300 font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {tab.name}
            </span>

            {/* Close Button */}
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-cyan-300 hover:bg-indigo-50 dark:hover:bg-cyan-500/10 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        </div>
      </div>
      
      {/* Sticky New Tab Button */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <button
          onClick={onNewTab}
          disabled={tabs.length >= MAX_TABS}
          className={`p-1.5 rounded-lg transition-all bg-white dark:bg-black border border-slate-200 dark:border-cyan-500/20 ${
            tabs.length >= MAX_TABS
              ? 'opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500'
              : 'text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-cyan-300 hover:bg-indigo-50 dark:hover:bg-cyan-500/10 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
          }`}
          title="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};