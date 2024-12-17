import JSZip from 'jszip';
import { validateWorkspaceData } from './validation';
import { WORKSPACE_FILE_NAME, MEDIA_FOLDER_NAME } from './constants';
import type { WorkspaceSchemaType } from './schema';
import { logger } from './logger';

interface ExportOptions {
  compression?: boolean;
  compressionLevel?: number;
}

export const exportWorkspace = async (
  workspace: WorkspaceSchemaType,
  options: ExportOptions = {}
): Promise<Blob> => {
  logger.group('Workspace Export');
  
  try {
    // Validate workspace data
    const validation = validateWorkspaceData(workspace);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    // Create and validate JSON
    const workspaceJson = JSON.stringify(workspace, null, 2);
    try {
      JSON.parse(workspaceJson); // Verify JSON is valid
    } catch (error) {
      throw new Error('Failed to create valid workspace JSON');
    }

    // Create ZIP file
    const zip = new JSZip();

    // Add workspace.json
    zip.file(WORKSPACE_FILE_NAME, workspaceJson);
    logger.info('Added workspace.json');

    // Process media files
    if (workspace.mediaFiles) {
      const mediaFolder = zip.folder(MEDIA_FOLDER_NAME);
      if (!mediaFolder) {
        throw new Error('Failed to create media folder');
      }

      for (const [filename, dataUrl] of Object.entries(workspace.mediaFiles)) {
        try {
          // Extract base64 data
          const base64Data = dataUrl.split(';base64,')[1];
          if (!base64Data) {
            logger.warn(`Invalid data URL format for ${filename}`);
            continue;
          }

          // Convert to binary
          const binary = atob(base64Data);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }

          mediaFolder.file(filename, array);
          logger.info(`Added media file: ${filename}`);
        } catch (error) {
          logger.error(`Failed to process media file ${filename}:`, error);
        }
      }
    }

    // Generate ZIP with options
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: options.compression ? 'DEFLATE' : 'STORE',
      compressionOptions: {
        level: options.compressionLevel ?? 6
      }
    });

    logger.info('Workspace export completed successfully');
    logger.groupEnd();

    return blob;
  } catch (error) {
    logger.error('Workspace export failed:', error);
    logger.groupEnd();
    throw error;
  }
};