import type { SizePreset } from '../types';

export const SIZE_PRESETS: SizePreset[] = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'Optimized for smaller screens',
    scale: 0.85
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Default sizing for most displays',
    scale: 1
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    description: 'Larger sizing for better readability',
    scale: 1.15
  }
];