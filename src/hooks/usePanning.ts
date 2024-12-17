import { useEffect, useCallback } from 'react';
import { useViewport } from '../context/ViewportContext';

export const usePanning = () => {
  const { viewport, setPosition, isPanning } = useViewport();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;

    setPosition({
      x: viewport.position.x + e.movementX,
      y: viewport.position.y + e.movementY
    });
  }, [isPanning, viewport.position, setPosition]);

  useEffect(() => {
    if (isPanning) {
      document.body.style.cursor = 'grabbing';
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPanning, handleMouseMove]);
};