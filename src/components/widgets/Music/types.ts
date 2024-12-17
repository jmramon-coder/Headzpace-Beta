export interface Track {
  title: string;
  artist: string;
  url: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTrackIndex: number;
}