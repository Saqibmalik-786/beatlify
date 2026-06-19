import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, AudioState } from '../types';
import { INITIAL_TRACKS } from '../data';

interface AudioContextType {
  tracks: Track[];
  playlists: Playlist[];
  favorites: string[]; // Song IDs
  activeTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  searchQuery: string;
  recentSearches: string[];
  activeTab: 'favorites' | 'playlists'; // Pillar buttons in library section
  activeSection: 'home' | 'library' | 'search'; // Bottom navigation tabs
  isScanning: boolean;
  scanProgress: number;
  scannedCount: number;
  showScanner: boolean;
  
  // Setters & Audio Actions
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'favorites' | 'playlists') => void;
  setActiveSection: (section: 'home' | 'library' | 'search') => void;
  setShowScanner: (show: boolean) => void;
  
  playTrack: (track: Track, customQueue?: Track[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  toggleFavorite: (trackId: string) => void;
  
  // Playlist actions
  createPlaylist: (name: string) => void;
  renamePlaylist: (id: string, newName: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  
  // Search actions
  addToRecentSearches: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Scanning action
  startScanning: () => void;
  importLocalFile: (file: File) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Loading
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('beatlify_tracks');
    return saved ? JSON.parse(saved) : INITIAL_TRACKS;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('beatlify_playlists');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Late Night Ride', songIds: ['1', '3', '5'], createdAt: Date.now() },
      { id: 'p2', name: 'Morning Vibe', songIds: ['2', '7'], createdAt: Date.now() - 100000 }
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('beatlify_favorites');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default favorites from initial tracks
    return INITIAL_TRACKS.filter(t => t.isFavorite).map(t => t.id);
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('beatlify_recent_searches');
    return saved ? JSON.parse(saved) : ['After Hours', 'Fred again..', 'Dark Techno'];
  });

  // State
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'favorites' | 'playlists'>('favorites');
  const [activeSection, setActiveSection] = useState<'home' | 'search' | 'library'>('home');
  
  // Scanning States
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  const [showScanner, setShowScanner] = useState(false);

  // Playback Queue Refs / State
  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('beatlify_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('beatlify_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('beatlify_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('beatlify_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Handle HTML5 Audio Lifecycle
  useEffect(() => {
    // Create audio instance
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [tracks, currentQueue, isShuffle, repeatMode, activeTrack]);

  // Secondary effect to sync playing state to audio element src changes
  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;

    const isCurrentSrc = audioRef.current.src === activeTrack.url;
    if (!isCurrentSrc) {
      audioRef.current.src = activeTrack.url;
      audioRef.current.load();
    }

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('Playback interrupted or blocked by browser autoplays:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [activeTrack, isPlaying]);

  // Queue Handling & Auto-next Navigation
  const getNextTrack = (): Track | null => {
    if (currentQueue.length === 0) return null;
    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack?.id);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      return currentQueue[randomIndex];
    }

    if (currentIndex === -1) {
      return currentQueue[0];
    }

    if (currentIndex < currentQueue.length - 1) {
      return currentQueue[currentIndex + 1];
    }

    // End of queue
    if (repeatMode === 'all') {
      return currentQueue[0];
    }

    return null;
  };

  const getPreviousTrack = (): Track | null => {
    if (currentQueue.length === 0) return null;
    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack?.id);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      return currentQueue[randomIndex];
    }

    if (currentIndex === -1) {
      return currentQueue[0];
    }

    if (currentIndex > 0) {
      return currentQueue[currentIndex - 1];
    }

    // Beginning of queue
    if (repeatMode === 'all') {
      return currentQueue[currentQueue.length - 1];
    }

    return null;
  };

  const handleTrackEnd = () => {
    if (!audioRef.current) return;
    
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      const next = getNextTrack();
      if (next) {
        setActiveTrack(next);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Exposed Playback Commands
  const playTrack = (track: Track, customQueue?: Track[]) => {
    const queue = customQueue && customQueue.length > 0 ? customQueue : tracks;
    setCurrentQueue(queue);
    setActiveTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!activeTrack && tracks.length > 0) {
      // Start playing the first track
      playTrack(tracks[0], tracks);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const playNext = () => {
    const next = getNextTrack();
    if (next) {
      setActiveTrack(next);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    const prev = getPreviousTrack();
    if (prev) {
      setActiveTrack(prev);
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const index = prev.indexOf(trackId);
      let updated;
      if (index === -1) {
        updated = [...prev, trackId];
      } else {
        updated = prev.filter(id => id !== trackId);
      }
      return updated;
    });

    // Update track lists as well
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
    if (activeTrack && activeTrack.id === trackId) {
      setActiveTrack(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  // Playlists Operations
  const createPlaylist = (name: string) => {
    if (!name.trim()) return;
    const newPlaylist: Playlist = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      songIds: [],
      createdAt: Date.now()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const renamePlaylist = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name: newName.trim() } : p));
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.songIds.includes(trackId)) return p; // Already exists
        return { ...p, songIds: [...p.songIds, trackId] };
      }
      return p;
    }));
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== trackId) };
      }
      return p;
    }));
  };

  // Recent searches actions
  const addToRecentSearches = (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    setRecentSearches(prev => {
      const base = prev.filter(q => q.toLowerCase() !== cleaned.toLowerCase());
      return [cleaned, ...base].slice(0, 10); // Keep max 10
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches(prev => prev.filter(q => q !== query));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Physical local scanning simulator (Incredible visual + practical UX)
  const startScanning = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScannedCount(0);
    
    // Simulate real local folders scanning with intervals
    const paths = [
      '/storage/emulated/0/Music/Fred again.. - Rumble.mp3',
      '/storage/emulated/0/Download/After_Hours_The_Weeknd.ogg',
      '/storage/emulated/0/WhatsApp/Media/Audio/AUD-202604-WA001.mp3',
      '/storage/emulated/0/Music/Lofi/Chilled_Minds.mp3',
      '/storage/emulated/0/Music/Jazz/Miles_Ahead.wav',
      '/storage/emulated/0/Music/Rock/A_Day_In_The_Life.mp3',
      '/storage/emulated/0/Music/Podcasts/Huberman_Lab_Focus.mp3'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < paths.length) {
        setScanProgress(Math.floor(((currentStep + 1) / paths.length) * 100));
        setScannedCount(prev => prev + 1);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Add new scanned tracks
        const mockScannedTracks: Track[] = [
          {
            id: 'sc-1',
            title: 'Rumble (Android Scan)',
            artist: 'Fred again.. & Flowdan',
            album: 'USB Tracks',
            duration: 146,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
            genre: 'Electronic'
          },
          {
            id: 'sc-2',
            title: 'Chilled Minds (Android Scan)',
            artist: 'Lofi Horizons',
            album: 'Downloaded Beats',
            duration: 254,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
            artworkUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=300&auto=format&fit=crop',
            genre: 'Chill'
          }
        ];

        setTracks(prev => {
          // Prevent duplicates
          const filterExisting = prev.filter(t => !t.id.startsWith('sc-'));
          return [...filterExisting, ...mockScannedTracks];
        });

        setIsScanning(false);
      }
    }, 400);
  };

  // Real browser file importer: parses actual MP3/WAV uploads so user can play their own files!
  const importLocalFile = async (file: File) => {
    // Generate object URL for the local file
    const fileUrl = URL.createObjectURL(file);
    
    // Get basic name without extension
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const parts = baseName.split(" - ");
    const artist = parts.length > 1 ? parts[0] : "Local Source";
    const title = parts.length > 1 ? parts.slice(1).join(" - ") : baseName;

    const newTrack: Track = {
      id: `local-${Date.now()}`,
      title: title,
      artist: artist,
      album: 'Imported Audio',
      duration: 180, // Fallback duration, HTML5 audio loads this dynamically
      url: fileUrl,
      artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop', // waveform neon
      genre: 'Downloaded'
    };

    setTracks(prev => [newTrack, ...prev]);
    // Automatically play the newly imported local file!
    playTrack(newTrack, [newTrack, ...tracks]);
  };

  return (
    <AudioContext.Provider value={{
      tracks,
      playlists,
      favorites,
      activeTrack,
      isPlaying,
      currentTime,
      duration,
      isShuffle,
      repeatMode,
      searchQuery,
      recentSearches,
      activeTab,
      activeSection,
      isScanning,
      scanProgress,
      scannedCount,
      showScanner,
      
      setSearchQuery,
      setActiveTab,
      setActiveSection,
      setShowScanner,
      
      playTrack,
      togglePlayPause,
      playNext,
      playPrevious,
      seek,
      toggleShuffle,
      toggleRepeatMode,
      toggleFavorite,
      
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      
      addToRecentSearches,
      removeRecentSearch,
      clearRecentSearches,
      
      startScanning,
      importLocalFile
    }}>
      {children}
    </AudioContext.Provider>
  );
};
