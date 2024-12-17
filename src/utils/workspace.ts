import JSZip from 'jszip';
import type { WorkspaceData } from '../types';

const validateWorkspaceData = (data: unknown): data is WorkspaceData => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid workspace data structure');
  }

  // Check version
  if (!('version' in data) || typeof data.version !== 'string') {
    throw new Error('Missing or invalid version in workspace data');
  }

  // Check widgets array
  if (!('widgets' in data) || !Array.isArray(data.widgets)) {
    throw new Error('Missing or invalid widgets array in workspace data');
  }

  // Validate each widget
  data.widgets.forEach((widget, index) => {
    if (!widget || typeof widget !== 'object') {
      throw new Error(`Invalid widget object at index ${index}`);
    }

    if (!widget.id || typeof widget.id !== 'string') {
      throw new Error(`Missing or invalid widget ID at index ${index}`);
    }

    if (!widget.type || typeof widget.type !== 'string') {
      throw new Error(`Missing or invalid widget type at index ${index}`);
    }

    const validTypes = ['notes', 'clock', 'tasks', 'media', 'chat', 'radio'];
    if (!validTypes.includes(widget.type)) {
      throw new Error(`Invalid widget type "${widget.type}" at index ${index}`);
    }

    if (!widget.position || typeof widget.position !== 'object' ||
        typeof widget.position.x !== 'number' || 
        typeof widget.position.y !== 'number') {
      throw new Error(`Invalid widget position at index ${index}`);
    }

    if (!widget.size || typeof widget.size !== 'object' ||
        typeof widget.size.width !== 'number' || 
        typeof widget.size.height !== 'number') {
      throw new Error(`Invalid widget size at index ${index}`);
    }

    // Validate defaultImages if present
    if ('defaultImages' in widget) {
      if (!Array.isArray(widget.defaultImages)) {
        throw new Error(`Invalid defaultImages for widget at index ${index}`);
      }
      widget.defaultImages.forEach((url, urlIndex) => {
        if (typeof url !== 'string') {
          throw new Error(`Invalid image URL at index ${urlIndex} for widget ${index}`);
        }
      });
    }
  });

  return true;
};

const validateZipFile = (file: File) => {
  if (!file) {
    throw new Error('No file selected');
  }

  // Check file extension
  const fileName = file.name || '';
  if (!fileName.toLowerCase().endsWith('.zip')) {
    throw new Error('Invalid file type. Please select a .zip file.');
  }

  // Check file size (50MB limit)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 50MB limit.');
  }

  if (file.size === 0) {
    throw new Error('The uploaded file is empty.');
  }
};

export const saveWorkspaceToZip = async (data: WorkspaceData): Promise<Blob> => {
  const zip = new JSZip();

  // Add workspace.json
  zip.file('workspace.json', JSON.stringify(data, null, 2));

  // Add media files to media folder
  const mediaFolder = zip.folder('media');
  if (mediaFolder && data.mediaFiles) {
    Object.entries(data.mediaFiles).forEach(([filename, dataUrl]) => {
      // Convert data URL to binary
      const binary = atob(dataUrl.split(',')[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      mediaFolder.file(filename, array);
    });
  }

  // Generate zip file
  return await zip.generateAsync({ type: 'blob' });
};

export const loadWorkspaceFromZip = async (file: File): Promise<WorkspaceData> => {
  try {
    // Validate file first
    validateZipFile(file);

    // Read file as ArrayBuffer
    const fileData = await file.arrayBuffer();
    
    // Load ZIP file
    let zip: JSZip;
    try {
      zip = await JSZip.loadAsync(fileData);
    } catch (error) {
      console.error('ZIP load error:', error);
      throw new Error(
        'Invalid ZIP file format. Please ensure the file is a valid .zip archive.'
      );
    }

    // Log ZIP contents for debugging
    console.log('ZIP Contents:', Object.keys(zip.files));
    
    // Load workspace.json
    const workspaceFile = zip.file('workspace.json');
    if (!workspaceFile) {
      throw new Error('Missing workspace.json in ZIP file');
    }

    let parsedData: unknown;
    try {
      const workspaceContent = await workspaceFile.async('text');
      parsedData = JSON.parse(workspaceContent);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid workspace.json format');
    }

    // Validate the parsed data
    validateWorkspaceData(parsedData);
    const workspaceData = parsedData as WorkspaceData;

    // Load media files
    const mediaFiles: Record<string, string> = {};
    const mediaFolder = zip.folder('media');

    if (mediaFolder) {
      const mediaPromises = Object.keys(mediaFolder.files)
        .filter(path => !path.endsWith('/'))
        .map(async (filename) => {
          const file = mediaFolder.file(filename);
          if (!file) return null;
          try {
            const data = await file.async('base64');
            return [filename, `data:image/jpeg;base64,${data}`] as const;
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

      workspaceData.mediaFiles = mediaFiles;
    }

    return workspaceData;
  } catch (error) {
    console.error('Workspace load error:', error);
    throw error instanceof Error ? error : new Error('Failed to load workspace file.');
  }
};