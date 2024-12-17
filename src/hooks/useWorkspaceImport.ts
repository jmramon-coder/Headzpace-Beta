import React from 'react';
import { loadWorkspaceFromZip } from '../utils/workspace';
import type { Widget, WorkspaceData } from '../types';

interface ImportState {
  isImporting: boolean;
  error: string | null;
  progress?: number;
}

export const useWorkspaceImport = (onImport: (widgets: Widget[]) => void) => {
  const [state, setState] = React.useState<ImportState>({
    isImporting: false,
    error: null
  });

  const importWorkspace = React.useCallback(async (file: File) => {
    setState({ isImporting: true, error: null, progress: 0 });

    if (!file) {
      setState({ isImporting: false, error: 'No file selected' });
      return;
    }

    try {
      const workspaceData = await loadWorkspaceFromZip(file);
      
      if (!workspaceData?.widgets?.length) {
        throw new Error('Invalid workspace file: No widgets found');
      }

      // Process widgets
      const widgets = workspaceData.widgets.map(widget => ({
        ...widget,
        id: crypto.randomUUID(),
        position: { ...widget.position },
        size: { ...widget.size },
        defaultImages: widget.defaultImages ? [...widget.defaultImages] : undefined
      }));

      await onImport(widgets);
      setState({ isImporting: false, error: null });
    } catch (error) {
      console.error('Workspace import error:', error);
      const message = error instanceof Error ? error.message : 'Failed to import workspace';
      setState({
        isImporting: false,
        error: message
      });
      throw error; // Re-throw to allow modal to handle error
    }
  }, [onImport]);

  return {
    ...state,
    importWorkspace
  };
};