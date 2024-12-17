import React from 'react';
import type { Track } from './types';

interface Props {
  track: Track;
  isPlaying: boolean;
  error: string | null;
}

export const TrackInfo = ({ track, isPlaying, error }: Props) => {
  return (
    <div className="text-center mb-4">
      {error ? (
        <div className="text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="text-lg font-medium text-indigo-600 dark:text-cyan-300 mb-1">
            {track.title}
          </div>
          <div className="text-sm text-indigo-500/60 dark:text-cyan-400/60">
            {track.artist}
          </div>
        </>
      )}
    </div>
  );
};