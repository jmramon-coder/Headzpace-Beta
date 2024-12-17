import type { TypographyTheme } from '../types';

export const TYPOGRAPHY_THEMES: TypographyTheme[] = [
  {
    id: 'modern',
    name: 'Modern Sans',
    description: 'Clean and contemporary with Inter font',
    heading: 'Inter',
    body: 'Inter',
    scale: 1,
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    description: 'Sophisticated with Playfair Display headings',
    heading: 'Playfair Display',
    body: 'Lora',
    scale: 1.1,
  },
  {
    id: 'futuristic',
    name: 'Neo Future',
    description: 'Bold and forward-looking with Orbitron',
    heading: 'Orbitron',
    body: 'Orbitron',
    scale: 0.95,
  },
  {
    id: 'playful',
    name: 'Playful Mix',
    description: 'Fun and energetic with rounded fonts',
    heading: 'Quicksand',
    body: 'Varela Round',
    scale: 1.05,
  },
  {
    id: 'impact',
    name: 'Impact Style',
    description: 'Bold and attention-grabbing with Bangers',
    heading: 'Bangers',
    body: 'Bangers',
    scale: 1.2,
  }
];