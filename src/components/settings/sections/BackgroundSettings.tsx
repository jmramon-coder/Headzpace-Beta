import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useDesign } from '../../../context/DesignContext';
import { ImagePicker } from '../background/ImagePicker';
import { CURATED_BACKGROUNDS, getNextBackgroundSet } from '../../../config/backgrounds';

export const BackgroundSettings = () => {
  const { background, setBackground } = useDesign();
  const [currentBackgrounds, setCurrentBackgrounds] = useState(CURATED_BACKGROUNDS);

  const handleRefresh = () => {
    const nextSet = getNextBackgroundSet();
    setCurrentBackgrounds(nextSet);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-300 rounded-full hover:bg-indigo-100 dark:hover:bg-cyan-500/20 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Featured Backgrounds</span>
        </button>
      </div>

      <ImagePicker
        value={background.type === 'image' ? background.image : null}
        curatedImages={currentBackgrounds}
        onChange={(image) => setBackground({ type: 'image', image })}
      />
    </div>
  );
};