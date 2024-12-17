import React from 'react';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar = ({ currentTime, duration, onSeek }: Props) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  return (
    <div className="w-full space-y-1">
      <div
        className="h-1 bg-indigo-100 dark:bg-cyan-500/20 rounded-full cursor-pointer relative overflow-hidden group"
        onClick={handleClick}
      >
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 dark:from-cyan-500/0 dark:via-cyan-500/20 dark:to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex justify-between text-xs text-indigo-500/60 dark:text-cyan-400/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};