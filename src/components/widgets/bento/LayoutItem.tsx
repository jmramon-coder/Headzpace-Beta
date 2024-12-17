import React, { memo, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { CustomLayout } from '../../../types';

interface Props {
  layout: CustomLayout;
  currentLayout: CustomLayout | null;
  onDelete: (layout: CustomLayout, e: React.MouseEvent) => void;
  onSelect: (layout: CustomLayout) => void;
}

export const LayoutItem = memo(function LayoutItem({ layout, currentLayout, onDelete, onSelect }: Props) {
  const handleClick = useCallback(() => {
    onSelect(layout);
  }, [layout, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(layout, e);
  }, [layout, onDelete]);

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col gap-1 p-3 bg-white/50 dark:bg-white/5 rounded-lg border transition-all text-left ${
        currentLayout?.id === layout.id
          ? 'border-indigo-500 dark:border-cyan-500'
          : 'border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
      } cursor-pointer`}
    >
      <div className="absolute top-3 left-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          currentLayout?.id === layout.id
            ? 'border-indigo-500 dark:border-cyan-500 bg-indigo-500 dark:bg-cyan-500'
            : 'border-slate-300 dark:border-slate-600'
        }`}>
          {currentLayout?.id === layout.id && (
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pl-7">
        <span className="font-medium text-slate-800 dark:text-white truncate">
          {layout.name}
        </span>
        {layout.id !== 'default' && (
          <div className="flex items-center gap-1 z-10" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleDelete}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete layout"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 pl-7">
        {layout.description}
      </p>
    </div>
  );
});