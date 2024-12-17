import { useState, useCallback } from 'react';
import { useViewport } from '../context/ViewportContext';
import { Widget } from '../types';

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const useSelectionBox = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const { isPanMode, isPanning } = useViewport();

  const handleSelectionStart = useCallback((e: React.MouseEvent) => {
    if (isPanMode || isPanning || e.button !== 0 || e.target !== e.currentTarget) return;
    
    const { clientX, clientY } = e;
    setIsSelecting(true);
    setSelectionBox({
      startX: clientX,
      startY: clientY,
      endX: clientX,
      endY: clientY
    });
    setSelectedWidgets([]); // Clear selection when starting new selection
  }, [isPanMode, isPanning]);

  const handleSelectionMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !selectionBox) return;

    setSelectionBox(prev => ({
      ...prev!,
      endX: e.clientX,
      endY: e.clientY
    }));
  }, [isSelecting, selectionBox]);

  const handleSelectionEnd = useCallback((widgets: Widget[]) => {
    if (!selectionBox) return;

    // Calculate selection bounds
    const left = Math.min(selectionBox.startX, selectionBox.endX);
    const right = Math.max(selectionBox.startX, selectionBox.endX);
    const top = Math.min(selectionBox.startY, selectionBox.endY);
    const bottom = Math.max(selectionBox.startY, selectionBox.endY);

    // Find widgets that intersect with selection box
    const selectedIds = widgets.filter(widget => {
      const widgetElement = document.getElementById(widget.id);
      if (!widgetElement) return false;

      const rect = widgetElement.getBoundingClientRect();
      return !(rect.right < left || 
               rect.left > right || 
               rect.bottom < top || 
               rect.top > bottom);
    }).map(w => w.id);

    setSelectedWidgets(selectedIds);
    setIsSelecting(false);
    setSelectionBox(null);
  }, [selectionBox]);

  return {
    isSelecting,
    selectionBox,
    selectedWidgets,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    setSelectedWidgets
  };
};