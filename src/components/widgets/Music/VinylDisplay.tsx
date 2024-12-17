import React from 'react';

interface Props {
  isPlaying: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const VinylDisplay = ({ isPlaying, isLoading, disabled, onClick }: Props) => (
  <button 
    onClick={onClick}
    className="relative group"
    aria-label={isPlaying ? 'Pause' : 'Play'}
    disabled={isLoading || disabled}
  >
    <div className={`absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
    <div className="relative">
      <div className={`w-12 h-12 rounded-full border-2 ${isPlaying ? 'border-dashed' : 'border-solid'} border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all duration-500 ${
        isLoading || disabled
          ? 'opacity-50'
          : isPlaying 
            ? 'animate-spin-slow' 
            : 'scale-95 opacity-90'
      }`}>
        <div className="w-4 h-4 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-500" />
        </div>
      </div>
    </div>
  </button>
);