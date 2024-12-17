import React, { memo, useCallback } from 'react';
import type { Widget } from '../../../types';
import { WIDGETS } from './config';

interface Props {
  widget: typeof WIDGETS[number];
  onSelect: (type: Widget['type']) => void;
}

export const WidgetItem = memo(function WidgetItem({ widget, onSelect }: Props) {
  const Icon = widget.icon;
  
  const handleClick = useCallback(() => {
    onSelect(widget.type);
  }, [widget.type, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={`group relative p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 w-full text-left
        hover:border-indigo-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-lg active:scale-[0.98]
        ${widget.className || ''}`}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-indigo-600/[0.03] dark:from-cyan-500/[0.02] dark:to-cyan-400/[0.02] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start gap-3">
        <div className="shrink-0 relative">
          {/* Icon glow effect */}
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-1.5 sm:p-2 rounded-lg bg-indigo-50/50 dark:bg-cyan-500/10">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-cyan-500 transition-transform group-hover:scale-110 duration-300" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white mb-0.5 sm:mb-1 truncate text-left">
            {widget.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 leading-relaxed text-left">
            {widget.description}
          </p>
        </div>
      </div>
    </button>
  );
});