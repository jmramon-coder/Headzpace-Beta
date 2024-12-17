import React from 'react';
import { calculateResizePosition } from '../utils/grid';
import type { Widget } from '../types';

interface ResizeState {
  initialSize: { width: number; height: number };
  initialMousePos: { x: number; y: number };
}

export const useWidgetResize = (
  widget: Widget,
  onResize: (id: string, size: { width: number; height: number }) => void
) => {
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeStateRef = React.useRef<ResizeState | null>(null);
  const isResizingRef = React.useRef(false);

  const handleResizeStart = React.useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    
    e.preventDefault();
    e.stopPropagation();
    
    resizeStateRef.current = {
      initialSize: { ...widget.size },
      initialMousePos: { x: e.clientX, y: e.clientY }
    };
    
    setIsResizing(true);
    isResizingRef.current = true;
    document.body.style.cursor = 'se-resize';

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStateRef.current || !isResizingRef.current) return;

      const { initialSize, initialMousePos } = resizeStateRef.current;
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;

      // Calculate new size with grid snapping
      const newSize = calculateResizePosition(
        initialSize.width + deltaX,
        initialSize.height + deltaY
      );

      onResize(widget.id, newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      isResizingRef.current = false;
      resizeStateRef.current = null;
      document.body.style.cursor = '';
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
  }, [widget.id, widget.size, onResize]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (isResizingRef.current) {
        document.body.style.cursor = '';
        isResizingRef.current = false;
        resizeStateRef.current = null;
      }
    };
  }, []);

  return {
    isResizing,
    handleResizeStart
  };
};