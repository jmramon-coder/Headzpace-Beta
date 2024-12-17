import JSZip from 'jszip';
import { validateWorkspaceData, validateZipFile } from './validation';
import { WORKSPACE_FILE_NAME, MEDIA_FOLDER_NAME } from './constants';
import type { WorkspaceSchemaType } from './schema';
import { logger } from './logger';

export const importWorkspace = async (file: File): Promise<WorkspaceSchemaType> => {
  logger.group('Workspace Import');

  try {
    // Validate ZIP file
    const fileValidation = validateZipFile(file);
    if (!fileValidation.success) {
      throw new Error(fileValidation.error);
    }

    // Load ZIP
    let zip: JSZip;
    try {
      zip = await JSZip.loadAsync(file);
    } catch (error) {
      throw new Error('Invalid ZIP file format');
    }

    // Log ZIP contents
    logger.info('ZIP contents:', Object.keys(zip.files));

    // Load workspace.json
    const workspaceFile = zip.file(WORKSPACE_FILE_NAME);
    if (!workspaceFile) {
      throw new Error(`Missing ${WORKSPACE_FILE_NAME}`);
    }

    // Parse workspace data
    let workspaceData: unknown;
    try {
      const content = await workspaceFile.async('text');
      workspaceData = JSON.parse(content);
    } catch (error) {
      throw new Error('Invalid workspace.json format');
    }

    // Validate workspace data
    const validation = validateWorkspaceData(workspaceData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const workspace = validation.data as WorkspaceSchemaType;

    // Load media files
    const mediaFolder = zip.folder(MEDIA_FOLDER_NAME);
    if (mediaFolder) {
      const mediaFiles: Record<string, string> = {};
      
      const mediaPromises = Object.keys(mediaFolder.files)
        .filter(path => !path.endsWith('/'))
        .map(async (filename) => {
          const file = mediaFolder.file(filename);
          if (!file) return;

          try {
            const data = await file.async('base64');
            const mimeType = getMimeType(filename);
            mediaFiles[filename] = `data:${mimeType};base64,${data}`;
            logger.info(`Loaded media file: ${filename}`);
          } catch (error) {
            logger.warn(`Failed to load media file ${filename}:`, error);
          }
        });

      await Promise.all(mediaPromises);
      workspace.mediaFiles = mediaFiles;
    }

    logger.info('Workspace import completed successfully');
    logger.groupEnd();
    return workspace;
  } catch (error) {
    logger.error('Workspace import failed:', error);
    logger.groupEnd();
    throw error;
  }
};

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}