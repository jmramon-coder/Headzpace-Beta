import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <VideoContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}