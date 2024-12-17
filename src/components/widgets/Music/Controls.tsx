import React from 'react';
import { SkipForward, SkipBack } from 'lucide-react';
import { VinylDisplay } from './VinylDisplay';

interface Props {
  isPlaying: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Controls = ({ isPlaying, isLoading, disabled, onPlayPause, onNext, onPrevious }: Props) => (
  <div className="flex items-center gap-6">
    <button 
      onClick={onPrevious}
      disabled={isLoading || disabled}
      className={`text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 ${
        (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <SkipBack className="w-5 h-5" />
    </button>
    <VinylDisplay 
      isPlaying={isPlaying} 
      isLoading={isLoading} 
      disabled={disabled}
      onClick={onPlayPause} 
    />
    <button 
      onClick={onNext}
      disabled={isLoading || disabled}
      className={`text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 ${
        (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <SkipForward className="w-5 h-5" />
    </button>
  </div>
);