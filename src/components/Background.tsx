import React, { useEffect, useRef } from 'react';
import { useVideo } from '../context/VideoContext';
import { useTheme } from '../context/ThemeContext';

interface Props {
  showVideo?: boolean;
}

export const Background = ({ showVideo = false }: Props) => {
  const { isPlaying, setIsPlaying } = useVideo();
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
      
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      
      const handleEnded = () => {
        setIsPlaying(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      };
      
      videoRef.current.addEventListener('ended', handleEnded);
      return () => {
        videoRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0">
        {/* Theme-based background */}
        <div className={`absolute inset-0 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-black' 
            : 'bg-white'
        }`} />

        {/* Video overlay (only shown when showVideo=true) */}
        {showVideo && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-30 dark:opacity-50 transition-opacity duration-300"
            style={{ 
              filter: 'hue-rotate(45deg) brightness(1.4) contrast(1.2) saturate(1.4)'
            }}
          >
            <source 
              src="https://res.cloudinary.com/dpfbkeapy/video/upload/v1733930586/Headspace_llfynb.mp4"
              type="video/mp4" 
            />
          </video>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent dark:to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent dark:from-cyan-500/10" />
      </div>
    </div>
  );
};