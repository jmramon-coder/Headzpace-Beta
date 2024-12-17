import { useEffect, useCallback } from 'react';
import { useViewport } from '../context/ViewportContext';

export const usePanControls = () => {
  const { togglePanMode, startGrabbing, stopGrabbing, isPanMode } = useViewport();

  const togglePan = useCallback(() => {
    togglePanMode();
  }, [togglePanMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle pan mode with Escape key
      if (e.key === 'Escape' && isPanMode) {
        togglePanMode();
      }
      
      // Start panning when spacebar is pressed
      if (e.code === 'Space' && !e.repeat && !isPanMode) {
        e.preventDefault(); // Prevent page scroll
        togglePanMode();
        startGrabbing();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Stop panning when spacebar is released
      if (e.code === 'Space') {
        e.preventDefault();
        stopGrabbing();
        togglePanMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanMode, togglePanMode, startGrabbing, stopGrabbing]);

  return { togglePan };
};