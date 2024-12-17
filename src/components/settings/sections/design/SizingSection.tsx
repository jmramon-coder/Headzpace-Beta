import React from 'react';
import { Maximize } from 'lucide-react';
import { SIZE_PRESETS } from '../../../../config/sizing';
import { useDesign } from '../../../../context/DesignContext';
import { useUser } from '../../../../context/UserContext';

export const SizingSection = () => {
  const { size, setSize } = useDesign();
  const { user } = useUser();
  const isGuest = user?.email === 'guest';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-white">
        <Maximize className="w-4 h-4 text-indigo-500 dark:text-cyan-500" />
        <span>Size Presets</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SIZE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSize(preset.id)}
            disabled={isGuest}
            className={`relative p-4 rounded-lg border transition-all text-left ${
              size?.id === preset.id
                ? 'bg-indigo-50 dark:bg-cyan-500/10 border-indigo-500 dark:border-cyan-500'
                : 'bg-white dark:bg-black/30 border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-cyan-500/50'
            } ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="space-y-1">
              <h4 className="text-base font-medium text-slate-800 dark:text-white">
                {preset.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {preset.description}
              </p>
            </div>
            
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Scale: {preset.scale}x
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};