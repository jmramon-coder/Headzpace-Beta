import React from 'react';

interface Props {
  selectionBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
}

export const SelectionBox = ({ selectionBox }: Props) => {
  const left = Math.min(selectionBox.startX, selectionBox.endX);
  const top = Math.min(selectionBox.startY, selectionBox.endY);
  const width = Math.abs(selectionBox.endX - selectionBox.startX);
  const height = Math.abs(selectionBox.endY - selectionBox.startY);

  return (
    <div
      className="fixed pointer-events-none border-2 border-indigo-500 dark:border-cyan-500 bg-indigo-500/10 dark:bg-cyan-500/10 z-50"
      style={{
        left,
        top,
        width,
        height
      }}
    />
  );
};