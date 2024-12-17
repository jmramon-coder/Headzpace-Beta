import { useEffect, useRef, useState } from 'react';
import type { Track } from './types';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
}

export const useAudioController = (track: Track) => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: true,
    error: null,
    currentTime: 0,
    duration: 0
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    const nextAudio = new Audio();
    audioRef.current = audio;
    nextAudioRef.current = nextAudio;

    const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));
    const handleLoadStart = () => setState(prev => ({ ...prev, isLoading: true }));
    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
      if (state.isPlaying) {
        audio.play().catch(() => {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            error: 'Playback failed'
          }));
        });
      }
    };
    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration
      }));
    };
    const handleError = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Failed to load audio'
      }));
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);

    // Load initial track
    const loadTrack = () => {
      audio.src = track.url;
      audio.load();
    };

    // Preload next track
    const preloadNextTrack = (url: string) => {
      nextAudio.src = url;
      nextAudio.load();
    };

    loadTrack();

    return () => {
      audio.pause();
      nextAudio.pause();
      audio.src = '';
      nextAudio.src = '';
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
    };
  }, [track.url]);

  const play = async () => {
    if (!audioRef.current) return;
    
    // If audio is already loaded, play immediately
    if (audioRef.current.readyState >= 3) {
      try {
        await audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true, error: null }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          error: 'Playback failed'
        }));
      }
      return;
    }

    // Otherwise, set loading state and wait for canplay event
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        error: 'Playback failed'
      }));
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  return {
    ...state,
    play,
    pause,
    seek
  };
};