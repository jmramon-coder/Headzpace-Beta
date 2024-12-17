import React from 'react';

interface Props {
  volume: number;
  onChange: (volume: number) => void;
  isMuted: boolean;
}

export const VolumeControl = ({ volume, onChange, isMuted }: Props) => {
  return (
    <div className="w-20">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-indigo-100 dark:bg-cyan-500/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 dark:[&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-indigo-600 dark:hover:[&::-webkit-slider-thumb]:bg-cyan-400"
      />
    </div>
  );
};