import React from 'react';
import { MessageCircle, Key } from 'lucide-react';

interface Props {
  isAuthenticated: boolean;
}

export const AIStatusBanner = ({ isAuthenticated }: Props) => {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg ${
      isAuthenticated 
        ? 'bg-indigo-50 dark:bg-cyan-500/10' 
        : 'bg-white/40 dark:bg-white/5'
    }`}>
      <div className="p-2 bg-indigo-50 dark:bg-cyan-500/10 rounded-lg">
        <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-slate-800 dark:text-white">Chat Intelligence</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {isAuthenticated 
            ? "AI chat is enabled and ready to assist you in both the chat widget and dashboard"
            : "Add your preferred AI model's API key to enable intelligent chat features"}
        </p>
        {isAuthenticated && (
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-cyan-500"></span>
            </span>
            <span className="text-xs text-indigo-600 dark:text-cyan-400">Connected</span>
          </div>
        )}
      </div>
    </div>
  );
};