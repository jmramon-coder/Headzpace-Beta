import { useState, useRef, useCallback, useEffect } from 'react';
import type { Track } from '../types';

const CROSSFADE_DURATION = 500;

interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  currentTrackIndex: number;
  isTransitioning: boolean;
}

export const useAudioPlayer = (track: Track) => {
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    currentTime: 0,
    duration: 0,
    currentTrackIndex: 0,
    isTransitioning: false
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number>();

  useEffect(() => {
    const audio = new Audio();
    const nextAudio = new Audio();
    
    audio.preload = 'auto';
    nextAudio.preload = 'auto';
    
    // Prevent browser auto-play blocking
    audio.volume = 0;
    nextAudio.volume = 0;
    
    audioRef.current = audio;
    nextAudioRef.current = nextAudio;

    return () => {
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      nextAudio.pause();
      audio.src = '';
      nextAudio.src = '';
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isLoading: false, 
        error: null 
      }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleTimeUpdate = () => {
      
      // Only auto-play if we were playing before
      if (state.isPlaying) play();
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
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Load track
    audio.src = track.url;
    audio.load();

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [track.url]);

  const fadeOut = useCallback((audio: HTMLAudioElement) => {
    return new Promise<void>((resolve) => {
      const startVolume = audio.volume;
      const steps = 20;
      const decrementValue = startVolume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.max(0, startVolume - (decrementValue * currentStep));
        audio.volume = newVolume;

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          audio.pause();
          resolve();
        }
      }, CROSSFADE_DURATION / steps);

      fadeIntervalRef.current = fadeInterval;
    });
  }, []);

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number) => {
    return new Promise<void>((resolve) => {
      const steps = 20;
      const incrementValue = targetVolume / steps;
      let currentStep = 0;

      audio.volume = 0;
      audio.play().catch(() => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          error: 'Playback failed'
        }));
      });

      const fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(targetVolume, incrementValue * currentStep);
        audio.volume = newVolume;

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          resolve();
        }
      }, CROSSFADE_DURATION / steps);

      fadeIntervalRef.current = fadeInterval;
    });
  }, []);

  const safePlay = useCallback(async (audio: HTMLAudioElement) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Ensure audio is ready
      if (audio.readyState < 3) {
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
            resolve(undefined);
          };
          
          const handleError = () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
            reject(new Error('Audio failed to load'));
          };
          
          audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
          audio.addEventListener('error', handleError, { once: true });
        });
      }

      await fadeIn(audio, 1);
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isLoading: false, 
        error: null 
      }));
    } catch (error) {
      console.error('Playback failed:', error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Playback failed'
      }));
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      await safePlay(audioRef.current);
    } catch (error) {
      console.error('Play failed:', error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        error: 'Playback failed'
      }));
    }
  }, [safePlay]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    await fadeOut(audioRef.current);
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [fadeOut]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, []);

  return {
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    error: state.error,
    currentTime: state.currentTime,
    duration: state.duration,
    play,
    pause,
    seek,
    setVolume
  };
};
    const audio = audioRef.current;
    if (!audio || state.isLoading || state.isTransitioning) return;

    if (state.isPlaying) {
      audio.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      safePlay(audio);
    }
  }, [state.isPlaying, state.isLoading, state.isTransitioning, safePlay]);

  const changeTrack = useCallback(async (index: number) => {
    if (state.isTransitioning || !audioRef.current || !nextAudioRef.current) return;
    
    setState(prev => ({ ...prev, isTransitioning: true }));
    
    // Fade out current track
    audioRef.current.pause();
    
    // Small delay for smooth transition
    await new Promise<void>(resolve => {
      transitionTimeoutRef.current = window.setTimeout(async () => {
        // Swap audio elements
        const temp = audioRef.current!;
        audioRef.current = nextAudioRef.current!;
        nextAudioRef.current = temp;
        
        await safePlay(audioRef.current);
        setState(prev => ({
          ...prev,
          currentTrackIndex: index,
          isTransitioning: false
        }));
        resolve();
      }, TRANSITION_DURATION);
    });
  }, [state.isTransitioning, safePlay]);

  const handleNext = useCallback(() => {
    if (state.isLoading || state.isTransitioning) return;
    const nextIndex = (state.currentTrackIndex + 1) % playlist.length;
    changeTrack(nextIndex);
  }, [state.currentTrackIndex, state.isLoading, state.isTransitioning, playlist.length, changeTrack]);

  const handlePrevious = useCallback(() => {
    if (state.isLoading || state.isTransitioning) return;
    const prevIndex = state.currentTrackIndex === 0 
      ? playlist.length - 1 
      : state.currentTrackIndex - 1;
    changeTrack(prevIndex);
  }, [state.currentTrackIndex, state.isLoading, state.isTransitioning, playlist.length, changeTrack]);

  // Preload next track whenever current track changes
  useEffect(() => {
    const nextIndex = (state.currentTrackIndex + 1) % playlist.length;
    preloadNextTrack(nextIndex);
  }, [state.currentTrackIndex, playlist.length, preloadNextTrack]);

  return {
    currentTrack,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    isTransitioning: state.isTransitioning,
    error: state.error,
    handlePlayPause,
    handleNext,
    handlePrevious
  };
};