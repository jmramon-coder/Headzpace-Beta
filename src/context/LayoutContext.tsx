import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CustomLayout, Widget } from '../types';
import { DEFAULT_LAYOUT } from '../utils/layouts';

interface LayoutContextType {
  customLayouts: CustomLayout[];
  currentLayout: CustomLayout | null;
  defaultLayout: CustomLayout;
  saveCurrentLayout: (name: string, widgets: Widget[]) => void;
  deleteLayout: (id: string) => void;
  applyLayout: (layout: CustomLayout) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [customLayouts, setCustomLayouts] = useState<CustomLayout[]>(() => {
    try {
      const stored = localStorage.getItem('custom_layouts');
      const parsed = stored ? JSON.parse(stored) : [];
      return [DEFAULT_LAYOUT, ...parsed];
    } catch (error) {
      console.error('Failed to load layouts:', error);
      return [DEFAULT_LAYOUT];
    }
  });
  const [currentLayout, setCurrentLayout] = useState<CustomLayout | null>(null);

  useEffect(() => {
    // Don't save the default layout
    const layoutsToSave = customLayouts.filter(layout => layout.id !== 'default');
    localStorage.setItem('custom_layouts', JSON.stringify(layoutsToSave));
  }, [customLayouts]);

  const saveCurrentLayout = (name: string, widgets: Widget[]) => {
    const layout: CustomLayout = {
      id: crypto.randomUUID(),
      name,
      description: `Layout saved on ${new Date().toLocaleDateString()}`,
      widgets: widgets.map(widget => ({
        ...widget,
        position: { ...widget.position },
        size: { ...widget.size },
        defaultImages: widget.defaultImages ? [...widget.defaultImages] : undefined
      })),
      createdAt: Date.now()
    };

    setCustomLayouts(prev => {
      const withoutDefault = prev.filter(layout => layout.id !== 'default');
      return [DEFAULT_LAYOUT, ...withoutDefault, layout];
    });
  };

  const deleteLayout = (id: string) => {
    if (id === 'default') return; // Prevent deleting default layout
    setCustomLayouts(prev => prev.filter(layout => layout.id !== id));
    if (currentLayout?.id === id) {
      setCurrentLayout(DEFAULT_LAYOUT);
    }
  };

  const applyLayout = (layout: CustomLayout) => {
    // When applying a layout, generate new IDs to avoid conflicts
    const layoutWithNewIds = {
      ...layout,
      widgets: layout.widgets.map(widget => ({
        ...widget,
        id: crypto.randomUUID()
      }))
    };
    setCurrentLayout(layoutWithNewIds);
  };

  // Initialize with default layout
  useEffect(() => {
    if (!currentLayout) {
      setCurrentLayout(DEFAULT_LAYOUT);
    }
  }, [currentLayout]);

  return (
    <LayoutContext.Provider value={{
      customLayouts,
      currentLayout,
      defaultLayout: DEFAULT_LAYOUT,
      saveCurrentLayout,
      deleteLayout,
      applyLayout
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}