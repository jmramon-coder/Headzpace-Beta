import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Widget } from '../types';
import { saveWorkspaceToZip, loadWorkspaceFromZip, WorkspaceData } from '../utils/workspace';

export const useWorkspace = (widgets: Widget[], onLoadWorkspace: (widgets: Widget[]) => void) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Track changes to widgets
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [widgets]);

  const handleSaveWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Collect media files from widgets
      const mediaFiles: { [key: string]: string } = {};
      widgets.forEach(widget => {
        if (widget.type === 'media' && widget.defaultImages) {
          widget.defaultImages.forEach((url, index) => {
            if (url.startsWith('data:')) {
              const filename = `${widget.id}_${index}.jpg`;
              mediaFiles[filename] = url;
            }
          });
        }
      });

      const workspaceData: WorkspaceData = {
        version: '1.0.0',
        widgets,
        preferences: {
          theme,
          autoSave: false
        },
        mediaFiles
      };

      const blob = await saveWorkspaceToZip(workspaceData);
      
      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setHasUnsavedChanges(false);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save workspace';
      console.error('Workspace save error:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [widgets, theme]);

  const handleLoadWorkspace = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setHasUnsavedChanges(false);

    try {
      const workspaceData = await loadWorkspaceFromZip(file);
      
      // Update widgets with loaded data
      const loadedWidgets = workspaceData.widgets.map(widget => ({
        ...widget,
        id: crypto.randomUUID(), // Generate new IDs to avoid conflicts
        position: { ...widget.position }, // Clone position to avoid reference issues
        size: { ...widget.size } // Clone size to avoid reference issues
      }));

      onLoadWorkspace(loadedWidgets);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load workspace';
      console.error('Workspace load error:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadWorkspace]);

  return {
    hasUnsavedChanges,
    isLoading,
    error,
    saveWorkspace: handleSaveWorkspace,
    loadWorkspace: handleLoadWorkspace
  };
};