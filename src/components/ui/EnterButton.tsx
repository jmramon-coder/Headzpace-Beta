import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const EnterButton = ({ onClick }: Props) => {
  return (
    <div className="relative group sm:inline-block w-full sm:w-auto">
      <button
        onClick={onClick}
        className="relative w-full sm:w-auto px-8 py-4 rounded-lg overflow-hidden transform-gpu transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group-hover:scale-[1.02] active:scale-95"
      >
        {/* Video Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-indigo-500/80 dark:from-cyan-500/80 dark:to-cyan-400/80" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-[2s] opacity-20"
          >
            <source src="https://res.cloudinary.com/dpfbkeapy/video/upload/v1733951173/202412111000_1_b5oqpr.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Default Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 transition-opacity duration-500 group-hover:opacity-0" />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <span className="font-semibold text-white text-lg tracking-wide">
            Enter Your Space
          </span>
          <ArrowRight className="w-5 h-5 text-white transform-gpu transition-all duration-500 group-hover:translate-x-1 group-hover:scale-110" />
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button Border */}
        <div className="absolute inset-0 rounded-lg border border-white/10 pointer-events-none" />
      </button>
    </div>
  );
};