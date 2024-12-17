import { useState, useCallback, useEffect, useRef } from 'react';
import type { ResizeDirection } from '../types';

interface ResizeHandlesState {
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void;
}

export const useResizeHandles = (
  onResizeStart: (e: React.MouseEvent, direction: ResizeDirection) => void
): ResizeHandlesState => {
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    isResizingRef.current = isResizing;
  }, [isResizing]);

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    if (e.button !== 0) return; // Only handle left click
    if (isResizingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    isResizingRef.current = true;
    document.body.style.cursor = `${direction}-resize`;
    onResizeStart(e, direction);
  }, [onResizeStart]);

  const handleMouseUp = useCallback(() => {
    if (!isResizingRef.current) return;
    
    setIsResizing(false);
    isResizingRef.current = false;
    document.body.style.cursor = '';
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (isResizing) {
      const cleanup = () => {
        if (isResizingRef.current) {
          handleMouseUp();
        }
      };
      cleanupRef.current = cleanup;

      window.addEventListener('mouseup', cleanup);
      window.addEventListener('mouseleave', cleanup);
      
      return () => {
        window.removeEventListener('mouseup', cleanup);
        window.removeEventListener('mouseleave', cleanup);
        document.body.style.cursor = '';
        cleanupRef.current = undefined;
      };
    }
  }, [isResizing, handleMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isResizingRef.current) {
        handleMouseUp();
      }
      document.body.style.cursor = '';
      cleanupRef.current = undefined;
    };
  }, [handleMouseUp]);

  return {
    isResizing,
    handleMouseDown
  };
};