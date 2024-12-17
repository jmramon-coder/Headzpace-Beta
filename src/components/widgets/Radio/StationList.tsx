import React from 'react';
import { Radio } from 'lucide-react';
import type { RadioStation } from '../../../types';

interface Props {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  onSelect: (station: RadioStation) => void;
}

export const StationList = ({ stations, currentStation, onSelect }: Props) => {
  return (
    <div className="space-y-1">
      {stations.map((station) => (
        <button
          key={station.id}
          onClick={() => onSelect(station)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            currentStation?.id === station.id
              ? 'bg-indigo-50 dark:bg-cyan-500/10'
              : 'hover:bg-indigo-50 dark:hover:bg-cyan-500/10'
          }`}
        >
          <Radio className={`w-4 h-4 ${
            currentStation?.id === station.id
              ? 'text-indigo-500 dark:text-cyan-500'
              : 'text-slate-400 dark:text-slate-500'
          }`} />
          <div className="flex-1 text-left">
            <div className={`text-sm font-medium ${
              currentStation?.id === station.id
                ? 'text-indigo-600 dark:text-cyan-300'
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {station.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {station.genre}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};