import { useCallback } from 'react';
import { useViewport } from '../context/ViewportContext';

export const useViewportReset = () => {
  const { setScale, setPosition } = useViewport();

  const resetViewport = useCallback(() => {
    // Reset scale to 100%
    setScale(1);
    
    // Reset position to center (0, 0)
    setPosition({ x: 0, y: 0 });
  }, [setScale, setPosition]);

  return { resetViewport };
};