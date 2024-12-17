import type JSZip from 'jszip';
import type { MediaProcessingResult } from './types';
import { logMediaProcessing } from './logger';

const isValidDataUrl = (url: string): boolean => {
  try {
    return typeof url === 'string' && 
           url.startsWith('data:') && 
           url.includes('base64,') &&
           url.split('base64,')[1].length > 0;
  } catch {
    return false;
  }
};

const getBase64FromDataUrl = (dataUrl: string): string | null => {
  try {
    const matches = dataUrl.match(/^data:([^;]+)?(?:;base64)?,(.*)$/);
    return matches ? matches[1] : null;
  } catch (error) {
    return null;
  }
};

export const saveMediaFiles = (mediaFiles: Record<string, string>, mediaFolder: JSZip) => {
  Object.entries(mediaFiles).forEach(([filename, dataUrl]) => {
    try {
      // Validate filename
      if (!filename || typeof filename !== 'string' || filename.includes('/')) {
        console.warn(`Invalid filename: "${filename}"`);
        return;
      }
      
      let result: MediaProcessingResult;

      if (!isValidDataUrl(dataUrl)) {
        result = { success: false, error: 'Invalid data URL format' };
        logMediaProcessing(filename, result);
        return;
      }

      // Extract base64 data from data URL
      const base64Data = getBase64FromDataUrl(dataUrl);
      if (!base64Data) {
        result = { success: false, error: 'Failed to extract base64 data' };
        logMediaProcessing(filename, result);
        return;
      }

      // Convert data URL to binary
      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      mediaFolder.file(filename, array);
    } catch (error) {
      const result = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      logMediaProcessing(filename, result);
    }
  });
};

export const loadMediaFiles = async (mediaFolder: JSZip): Promise<Record<string, string>> => {
  const mediaFiles: Record<string, string> = {};

  // Get list of valid media files
  const mediaPromises = Object.keys(mediaFolder.files)
    .filter(path => {
      // Filter out directories and invalid paths
      if (path.endsWith('/') || path.includes('..')) {
        return false;
      }
      // Only accept common image formats
      return /\.(jpe?g|png|gif|webp)$/i.test(path);
    })
    .map(async (filename) => {
      const file = mediaFolder.file(filename);
      if (!file) return null;

      try {
        const data = await file.async('base64');
        // Detect content type from the first few bytes
        const contentType = data.startsWith('/9j/') ? 'image/jpeg' :
                          data.startsWith('iVBOR') ? 'image/png' :
                          data.startsWith('R0lG') ? 'image/gif' :
                          'application/octet-stream';
        
        return [filename, `data:${contentType};base64,${data}`] as const;
      } catch (error) {
        console.warn(`Failed to load media file "${filename}":`, error);
        return null;
      }
    });

  const mediaEntries = await Promise.all(mediaPromises);
  mediaEntries.forEach(entry => {
    if (entry) {
      const [filename, dataUrl] = entry;
      mediaFiles[filename] = dataUrl;
    }
  });

  return mediaFiles;
};