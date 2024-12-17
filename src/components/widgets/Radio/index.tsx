import React from 'react';
import { useRadioPlayer } from '../../../hooks/useRadioPlayer';
import { Volume2, VolumeX, Radio as RadioIcon, Play, Pause } from 'lucide-react';

export const Radio = () => {
  const {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    error,
    stations,
    setVolume,
    playStation,
    togglePlay,
  } = useRadioPlayer();

  const [isMuted, setIsMuted] = React.useState(false);
  const previousVolume = React.useRef(volume);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
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

  return (
    <div className="h-full flex flex-col p-4">
      {/* Current Station */}
      <div className="text-center mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
        ) : currentStation ? (
          <>
            <div className="text-lg font-medium text-indigo-600 dark:text-cyan-300 mb-1">
              {currentStation.name}
            </div>
            <div className="text-sm text-indigo-500/60 dark:text-cyan-400/60">
              {currentStation.genre}
            </div>
          </>
        ) : (
          <div className="text-sm text-indigo-500/60 dark:text-cyan-400/60">
            Select a station to begin
          </div>
        )}
      </div>

      {/* Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 mb-8">
        {/* Play/Pause Button */}
        {currentStation && !isLoading && (
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="relative group disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`relative w-12 h-12 rounded-full border-2 ${
              isPlaying ? 'border-dashed animate-spin-slow' : 'border-solid'
            } border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all group-hover:scale-105 hover:brightness-110`}>
              {isPlaying ? (
                <Pause className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
              ) : (
                <Play className="w-5 h-5 text-indigo-500 dark:text-cyan-500 translate-x-0.5" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={toggleMute}
          className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-indigo-100 dark:bg-cyan-500/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 dark:[&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-indigo-600 dark:hover:[&::-webkit-slider-thumb]:bg-cyan-400"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Station List */}
      <div className="space-y-1 max-h-48 overflow-y-auto overscroll-contain no-scrollbar">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => playStation(station)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentStation?.id === station.id
                ? 'bg-indigo-50 dark:bg-cyan-500/10'
                : 'hover:bg-indigo-50 dark:hover:bg-cyan-500/10'
            }`}
          >
            <div className="relative">
              <RadioIcon className={`w-4 h-4 ${
                currentStation?.id === station.id
                  ? 'text-indigo-500 dark:text-cyan-500'
                  : 'text-slate-400 dark:text-slate-500'
              }`} />
              {currentStation?.id === station.id && isPlaying && (
                <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20 dark:bg-cyan-500/20" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className={`text-sm font-medium ${
                currentStation?.id === station.id
                  ? 'text-indigo-600 dark:text-cyan-300'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {station.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {station.genre}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};