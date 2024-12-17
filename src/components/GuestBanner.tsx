import React from 'react';
import { Unlink, Minimize2 } from 'lucide-react';

interface Props {
  onSignUp: () => void;
}

export const GuestBanner = ({ onSignUp }: Props) => {
  const [isMinimized, setIsMinimized] = React.useState(true);

  return (
    <div className="guest-banner fixed top-16 sm:top-20 right-4">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center w-9 h-9 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg transition-all hover:scale-105"
          title="Guest Mode Active - Click to expand"
        >
          <Unlink className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-white/80 dark:bg-black/30 backdrop-blur-md border border-indigo-200 dark:border-cyan-500/20 rounded-full py-1.5 px-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Unlink className="w-5 h-5 text-red-500 dark:text-red-400" />
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              Guest Mode
            </span>
          </div>
          <button
            onClick={() => {
              onSignUp();
              setIsMinimized(false);
            }}
            className="text-xs bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white px-3 py-1.5 rounded-full hover:brightness-110 transition-all"
          >
            Create
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-slate-400 hover:text-indigo-600 dark:text-cyan-400/60 dark:hover:text-cyan-300 p-2"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}