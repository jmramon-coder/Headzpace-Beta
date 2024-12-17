import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TYPOGRAPHY_THEMES } from '../config/typography';
import { SIZE_PRESETS } from '../config/sizing';
import { useUser } from './UserContext';
import type { TypographyTheme, SizePreset } from '../types';

interface DesignContextType {
  typography: TypographyTheme;
  size: SizePreset;
  setTypography: (id: string) => void;
  setSize: (id: string) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const isGuest = user?.email === 'guest';

  // Initialize typography state
  const [typography, setTypographyState] = useState<TypographyTheme>(() => {
    if (isGuest) return TYPOGRAPHY_THEMES[0];

    const saved = localStorage.getItem('typography_theme');
    const themeId = saved || 'modern';
    return TYPOGRAPHY_THEMES.find(t => t.id === themeId) || TYPOGRAPHY_THEMES[0];
  });

  // Initialize size state
  const [size, setSizeState] = useState<SizePreset>(() => {
    if (isGuest) return SIZE_PRESETS[1];

    const saved = localStorage.getItem('size_preset');
    const sizeId = saved || 'balanced';
    return SIZE_PRESETS.find(s => s.id === sizeId) || SIZE_PRESETS[1];
  });

  // Update typography
  const setTypography = useCallback((id: string) => {
    if (isGuest) return;
    const theme = TYPOGRAPHY_THEMES.find(t => t.id === id);
    if (theme) {
      setTypographyState(theme);
      localStorage.setItem('typography_theme', id);
    }
  }, [isGuest]);

  // Update size
  const setSize = useCallback((id: string) => {
    if (isGuest) return;
    const preset = SIZE_PRESETS.find(s => s.id === id);
    if (preset) {
      setSizeState(preset);
      localStorage.setItem('size_preset', id);
    }
  }, [isGuest]);

  // Reset to defaults when switching to guest mode
  useEffect(() => {
    if (isGuest) {
      setTypographyState(TYPOGRAPHY_THEMES[0]);
      setSizeState(SIZE_PRESETS[1]);
    }
  }, [isGuest]);

  // Apply typography settings
  useEffect(() => {
    document.documentElement.style.setProperty('--font-heading', typography.heading);
    document.documentElement.style.setProperty('--font-body', typography.body);
    document.documentElement.style.setProperty('--typography-scale', typography.scale.toString());
  }, [typography]);

  // Apply size settings
  useEffect(() => {
    document.documentElement.style.setProperty('--size-scale', size.scale.toString());
  }, [size]);

  return (
    <DesignContext.Provider value={{
      typography,
      size,
      setTypography,
      setSize,
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}