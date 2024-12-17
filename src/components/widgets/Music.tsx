import React from 'react';
import { SkipForward, SkipBack } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

const LOFI_PLAYLIST = [
  {
    title: "Chill Lofi Beat",
    artist: "Lofi Girl",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
  },
  {
    title: "Dreamy Memories",
    artist: "Lofi Dreamer",
    url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3"
  },
  {
    title: "Coffee Shop",
    artist: "FASSounds",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_096eb9d70a.mp3"
  },
  {
    title: "Peaceful Piano",
    artist: "Music Unlimited",
    url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe5e085.mp3"
  },
  {
    title: "Night Study",
    artist: "Lofi Sleep",
    url: "https://cdn.pixabay.com/download/audio/2023/01/20/audio_f8581e3b7f.mp3"
  }
];

export const Music = () => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const currentTrack = LOFI_PLAYLIST[currentTrackIndex];

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % LOFI_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = LOFI_PLAYLIST[nextIndex].url;
      audioRef.current.play();
    }
  };

  const playPreviousTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? LOFI_PLAYLIST.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = LOFI_PLAYLIST[prevIndex].url;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    audioRef.current?.addEventListener('ended', playNextTrack);
    return () => audioRef.current?.removeEventListener('ended', playNextTrack);
  }, [currentTrackIndex]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-indigo-600 dark:text-cyan-300 mb-1">{currentTrack.title}</div>
        <div className="text-indigo-500/60 dark:text-cyan-400/60 text-sm mb-6">{currentTrack.artist}</div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={playPreviousTrack}
            className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="relative group"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className={`absolute inset-[-4px] bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 dark:from-cyan-500/20 dark:to-cyan-400/20 rounded-full blur-lg transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative">
              <div className={`w-12 h-12 rounded-full border-2 ${isPlaying ? 'border-dashed' : 'border-solid'} border-indigo-500 dark:border-cyan-500 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'animate-spin-slow' : 'scale-95 opacity-90'}`}>
                <div className="w-4 h-4 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-500" />
                </div>
              </div>
            </div>
          </button>
          <button 
            onClick={playNextTrack}
            className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.url} />
    </div>
  );
};