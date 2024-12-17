import React from 'react';
import { MessageCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const ChatButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group transition-all duration-200 pointer-events-auto"
      aria-label="Open chat"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse" />
      <div className="relative bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 p-4 rounded-full shadow-lg backdrop-blur-sm border border-white/20 dark:border-cyan-500/20 group-hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6 text-white" />
      </div>
    </button>
  );
};