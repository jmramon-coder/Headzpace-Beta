import { useState, useRef, useCallback, useEffect } from 'react';
import type { Widget } from '../types';
import { calculateGridPosition } from '../utils/grid';
import { useViewport } from '../context/ViewportContext';

interface DragState {
  isDragging: boolean;
  initialMousePos: { x: number; y: number } | null;
  initialWidgetPositions: Record<string, { x: number; y: number }>;
}

const initialDragState: DragState = {
  isDragging: false,
  initialMousePos: null,
  initialWidgetPositions: {}
};

export const useGroupDragging = (widgets: Widget[], selectedWidgets: string[], setWidgets: (widgets: Widget[]) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const { isPanMode } = useViewport();
  const dragState = useRef<DragState>(initialDragState);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current.isDragging || !dragState.current.initialMousePos) return;
    e.preventDefault(); // Prevent text selection while dragging

    const deltaX = e.clientX - dragState.current.initialMousePos.x;
    const deltaY = e.clientY - dragState.current.initialMousePos.y;

    setWidgets(prevWidgets => prevWidgets.map(widget => {
      if (selectedWidgets.includes(widget.id)) {
        const initialPos = dragState.current.initialWidgetPositions[widget.id];
        return {
          ...widget,
          position: calculateGridPosition(
            initialPos.x + deltaX,
            initialPos.y + deltaY
          )
        };
      }
      return widget;
    }));
  }, [selectedWidgets, setWidgets]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.current.isDragging) return;
    
    dragState.current = initialDragState;
    setIsDragging(false);
    document.body.style.cursor = '';
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startDragging = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isPanMode) return;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'grabbing';

    // Store initial positions
    const positions: Record<string, { x: number; y: number }> = {};
    selectedWidgets.forEach(id => {
      const widget = widgets.find(w => w.id === id);
      if (widget) {
        positions[id] = { ...widget.position };
      }
    });

    dragState.current = {
      isDragging: true,
      initialMousePos: { x: e.clientX, y: e.clientY },
      initialWidgetPositions: positions,
    };

    setIsDragging(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isPanMode, widgets, selectedWidgets, handleMouseMove, handleMouseUp]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    startDragging,
  };
};