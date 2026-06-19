import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { SongRow } from './SongRow';
import { FolderHeart, PlayCircle, Plus, Music, Trash2, Edit3, Heart } from 'lucide-react';
import { Track } from '../types';

interface LibraryTabProps {
  onOpenMenu: (track: Track) => void;
  onOpenPlaylists: (track: Track | null) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ onOpenMenu, onOpenPlaylists }) => {
  const { 
    favorites, 
    tracks, 
    playlists, 
    activeTab, 
    setActiveTab, 
    playTrack,
    deletePlaylist
  } = useAudio();

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  // Get matching Track objects for favorite IDs
  const favoriteTracks = tracks.filter(track => favorites.includes(track.id));

  const handlePlayAllFavorites = () => {
    if (favoriteTracks.length > 0) {
      playTrack(favoriteTracks[0], favoriteTracks);
    }
  };

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);
  const activePlaylistTracks = activePlaylist
    ? tracks.filter(t => activePlaylist.songIds.includes(t.id))
    : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none text-white px-6">
      
      {/* Pillar switcher for Tab Section */}
      <div className="flex gap-3 mb-6 shrink-0">
        <button
          onClick={() => {
            setActiveTab('favorites');
            setActivePlaylistId(null);
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all uppercase ${
            activeTab === 'favorites' 
              ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]' 
              : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-white'
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => {
            setActiveTab('playlists');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all uppercase ${
            activeTab === 'playlists' && !activePlaylistId
              ? 'bg-[#00FF66] text-black shadow-[0_0_12px_rgba(0,255,102,0.3)]' 
              : activeTab === 'playlists' && activePlaylistId
              ? 'bg-[#1E1E1E]/50 text-white border border-[#00FF66]/20'
              : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-white'
          }`}
        >
          {activePlaylistId ? `Playlist: ${activePlaylist?.name}` : 'Playlists'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-[100px]-">
        
        {/* TAB 1: Favorites View */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00FF66]/15 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#00FF66] fill-[#00FF66]" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-white">Favorite Songs</h4>
                  <p className="text-xs text-[#A0A0A0]">{favoriteTracks.length} tracks saved</p>
                </div>
              </div>
              
              {favoriteTracks.length > 0 && (
                <button 
                  onClick={handlePlayAllFavorites}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66] text-black rounded-full font-bold text-xs"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Play All</span>
                </button>
              )}
            </div>

            {/* Horizontal Scroll section of Favorites as requested  */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#A0A0A0] uppercase tracking-wider text-left">
                Quick Favorites Card List
              </h3>
              
              {favoriteTracks.length === 0 ? (
                <div className="h-32 bg-[#121212] border border-dashed border-white/10 rounded-2xl flex flex-col justify-center items-center text-xs text-[#A0A0A0] p-4">
                  No tracks favorited yet. Tap hearts while browsing songs!
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x scroll-smooth">
                  {favoriteTracks.map((track) => (
                    <div 
                      key={track.id}
                      onClick={() => playTrack(track, favoriteTracks)}
                      className="w-28 shrink-0 snap-start select-none cursor-pointer group"
                    >
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/5 relative shadow-lg">
                        {track.artworkUrl ? (
                          <img 
                            src={track.artworkUrl} 
                            alt={track.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <PlayCircle className="w-6 h-6 text-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity absolute right-2.5 bottom-2.5" />
                        </div>
                      </div>
                      <p className="text-xs font-bold truncate mt-2 text-white group-hover:text-[#00FF66] transition-colors text-left pl-1">
                        {track.title}
                      </p>
                      <p className="text-[10px] text-[#A0A0A0] truncate pl-1 text-left">
                        {track.artist}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Structured Track Row representation inside Favorites */}
            <div className="space-y-2 mt-4">
              <h3 className="font-bold text-sm text-[#A0A0A0] uppercase tracking-wider text-left pl-1">
                All Favorites
              </h3>
              {favoriteTracks.map((track, i) => (
                <SongRow
                  key={track.id}
                  track={track}
                  index={i}
                  tracksList={favoriteTracks}
                  onOpenMenu={onOpenMenu}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Playlists View */}
        {activeTab === 'playlists' && (
          <div className="space-y-4">
            
            {/* Displaying inside standard list if not selecting a playlist */}
            {!activePlaylistId ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-sm text-[#A0A0A0] uppercase tracking-wider text-left">
                    Your Playlists
                  </h3>
                  <button 
                    onClick={() => onOpenPlaylists(null)}
                    className="flex items-center gap-1 text-xs font-black text-[#00FF66]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                  </button>
                </div>

                {playlists.length === 0 ? (
                  <div className="py-12 bg-[#121212] border border-dashed border-white/10 rounded-3xl flex flex-col justify-center items-center text-xs text-[#A0A0A0] p-4 text-center">
                    <Music className="w-10 h-10 text-white/15 mb-3 animate-pulse" />
                    <p className="font-bold">No Playlists Found</p>
                    <p className="mt-1 text-white/50">Create playlists to group offline songs by vibe!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {playlists.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => setActivePlaylistId(p.id)}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/20 flex items-center justify-center text-[#00FF66]">
                            <FolderHeart className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white group-hover:text-[#00FF66] transition-colors">{p.name}</h4>
                            <p className="text-xs text-[#A0A0A0] mt-1">{p.songIds.length} tracks</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => deletePlaylist(p.id)}
                            className="p-2 text-[#A0A0A0] hover:text-[#ff4141] rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Selecting Single Playlist Details View
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <div className="text-left">
                    <button 
                      onClick={() => setActivePlaylistId(null)}
                      className="text-xs text-[#A0A0A0] hover:text-white mb-1 block"
                    >
                      ← Back to Playlists
                    </button>
                    <h3 className="font-black text-xl text-white">{activePlaylist?.name}</h3>
                    <p className="text-xs text-[#A0A0A0] mt-1">{activePlaylistTracks.length} Songs</p>
                  </div>

                  {activePlaylistTracks.length > 0 && (
                    <button 
                      onClick={() => playTrack(activePlaylistTracks[0], activePlaylistTracks)}
                      className="px-4 py-2 bg-[#00FF66] text-black rounded-full font-black text-xs flex items-center gap-1"
                    >
                      <PlayCircle className="w-4 h-4 fill-black" />
                      <span>Play</span>
                    </button>
                  )}
                </div>

                {activePlaylistTracks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#A0A0A0]">
                    No songs in this playlist yet. Add tracks via their three-dot context menus!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activePlaylistTracks.map((track, i) => (
                      <SongRow
                        key={track.id}
                        track={track}
                        index={i}
                        tracksList={activePlaylistTracks}
                        onOpenMenu={onOpenMenu}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
