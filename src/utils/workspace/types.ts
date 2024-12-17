import type { WorkspaceData } from '../../types';

export interface ZipValidationResult {
  isValid: boolean;
  hasWorkspaceJson: boolean;
  hasMediaFolder: boolean;
  totalFiles: number;
  error?: string;
}

export interface MediaProcessingResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

export interface WorkspaceValidationResult {
  isValid: boolean;
  version?: string;
  widgetCount?: number;
  error?: string;
}