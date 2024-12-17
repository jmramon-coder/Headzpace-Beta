import React from 'react';
import { ArrowDownRight } from 'lucide-react';

interface Props {
  onResizeStart: (e: React.MouseEvent) => void;
  className?: string;
  isResizing?: boolean;
}

export const ResizeHandle = ({ onResizeStart, className = '', isResizing }: Props) => {
  return (
    <button
      onMouseDown={onResizeStart}
      className={`absolute bottom-1 right-1 text-indigo-500/50 hover:text-indigo-500 dark:text-cyan-500/50 dark:hover:text-cyan-500 p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/30 transition-colors z-50 ${
        isResizing ? 'cursor-se-resize scale-90' : 'cursor-se-resize hover:scale-105'
      } ${className}`}
      aria-label="Resize widget"
    >
      <ArrowDownRight className="w-4 h-4" />
    </button>
  );
};