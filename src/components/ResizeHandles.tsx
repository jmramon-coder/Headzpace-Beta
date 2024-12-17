import React from 'react';
import type { ResizeDirection } from '../types';

interface Props {
  onResizeStart: (e: React.MouseEvent, direction: ResizeDirection) => void;
  className?: string;
}

export const ResizeHandles = ({ onResizeStart, className = '' }: Props) => {
  return (
    <>
      {/* Edges */}
      <div
        className={`absolute top-0 left-2 right-2 h-2 cursor-n-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'n')}
      />
      <div 
        className={`absolute bottom-0 left-2 right-2 h-2 cursor-s-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 's')}
      />
      <div 
        className={`absolute left-0 top-2 bottom-2 w-2 cursor-w-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'w')}
      />
      <div 
        className={`absolute right-0 top-2 bottom-2 w-2 cursor-e-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'e')}
      />

      {/* Corners */}
      <div 
        className={`absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'nw')}
      />
      <div 
        className={`absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'ne')}
      />
      <div 
        className={`absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'sw')}
      />
      <div 
        className={`absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-indigo-500/20 dark:hover:bg-cyan-500/20 ${className}`}
        onMouseDown={(e) => onResizeStart(e, 'se')}
      />
    </>
  );
};