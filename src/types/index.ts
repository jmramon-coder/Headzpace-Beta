export interface Widget {
  id: string;
  type: 'notes' | 'clock' | 'tasks' | 'media' | 'chat' | 'radio';
  position: { x: number; y: number };
  size: { width: number; height: number };
  defaultImages?: string[];
}

export interface WidgetPreset {
  id: string;
  name: string;
  description: string;
  widgets: Array<Omit<Widget, 'id'>>;
}

export interface CustomLayout {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  widgets: Widget[];
  preferences?: {
    theme: 'light' | 'dark';
    autoSave: boolean;
  };
  workspaceVersion?: string;
}

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

export interface CustomLayout {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

export interface ChatTab {
  id: string;
  name: string;
  messages: ChatMessage[];
  apiKeyId?: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  createdAt: number;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  url: string;
}

export interface WorkspaceData {
  version: string;
  widgets: Widget[];
  preferences?: {
    theme: 'light' | 'dark';
    autoSave: boolean;
  };
  mediaFiles?: { [key: string]: string };
}
export interface SpotifyConfig {
  clientId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface MusicSource {
  type: 'local' | 'spotify';
  track: {
    id: string;
    title: string;
    artist: string;
    url?: string;
    albumArt?: string;
  };
}