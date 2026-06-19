export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  url: string; // audio source file URL (could be local blob URL or remote high-quality url)
  artworkUrl?: string; // image source URL
  genre?: string;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
}
