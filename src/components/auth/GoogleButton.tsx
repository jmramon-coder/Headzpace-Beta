import React from 'react';
import { Chrome } from 'lucide-react';

interface Props {
  onClick: () => void;
  isLoading?: boolean;
}

export const GoogleButton = ({ onClick, isLoading }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-black/30 border border-slate-200 dark:border-cyan-500/30 rounded-lg py-3 px-4 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all relative group"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-indigo-500/30 dark:border-cyan-500/30 border-t-indigo-500 dark:border-t-cyan-500 rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : (
        <>
          <Chrome className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
          <span className="font-medium">Continue with Google</span>
          <div className="absolute inset-0 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </button>
  );
};