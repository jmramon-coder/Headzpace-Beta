import React from 'react';
import { ZoomIn, ZoomOut, Hand, Move, Maximize2, Minimize2 } from 'lucide-react';
import { useViewport } from '../../context/ViewportContext';
import { usePanControls } from '../../hooks/usePanControls';
import { useViewportReset } from '../../hooks/useViewportReset';
import { useFullscreen } from '../../hooks/useFullscreen';

export const NavigationBar = () => {
  const { viewport, setScale, isPanMode } = useViewport();
  const { togglePan } = usePanControls();
  const { resetViewport } = useViewportReset();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleZoomIn = () => {
    setScale(viewport.scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(viewport.scale - 0.1);
  };

  return (
    <div className="navigation-bar fixed bottom-[18px] sm:bottom-6 left-1/2 -translate-x-1/2">
      <div className="bg-white/80 dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-cyan-500/20 rounded-full px-3 py-2 shadow-lg flex items-center gap-2">
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200 dark:border-cyan-500/20">
          <button
            onClick={handleZoomOut}
            disabled={viewport.scale <= 0.5}
            className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-12 text-center">
            {Math.round(viewport.scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={viewport.scale >= 2}
            className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={togglePan}
          className={`p-1.5 rounded-full transition-colors ${
            isPanMode
              ? 'bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400'
              : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
          title="Pan tool"
        >
          <Hand className="w-4 h-4" />
        </button>
        
        <button
          onClick={resetViewport}
          className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Reset view"
        >
          <Move className="w-4 h-4" />
        </button>
        
        <div className="border-l border-slate-200 dark:border-cyan-500/20 pl-2 ml-2">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};