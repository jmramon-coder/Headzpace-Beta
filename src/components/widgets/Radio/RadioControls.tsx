import React from 'react';
import { Play, Pause } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  onTogglePlay: () => void;
  disabled?: boolean;
}

export const RadioControls = ({ isPlaying, onTogglePlay, disabled }: Props) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onTogglePlay}
        disabled={disabled}
        className="relative group disabled:opacity-50"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <div className="absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-12 h-12 rounded-full border-2 border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all group-hover:scale-105">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
          ) : (
            <Play className="w-5 h-5 text-indigo-500 dark:text-cyan-500 translate-x-0.5" />
          )}
        </div>
      </button>
    </div>
  );
};