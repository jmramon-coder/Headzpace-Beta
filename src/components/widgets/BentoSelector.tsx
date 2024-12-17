import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Plus, Save, Layout } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { DeleteLayoutModal } from './DeleteLayoutModal';
import { LayoutItem } from './bento/LayoutItem';
import { WidgetItem } from './bento/WidgetItem';
import { WIDGETS } from './bento/config';
import type { CustomLayout, Widget } from '../../types';

const WIDGET_HEIGHT = 'h-24';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: Widget['type']) => void;
  onSaveLayout?: () => void;
  isAuthenticated?: boolean;
}


export const BentoSelector = ({ isOpen, onClose, onSelect, onSaveLayout, isAuthenticated }: Props) => {
  // All hooks must be called before any conditional returns
  const { customLayouts, applyLayout, currentLayout, deleteLayout } = useLayout();
  const [layoutToDelete, setLayoutToDelete] = useState<CustomLayout | null>(null);
  useScrollLock(isOpen);

  useEffect(() => {
    // Add modal-open class to body
    document.body.classList.add('modal-open');
    document.body.classList.add('widget-open');

    return () => {
      document.body.classList.remove('modal-open');
      document.body.classList.remove('widget-open');
    };
  }, []);

  const handleDeleteLayout = useCallback((layout: CustomLayout, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayoutToDelete(layout);
  }, [setLayoutToDelete]);

  // Memoize components to prevent unnecessary re-renders
  const layoutItems = useMemo(() => customLayouts.map((layout) => (
    <LayoutItem
      key={layout.id}
      layout={layout}
      currentLayout={currentLayout}
      onDelete={handleDeleteLayout}
      onSelect={applyLayout}
    />
  )), [customLayouts, currentLayout, handleDeleteLayout, applyLayout]);
  
  const widgetItems = useMemo(() => WIDGETS.map((widget) => (
    <WidgetItem
      key={widget.type}
      widget={widget}
      onSelect={onSelect}
    />
  )), [onSelect]);
  // Early return after all hooks are called
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden modal-open">
      <div className="bg-white/90 dark:bg-black/80 w-full sm:max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[85vh] rounded-none sm:rounded-2xl shadow-2xl backdrop-blur-md border-0 sm:border border-slate-200 dark:border-slate-700/50 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-black/95 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Add Widget</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Layouts Section */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isAuthenticated && (
            <div className="px-4 sm:px-6 pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-white">Saved Layouts</h3>
              </div>
              <button
                onClick={onSaveLayout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-lg hover:brightness-110 transition-all font-medium"
              >
                <Save className="w-4 h-4" />
                Save Current
              </button>
            </div>
            
            {customLayouts.length > 0 ? (
              <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                {layoutItems}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 p-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
                No saved layouts yet
              </div>
            )}
            </div>
          )}
        
          <div className="px-4 sm:px-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-indigo-500 dark:text-cyan-500" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">Individual Widgets</h3>
          </div>

          {/* Grid */}
          <div className="space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 sm:space-y-0">
            {widgetItems}
          </div>
        </div>
        </div>
      </div>
      {layoutToDelete && (
        <DeleteLayoutModal
          isOpen={true}
          onClose={() => setLayoutToDelete(null)}
          onConfirm={() => deleteLayout(layoutToDelete.id)}
          layoutName={layoutToDelete.name}
        />
      )}
    </div>
  );
};