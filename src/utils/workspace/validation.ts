import { z } from 'zod';
import { WorkspaceSchema } from './schema';
import { 
  MAX_FILE_SIZE, 
  SUPPORTED_MIME_TYPES,
  SUPPORTED_IMAGE_EXTENSIONS,
  SUPPORTED_VERSIONS 
} from './constants';

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const validateWorkspaceData = (data: unknown): ValidationResult => {
  try {
    const result = WorkspaceSchema.parse(data);
    
    // Check version compatibility
    if (!SUPPORTED_VERSIONS.includes(result.version)) {
      return {
        success: false,
        error: `Unsupported workspace version: ${result.version}`
      };
    }

    // Additional validation for media files
    if (result.mediaFiles) {
      for (const [filename, dataUrl] of Object.entries(result.mediaFiles)) {
        // Check filename
        if (!SUPPORTED_IMAGE_EXTENSIONS.some(ext => 
          filename.toLowerCase().endsWith(ext)
        )) {
          return {
            success: false,
            error: `Unsupported image format: ${filename}`
          };
        }

        // Check data URL format
        if (!dataUrl.startsWith('data:image/') || !dataUrl.includes(';base64,')) {
          return {
            success: false,
            error: `Invalid data URL format for file: ${filename}`
          };
        }
      }
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
};

export const validateZipFile = (file: File): ValidationResult => {
  // Check if file exists
  if (!file) {
    return {
      success: false,
      error: 'No file provided'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  if (file.size === 0) {
    return {
      success: false,
      error: 'File is empty'
    };
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith('.zip')) {
    return {
      success: false,
      error: 'Invalid file type. Please select a .zip file'
    };
  }

  // Check MIME type if available
  if (file.type && !SUPPORTED_MIME_TYPES.includes(file.type)) {
    console.warn('Unexpected MIME type:', file.type);
  }

  return { success: true };
};