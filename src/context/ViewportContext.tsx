import React, { createContext, useContext, useState, useCallback } from 'react';

interface ViewportState {
  scale: number;
  position: { x: number; y: number };
  isPanMode: boolean;
  isGrabbing: boolean;
}

interface ViewportContextType {
  viewport: ViewportState;
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  togglePanMode: () => void;
  startGrabbing: () => void;
  stopGrabbing: () => void;
  isPanning: boolean;
  isPanMode: boolean;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const MIN_X = -1000;
const MAX_X = 1000;
const MIN_Y = -1000;
const MAX_Y = 1000;

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    position: { x: 0, y: 0 },
    isPanMode: false,
    isGrabbing: false
  });

  const setScale = useCallback((newScale: number) => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)
    }));
  }, []);

  const setPosition = useCallback(({ x, y }: { x: number; y: number }) => {
    setViewport(prev => ({
      ...prev,
      position: {
        x: Math.min(Math.max(x, MIN_X), MAX_X),
        y: Math.min(Math.max(y, MIN_Y), MAX_Y)
      }
    }));
  }, []);

  const togglePanMode = useCallback(() => {
    setViewport(prev => ({ ...prev, isPanMode: !prev.isPanMode }));
  }, []);

  const startGrabbing = useCallback(() => {
    setViewport(prev => ({ ...prev, isGrabbing: true }));
  }, []);

  const stopGrabbing = useCallback(() => {
    setViewport(prev => ({ ...prev, isGrabbing: false }));
  }, []);

  return (
    <ViewportContext.Provider value={{
      viewport,
      setScale,
      setPosition,
      togglePanMode,
      startGrabbing,
      stopGrabbing,
      isPanning: viewport.isGrabbing,
      isPanMode: viewport.isPanMode
    }}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
}