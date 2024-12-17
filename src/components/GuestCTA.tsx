import React from 'react';
import { useVideo } from '../context/VideoContext';
import { StickyEnterButton } from './ui/StickyEnterButton';

interface Props {
  onGuestEntry: () => void;
}

export const GuestCTA = ({ onGuestEntry }: Props) => {
  const { isPlaying } = useVideo();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          loop // Added loop attribute
          className="w-full h-full object-cover opacity-30 dark:opacity-50"
          style={{ 
            filter: 'hue-rotate(45deg) brightness(1.4) contrast(1.2) saturate(1.4)'
          }}
        >
          <source 
            src="https://res.cloudinary.com/dpfbkeapy/video/upload/v1733951173/202412111000_1_b5oqpr.mp4"
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent dark:to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent dark:from-cyan-500/10" />
      </div>

      {/* Content */}
      <div className="relative text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 bg-clip-text text-transparent">
          Enter as a Guest,<br />Stay for the Experience
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Try our workspace without commitment. When you're ready, create an account to save your perfect setup.
        </p>
      </div>
      <StickyEnterButton onClick={onGuestEntry} />
    </div>
  );
};