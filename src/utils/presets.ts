import { GRID_SIZE } from './grid';
import type { WidgetPreset } from '../types';

export const WIDGET_PRESETS: WidgetPreset[] = [
  {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Minimal setup for deep work sessions',
    widgets: [
      {
        type: 'clock',
        position: { x: GRID_SIZE * 2, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 20, height: GRID_SIZE * 15 }
      },
      {
        type: 'tasks',
        position: { x: GRID_SIZE * 24, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 30, height: GRID_SIZE * 25 }
      },
      {
        type: 'radio',
        position: { x: GRID_SIZE * 2, y: GRID_SIZE * 19 },
        size: { width: GRID_SIZE * 20, height: GRID_SIZE * 25 }
      }
    ]
  },
  {
    id: 'creative',
    name: 'Creative Space',
    description: 'Perfect for brainstorming and ideation',
    widgets: [
      {
        type: 'notes',
        position: { x: GRID_SIZE * 2, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 30, height: GRID_SIZE * 25 }
      },
      {
        type: 'media',
        position: { x: GRID_SIZE * 34, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 25, height: GRID_SIZE * 20 }
      },
      {
        type: 'chat',
        position: { x: GRID_SIZE * 34, y: GRID_SIZE * 24 },
        size: { width: GRID_SIZE * 25, height: GRID_SIZE * 25 }
      }
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity Hub',
    description: 'Stay organized and efficient',
    widgets: [
      {
        type: 'tasks',
        position: { x: GRID_SIZE * 2, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 25, height: GRID_SIZE * 30 }
      },
      {
        type: 'clock',
        position: { x: GRID_SIZE * 29, y: GRID_SIZE * 2 },
        size: { width: GRID_SIZE * 20, height: GRID_SIZE * 15 }
      },
      {
        type: 'notes',
        position: { x: GRID_SIZE * 29, y: GRID_SIZE * 19 },
        size: { width: GRID_SIZE * 30, height: GRID_SIZE * 25 }
      }
    ]
  }
];