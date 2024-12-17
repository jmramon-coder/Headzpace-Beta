import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const BentoButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bento-button fixed top-4 right-4 group"
      aria-label="Open widget selector"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse" />
      <div className="relative bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 p-2.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20 dark:border-cyan-500/20 group-hover:scale-110 transition-transform">
        <LayoutGrid className="w-4 h-4 text-white" />
      </div>
    </button>
  );
};