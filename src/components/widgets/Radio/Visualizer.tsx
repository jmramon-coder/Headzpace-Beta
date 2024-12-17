import React from 'react';

interface Props {
  isPlaying: boolean;
}

export const Visualizer = ({ isPlaying }: Props) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-400 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'animate-[bounce_1s_ease-in-out_infinite]' 
              : 'h-4'
          }`}
          style={{
            height: isPlaying ? `${Math.random() * 24 + 16}px` : '16px',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};