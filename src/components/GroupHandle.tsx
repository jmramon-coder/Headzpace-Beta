import React from 'react';
import { GripVertical } from 'lucide-react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  selectedCount: number;
  onDragStart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export const GroupHandle = ({ selectedCount, onDragStart, style, ...props }: Props) => {
  if (selectedCount === 0) return null;

  // Position handle at top-right corner of selection
  return (
    <div 
      className="absolute z-[55] select-none pointer-events-auto transition-transform duration-75"
      style={style}
      {...props}
    >
      <button
        onMouseDown={onDragStart}
        className={`flex items-center gap-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-indigo-500 dark:border-cyan-500 rounded-lg p-1 shadow-lg hover:scale-105 transition-all group select-none ${
          style?.cursor === 'grabbing' ? 'cursor-grabbing scale-95' : 'cursor-grab'
        }`}
      >
        <span className="min-w-[1.25rem] h-5 flex items-center justify-center bg-indigo-500/90 dark:bg-cyan-500/90 text-white text-xs font-medium rounded">
          {selectedCount}
        </span>
        <GripVertical className="w-4 h-4 text-indigo-500 dark:text-cyan-500" />
        <div className="absolute inset-0 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none" />
      </button>
    </div>
  );
};