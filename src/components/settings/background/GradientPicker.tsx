import React from 'react';
import { Check } from 'lucide-react';
import type { GradientConfig } from '../../../types/design';

const GRADIENTS: GradientConfig[] = [
  {
    name: 'Deep Ocean',
    from: '#0f172a',
    to: '#1e3a8a',
    direction: 'circle at center, #0f172a, #1e3a8a, #172554'
  },
  {
    name: 'Northern Lights',
    from: '#0f766e',
    to: '#4338ca',
    direction: 'circle at top, #0f766e, #1e40af, #4338ca'
  },
  {
    name: 'Midnight',
    from: '#020617',
    to: '#312e81',
    direction: 'circle at bottom left, #020617, #1e1b4b, #312e81'
  },
  {
    name: 'Royal',
    from: '#1e3a8a',
    to: '#5b21b6',
    direction: 'circle at center, #1e3a8a, #3730a3, #5b21b6'
  },
  {
    name: 'Deep Forest',
    from: '#064e3b',
    to: '#166534',
    direction: 'circle at bottom right, #064e3b, #14532d, #166534'
  }
];

interface Props {
  value: GradientConfig | null;
  onChange: (gradient: GradientConfig) => void;
}

export const GradientPicker = ({ value, onChange }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {GRADIENTS.map((gradient) => (
        <button
          key={gradient.name}
          onClick={() => onChange(gradient)}
          className="group relative aspect-video rounded-lg overflow-hidden"
        >
          <div
            className="absolute inset-0 transition-transform group-hover:scale-110"
            style={{
              backgroundImage: `linear-gradient(${gradient.direction}, ${gradient.from}, ${gradient.to})`
            }}
          />
          {value?.name === gradient.name && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg" />
        </button>
      ))}
    </div>
  );
};