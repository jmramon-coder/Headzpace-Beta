export const GRID_SIZE = 8;
export const WIDGET_GAP = GRID_SIZE * 2; // 16px gap between widgets

export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const findNextAvailablePosition = (widgets: Widget[]): { x: number; y: number } => {
  const PADDING = GRID_SIZE * 10; // Initial padding from top-left
  const COLUMNS = 3; // Maximum number of columns
  const DEFAULT_WIDTH = GRID_SIZE * 30;
  const DEFAULT_HEIGHT = GRID_SIZE * 20;

  if (widgets.length === 0) {
    return { x: PADDING, y: PADDING };
  }

  // Create a grid representation
  const positions = widgets.map(widget => ({
    x1: widget.position?.x ?? PADDING,
    y1: widget.position?.y ?? PADDING,
    x2: (widget.position?.x ?? PADDING) + (widget.size?.width ?? DEFAULT_WIDTH) + WIDGET_GAP,
    y2: (widget.position?.y ?? PADDING) + (widget.size?.height ?? DEFAULT_HEIGHT) + WIDGET_GAP
  }));

  // Try positions in a grid pattern
  for (let row = 0; row < Math.ceil(widgets.length / COLUMNS) + 1; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const x = PADDING + (col * (DEFAULT_WIDTH + WIDGET_GAP));
      const y = PADDING + (row * (DEFAULT_HEIGHT + WIDGET_GAP));

      // Check if this position overlaps with any existing widget
      const hasOverlap = positions.some(pos => 
        x < pos.x2 &&
        x + DEFAULT_WIDTH + WIDGET_GAP > pos.x1 &&
        y < pos.y2 &&
        y + DEFAULT_HEIGHT + WIDGET_GAP > pos.y1
      );

      if (!hasOverlap) {
        return { x, y };
      }
    }
  }

  // Fallback: place below the lowest widget
  const lowestWidget = widgets.reduce((lowest, current) => 
    current.position.y > lowest.position.y ? current : lowest
  );

  return {
    x: PADDING,
    y: lowestWidget.position.y + lowestWidget.size.height + WIDGET_GAP
  };
};

export const calculateGridPosition = (x: number, y: number) => ({
  x: snapToGrid(Math.max(0, x)),
  y: snapToGrid(Math.max(0, y)),
});

export const getDefaultWidgetSize = (type: Widget['type']) => ({
  width: type === 'chat' ? GRID_SIZE * 40 : GRID_SIZE * 30,
  height: type === 'chat' ? GRID_SIZE * 30 : GRID_SIZE * 20
});

export const getDefaultWidgetPosition = () => ({
  x: GRID_SIZE * 2,
  y: GRID_SIZE * 2
});
export const calculateResizePosition = (
  width: number,
  height: number,
  minWidth = GRID_SIZE * 15,
  minHeight = GRID_SIZE * 10
) => ({
  width: snapToGrid(Math.max(width, minWidth)),
  height: snapToGrid(Math.max(height, minHeight))
});