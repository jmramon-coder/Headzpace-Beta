import React from 'react';
import { Check } from 'lucide-react';

const COLORS = [
  { name: 'Pure White', value: '#ffffff' }, // Light mode default
  { name: 'Pure Black', value: '#000000' }, // Dark mode default
  { name: 'Deep Blue', value: '#1e40af' },
  { name: 'Rich Purple', value: '#5b21b6' },
  { name: 'Forest Green', value: '#064e3b' },
  { name: 'Deep Red', value: '#991b1b' },
  { name: 'Navy', value: '#172554' }
];

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export const BackgroundPicker = ({ value, onChange }: Props) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
      {COLORS.map((color) => (
        <button
          key={`${color.name}-${color.value}`}
          onClick={() => onChange(color.value)}
          className="group relative aspect-square rounded-lg overflow-hidden"
        >
          <div
            className="absolute inset-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: color.value }}
          />
          {value === color.value && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <Check className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg" />
        </button>
      ))}
    </div>
  );
};