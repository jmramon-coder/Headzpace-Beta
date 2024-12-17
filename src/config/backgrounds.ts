import type { ImageConfig } from '../types/design';

const BACKGROUND_SETS = [
  [
    {
      type: 'curated' as const,
      id: 'mountains',
      url: 'https://images.unsplash.com/photo-1491904768633-2b7e3e7fede5?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    },
    {
      type: 'curated' as const,
      id: 'forest',
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    },
    {
      type: 'curated' as const,
      id: 'ocean',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    }
  ],
  [
    {
      type: 'curated' as const,
      id: 'desert',
      url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    },
    {
      type: 'curated' as const,
      id: 'stars',
      url: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    },
    {
      type: 'curated' as const,
      id: 'abstract',
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2000&q=80',
      blur: 0,
      opacity: 0.8
    }
  ]
];

let currentSetIndex = 0;

export const CURATED_BACKGROUNDS: ImageConfig[] = BACKGROUND_SETS[0];

export const getNextBackgroundSet = (): ImageConfig[] => {
  currentSetIndex = (currentSetIndex + 1) % BACKGROUND_SETS.length;
  return BACKGROUND_SETS[currentSetIndex];
};