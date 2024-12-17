import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAudioPlayer } from '../../../hooks/useAudioPlayer';
import { LOFI_PLAYLIST } from './config';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';
import { Visualizer } from './Visualizer';

export const Music = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(volume);

  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    play,
    pause,
    seek,
    setVolume: setAudioVolume
  } = useAudioPlayer(LOFI_PLAYLIST[currentTrackIndex]);

  useEffect(() => {
    setAudioVolume(isMuted ? 0 : volume);
  }, [volume, isMuted, setAudioVolume]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % LOFI_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 
      ? LOFI_PLAYLIST.length - 1 
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        {/* Track Info */}
        <TrackInfo
          track={LOFI_PLAYLIST[currentTrackIndex]}
          isPlaying={isPlaying}
          error={error}
        />

        {/* Visualizer */}
        <div className="flex-1 flex items-center justify-center">
          <Visualizer isPlaying={isPlaying} />
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <VolumeControl
              volume={volume}
              onChange={setVolume}
              isMuted={isMuted}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={isLoading}
              className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 disabled:opacity-50 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="relative group"
            >
              <div className="absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 rounded-full border-2 border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all group-hover:scale-105">
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
                ) : (
                  <Play className="w-5 h-5 text-indigo-500 dark:text-cyan-500 translate-x-0.5" />
                )}
              </div>
            </button>
            
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 disabled:opacity-50 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-[88px]" /> {/* Spacer to balance layout */}
        </div>
      </div>
    </div>
  );
};
        {error ? (
          <div className="text-red-500 dark:text-red-400 text-sm mb-6">
            {error}
          </div>
        ) : (
          <>
            <div className="text-indigo-600 dark:text-cyan-300 mb-1">
              {currentSource.track.title}
            </div>
            <div className="text-indigo-500/60 dark:text-cyan-400/60 text-sm mb-6">
              {currentSource.track.artist}
            </div>
          </>
        )}
        
        <Controls
          isPlaying={isPlaying}
          isLoading={isLoading}
          disabled={!!error}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
};