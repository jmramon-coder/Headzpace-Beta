import React from 'react';
import { Play, Pause } from 'lucide-react';

const CHILLHOP_STATION = {
  name: 'Chillhop',
  genre: 'Lo-Fi Hip Hop',
  url: 'https://streams.ilovemusic.de/iloveradio17.mp3'
};

export const DemoRadio = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = React.useRef<number>();

  React.useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.7;
    audioRef.current = audio;
    
    const handleCanPlay = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoading(false);
    };

    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      audio.pause();
      audio.src = '';
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);


  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src) {
          setIsLoading(true);
          audioRef.current.src = CHILLHOP_STATION.url;
          // Add minimum loading time for better UX
          loadingTimeoutRef.current = window.setTimeout(() => {
            if (!isPlaying) {
              setIsLoading(false);
            }
          }, 1000);
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback failed:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {/* Station Info */}
      <div className={`text-center mb-6 transition-opacity duration-200 ${isLoading ? 'opacity-50' : ''}`}>
        <div className="text-lg font-medium text-indigo-600 dark:text-cyan-300 mb-1">
          {CHILLHOP_STATION.name}
        </div>
        <div className="text-sm text-indigo-500/60 dark:text-cyan-400/60">
          {CHILLHOP_STATION.genre}
        </div>
      </div>

      {/* Play Button */}
      <button
        onClick={togglePlay}
        className="relative group"
        disabled={isLoading}
        aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
      >
        <div className="absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`relative w-12 h-12 rounded-full border-2 ${
          isLoading ? 'border-dashed animate-spin' :
          isPlaying ? 'border-dashed animate-spin-slow' : 
          'border-solid'
        } border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all group-hover:scale-105`}>
          {isLoading ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
          ) : (
            <Play className="w-5 h-5 text-indigo-500 dark:text-cyan-500 translate-x-0.5" />
          )}
        </div>
      </button>
      {isLoading && (
        <div className="mt-4 text-xs text-indigo-500/60 dark:text-cyan-400/60 animate-pulse">
          Loading stream...
        </div>
      )}
    </div>
  );
};