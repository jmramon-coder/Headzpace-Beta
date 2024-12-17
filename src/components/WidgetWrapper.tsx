import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useViewport } from '../context/ViewportContext';
import { useWidgetResize } from '../hooks/useWidgetResize';
import { X } from 'lucide-react';
import { getDefaultWidgetPosition, getDefaultWidgetSize } from '../utils/grid';
import { ResizeHandle } from './ResizeHandle';
import type { Widget } from '../types';

interface Props {
  widget: Widget;
  isSelected: boolean;
  onRemove: (id: string) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export const WidgetWrapper = ({ widget, isSelected, onRemove, onResize, children }: Props) => {
  const { isPanning } = useViewport();
  const { isResizing, handleResizeStart } = useWidgetResize(widget, onResize);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.id,
    data: widget,
    disabled: isResizing || isPanning,
  });

  const defaultPosition = getDefaultWidgetPosition();
  const defaultSize = getDefaultWidgetSize(widget.type);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    left: widget.position?.x ?? defaultPosition.x,
    top: widget.position?.y ?? defaultPosition.y,
    width: widget.size?.width ?? defaultSize.width,
    height: widget.size?.height ?? defaultSize.height,
  };

  return (
    <div
      ref={setNodeRef}
      id={widget.id}
      style={style}
      className={`widget-wrapper absolute shadow-xl rounded-lg overflow-hidden group touch-none ${
        isResizing ? 'select-none' : ''
      } ${isSelected ? [
        'ring-2 ring-indigo-500 dark:ring-cyan-500',
        'after:absolute after:inset-0 after:bg-indigo-500/5 dark:after:bg-cyan-500/5',
        'before:absolute before:inset-0 before:border-2 before:border-dashed before:border-indigo-500/30 dark:before:border-cyan-500/30'
      ].join(' ') : ''} ${
        widget.type === 'media' ? '' : 'bg-white/80 dark:bg-black/30 backdrop-blur-md border border-indigo-200 dark:border-cyan-500/20 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
      }`}
    >
      <div className="h-full relative">
        <div 
          {...attributes}
          {...listeners}
          className="absolute top-0 right-0 left-0 h-8 bg-transparent hover:bg-indigo-500/5 dark:hover:bg-cyan-500/5 cursor-grab active:cursor-grabbing z-50" 
        />
        {children}
        <button
          onClick={() => onRemove(widget.id)}
          aria-label="Close widget"
          className={`absolute top-2 right-2 z-[51] opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${
            widget.type === 'media'
              ? 'bg-black/20 text-white/80 hover:bg-black/30 hover:text-white'
              : 'bg-white/80 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:bg-black/30 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-500/10'
          }`}
        >
          <X className="w-3 h-3" />
        </button>
        <ResizeHandle 
          onResizeStart={handleResizeStart}
          isResizing={isResizing}
          className={widget.type === 'media' ? 'opacity-0 group-hover:opacity-100 transition-opacity z-[51]' : 'z-[51]'}
        />
      </div>
    </div>
  );
};