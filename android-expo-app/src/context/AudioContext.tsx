import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AndroidTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  url: string; // uri of local track file on device
  artworkUrl?: string;
  isFavorite?: boolean;
}

export interface AndroidPlaylist {
  id: string;
  name: string;
  songIds: string[];
}

interface AudioContextType {
  tracks: AndroidTrack[];
  playlists: AndroidPlaylist[];
  favorites: string[];
  activeTrack: AndroidTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isScanning: boolean;
  
  playTrack: (track: AndroidTrack, customQueue?: AndroidTrack[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  toggleFavorite: (trackId: string) => Promise<void>;
  
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  scanDeviceStorage: () => Promise<void>;
}

const AndroidAudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAndroidAudio = () => {
  const context = useContext(AndroidAudioContext);
  if (!context) throw new Error('useAndroidAudio must be used with provider');
  return context;
};

export const AndroidAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<AndroidTrack[]>([]);
  const [playlists, setPlaylists] = useState<AndroidPlaylist[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTrack, setActiveTrack] = useState<AndroidTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [isScanning, setIsScanning] = useState(false);

  const [currentQueue, setCurrentQueue] = useState<AndroidTrack[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Initialize and load saved variables
  useEffect(() => {
    loadCachedData();
    // Allow background playback configurations
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const loadCachedData = async () => {
    try {
      const storedFavs = await AsyncStorage.getItem('beatlify_favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedPlaylists = await AsyncStorage.getItem('beatlify_playlists');
      if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));

      const storedTracks = await AsyncStorage.getItem('beatlify_tracks');
      if (storedTracks) {
        setTracks(JSON.parse(storedTracks));
      } else {
        // Initial Scan on Startup
        scanDeviceStorage();
      }
    } catch (e) {
      console.error('Error reading cached structures:', e);
    }
  };

  // Safe Expo AV playback status update handler
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        handleTrackFinished();
      }
    }
  };

  const handleTrackFinished = async () => {
    if (repeatMode === 'one') {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } else {
      await playNext();
    }
  };

  const scanDeviceStorage = async () => {
    setIsScanning(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Storage permission is required to search songs.');
        setIsScanning(false);
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 1000,
      });

      const parsedTracks: AndroidTrack[] = media.assets.map((asset) => {
        // Handle missing metadata safely using filename fallback
        const filename = asset.filename;
        const cleanName = filename.replace(/\.[^/.]+$/, "");
        const parts = cleanName.split(" - ");
        const artist = parts.length > 1 ? parts[0] : 'Unknown Artist';
        const title = parts.length > 1 ? parts.slice(1).join(" - ") : cleanName;

        return {
          id: asset.id,
          title: title,
          artist: artist,
          album: 'Local Device Music',
          duration: asset.duration,
          url: asset.uri,
        };
      });

      setTracks(parsedTracks);
      await AsyncStorage.setItem('beatlify_tracks', JSON.stringify(parsedTracks));
    } catch (err) {
      console.error('Scanning failed', err);
    } finally {
      setIsScanning(false);
    }
  };

  const playTrack = async (track: AndroidTrack, customQueue?: AndroidTrack[]) => {
    try {
      // Unload active track
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const queue = customQueue && customQueue.length > 0 ? customQueue : tracks;
      setCurrentQueue(queue);
      setActiveTrack(track);

      // Create new audio sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (e) {
      console.error('Playback setup failed', e);
      Alert.alert('Playback Error', 'Unable to play this audio file.');
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      if (tracks.length > 0) {
        await playTrack(tracks[0]);
      }
      return;
    }

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const getNextIndex = (): number => {
    if (currentQueue.length === 0) return -1;
    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack?.id);

    if (isShuffle) {
      return Math.floor(Math.random() * currentQueue.length);
    }

    if (currentIndex < currentQueue.length - 1) {
      return currentIndex + 1;
    }

    return repeatMode === 'all' ? 0 : -1;
  };

  const playNext = async () => {
    const nextIdx = getNextIndex();
    if (nextIdx !== -1) {
      await playTrack(currentQueue[nextIdx], currentQueue);
    }
  };

  const playPrevious = async () => {
    if (currentQueue.length === 0) return;
    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack?.id);
    let prevIdx = currentIndex - 1;

    if (isShuffle) {
       prevIdx = Math.floor(Math.random() * currentQueue.length);
    } else if (prevIdx < 0) {
       prevIdx = repeatMode === 'all' ? currentQueue.length - 1 : 0;
    }

    await playTrack(currentQueue[prevIdx], currentQueue);
  };

  const seek = async (seconds: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seconds * 1000);
    }
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  
  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  const toggleFavorite = async (trackId: string) => {
    const isFav = favorites.includes(trackId);
    let updated;
    if (isFav) {
      updated = favorites.filter(id => id !== trackId);
    } else {
      updated = [...favorites, trackId];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('beatlify_favorites', JSON.stringify(updated));
  };

  const createPlaylist = async (name: string) => {
    const newPlaylist: AndroidPlaylist = {
      id: `p-${Date.now()}`,
      name,
      songIds: []
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    await AsyncStorage.setItem('beatlify_playlists', JSON.stringify(updated));
  };

  const deletePlaylist = async (id: string) => {
    const updated = playlists.filter(p => p.id !== id);
    setPlaylists(updated);
    await AsyncStorage.setItem('beatlify_playlists', JSON.stringify(updated));
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId && !p.songIds.includes(trackId)) {
        return { ...p, songIds: [...p.songIds, trackId] };
      }
      return p;
    });
    setPlaylists(updated);
    await AsyncStorage.setItem('beatlify_playlists', JSON.stringify(updated));
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== trackId) };
      }
      return p;
    });
    setPlaylists(updated);
    await AsyncStorage.setItem('beatlify_playlists', JSON.stringify(updated));
  };

  return (
    <AndroidAudioContext.Provider value={{
      tracks,
      playlists,
      favorites,
      activeTrack,
      isPlaying,
      currentTime,
      duration,
      isShuffle,
      repeatMode,
      isScanning,
      playTrack,
      togglePlayPause,
      playNext,
      playPrevious,
      seek,
      toggleShuffle,
      toggleRepeatMode,
      toggleFavorite,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      scanDeviceStorage
    }}>
      {children}
    </AndroidAudioContext.Provider>
  );
};
