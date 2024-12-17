import { useState, useRef, useEffect } from 'react';
import type { RadioStation } from '../types';

const RADIO_STATIONS: RadioStation[] = [
  {
    id: '1',
    name: 'Chillhop',
    genre: 'Lo-Fi Hip Hop',
    url: 'https://streams.ilovemusic.de/iloveradio17.mp3'
  },
  {
    id: '2',
    name: 'Smooth Jazz',
    genre: 'Jazz',
    url: 'https://streams.ilovemusic.de/iloveradio10.mp3'
  },
  {
    id: '3',
    name: 'Chill Out',
    genre: 'Ambient',
    url: 'https://streams.ilovemusic.de/iloveradio7.mp3'
  },
  {
    id: '4',
    name: 'Study Beats',
    genre: 'Focus',
    url: 'https://streams.ilovemusic.de/iloveradio21.mp3'
  },
  {
    id: '5',
    name: 'Deep House',
    genre: 'Electronic',
    url: 'https://streams.ilovemusic.de/iloveradio16.mp3'
  }
];

export const useRadioPlayer = () => {
  const [currentStation, setCurrentStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      if (isPlaying) {
        audio.play().catch(() => {
          setError('Playback failed. Please try again.');
          setIsPlaying(false);
        });
      }
    };

    const handleError = () => {
      setError('Failed to load station. Please try again.');
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playStation = async (station: RadioStation) => {
    if (!audioRef.current) return;
    setError(null);
    setIsLoading(true);

    try {
      // If same station, just toggle play/pause
      if (currentStation?.id === station.id) {
        togglePlay();
        return;
      }

      // Stop current playback
      audioRef.current.pause();
      
      // Reset audio element
      audioRef.current.src = '';
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Set new source
      audioRef.current.src = station.url;
      audioRef.current.load();
      setCurrentStation(station);
      
      // Attempt to play
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to play station:', error);
      setError('This station is currently unavailable. Please try another one.');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    setError(null);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src) {
          audioRef.current.src = currentStation.url;
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback failed:', error);
      setError('This station is currently unavailable. Please try another one.');
      setIsPlaying(false);
    }
  };

  return {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    error,
    stations: RADIO_STATIONS,
    setVolume,
    playStation,
    togglePlay
  };
};