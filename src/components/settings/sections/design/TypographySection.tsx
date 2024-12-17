import React from 'react';
import { Type } from 'lucide-react';
import { TYPOGRAPHY_THEMES } from '../../../../config/typography';
import { useDesign } from '../../../../context/DesignContext';
import { useUser } from '../../../../context/UserContext';

export const TypographySection = () => {
  const { typography, setTypography } = useDesign();
  const { user } = useUser();
  const isGuest = user?.email === 'guest';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-white">
        <Type className="w-4 h-4 text-indigo-500 dark:text-cyan-500" />
        <span>Typography</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TYPOGRAPHY_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTypography(theme.id)}
            disabled={isGuest}
            className={`relative flex flex-col gap-1 p-4 rounded-lg border transition-all text-left ${
              typography?.id === theme.id
                ? 'bg-indigo-50 dark:bg-cyan-500/10 border-indigo-500 dark:border-cyan-500'
                : 'bg-white dark:bg-black/30 border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
            } ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="space-y-1">
              <h4 className="text-base font-medium text-slate-800 dark:text-white" style={{ fontFamily: theme.heading }}>
                {theme.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400" style={{ fontFamily: theme.body }}>
                {theme.description}
              </p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="font-medium">H:</span>
                  <span style={{ fontFamily: theme.heading }}>{theme.heading}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">B:</span>
                  <span style={{ fontFamily: theme.body }}>{theme.body}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};