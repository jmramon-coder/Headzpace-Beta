import { useState, useRef, useCallback, useEffect } from 'react';
import type { Track } from '../components/widgets/Music/types';

const TRANSITION_DELAY = 150;

interface AudioState {
  isPlaying: boolean;
  currentTrackIndex: number;
  isTransitioning: boolean;
}

interface AudioLoadState {
  isLoading: boolean;
  error: string | null;
}

export const useAudioController = (playlist: Track[]) => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTrackIndex: 0,
    isTransitioning: false
  });
  
  const [loadState, setLoadState] = useState<AudioLoadState>({
    isLoading: true,
    error: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const transitionTimeoutRef = useRef<number>();

  const currentTrack = playlist[state.currentTrackIndex];

  const cleanup = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  const safePlay = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      setLoadState(prev => ({ ...prev, isLoading: true }));
      
      // Create a promise that resolves when the audio can play
      const canPlayPromise = new Promise<void>((resolve, reject) => {
        if (!audioRef.current) return reject();
        
        const handleCanPlay = () => {
          audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
          audioRef.current?.removeEventListener('error', handleError);
          resolve();
        };
        
        const handleError = (e: Event) => {
          audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
          audioRef.current?.removeEventListener('error', handleError);
          reject(e);
        };
        
        if (audioRef.current.readyState >= 3) {
          resolve();
        } else {
          audioRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true });
          audioRef.current.addEventListener('error', handleError, { once: true });
        }
      });
      
      await canPlayPromise;
      await audioRef.current.play();
      
      setState(prev => ({ ...prev, isPlaying: true }));
      setLoadState({ isLoading: false, error: null });
    } catch (error) {
      console.error('Playback failed:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
      setLoadState({ isLoading: false, error: 'Playback failed' });
    }
  }, []);

  const preloadNextTrack = useCallback((index: number) => {
    if (!nextAudioRef.current) {
      nextAudioRef.current = new Audio();
    }
    nextAudioRef.current.src = playlist[index].url;
    nextAudioRef.current.load();
  }, [playlist]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || state.isTransitioning) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      safePlay();
    }
  }, [state.isPlaying, state.isTransitioning, safePlay]);

  const changeTrack = useCallback(async (index: number) => {
    if (!audioRef.current || state.isTransitioning) return;
    
    cleanup();
    setState(prev => ({ ...prev, isTransitioning: true }));
    
    // Pause current track
    audioRef.current.pause();
    setLoadState({ isLoading: true, error: null });

    // Use timeout to create smooth transition
    await new Promise<void>(resolve => {
      transitionTimeoutRef.current = window.setTimeout(async () => {
        if (!audioRef.current) return;
        
        // If we preloaded the next track, swap the audio elements
        if (nextAudioRef.current && nextAudioRef.current.src === playlist[index].url) {
          const temp = audioRef.current;
          audioRef.current = nextAudioRef.current;
          nextAudioRef.current = temp;
        } else {
          audioRef.current.src = playlist[index].url;
        }

        await safePlay();
        setState(prev => ({
          ...prev,
          currentTrackIndex: index,
          isTransitioning: false
        }));
        resolve();
      }, TRANSITION_DELAY);
    });
  }, [state.isTransitioning, playlist, cleanup, safePlay]);

  const handleNext = useCallback(() => {
    if (state.isTransitioning) return;
    const nextIndex = (state.currentTrackIndex + 1) % playlist.length;
    changeTrack(nextIndex);
  }, [state.currentTrackIndex, state.isTransitioning, playlist.length, changeTrack]);

  const handlePrevious = useCallback(() => {
    if (state.isTransitioning) return;
    const prevIndex = state.currentTrackIndex === 0 
      ? playlist.length - 1 
      : state.currentTrackIndex - 1;
    changeTrack(prevIndex);
  }, [state.currentTrackIndex, state.isTransitioning, playlist.length, changeTrack]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let mounted = true;

    const handleEnded = () => {
      if (!mounted) return;
      handleNext();
    };

    const handleError = (e: Event) => {
      if (!mounted) return;
      console.error('Audio error:', e);
      setLoadState({
        isLoading: false,
        error: 'Failed to load audio'
      });
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      mounted = false;
      cleanup();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [cleanup, handleNext]);

  // Preload next track
  useEffect(() => {
    const nextIndex = (state.currentTrackIndex + 1) % playlist.length;
    preloadNextTrack(nextIndex);
  }, [state.currentTrackIndex, playlist, preloadNextTrack]);

  return {
    audioRef,
    currentTrack,
    isPlaying: state.isPlaying,
    isTransitioning: state.isTransitioning,
    isLoading: loadState.isLoading,
    error: loadState.error,
    handlePlayPause,
    handleNext,
    handlePrevious
  };
};