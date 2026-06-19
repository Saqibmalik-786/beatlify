import React, { useState, useMemo } from 'react';
import { useAudio, AudioProvider } from './context/AudioContext';
import { MobileFrame } from './components/MobileFrame';
import { SongRow } from './components/SongRow';
import { MiniPlayer } from './components/MiniPlayer';
import { ExpandedPlayer } from './components/ExpandedPlayer';
import { ScannerModal } from './components/ScannerModal';
import { PlaylistModal } from './components/PlaylistModal';
import { LibraryTab } from './components/LibraryTab';
import { Track } from './types';
import { GENRE_DATA } from './data';
import { 
  Search, 
  Sparkle, 
  Home, 
  Compass, 
  Library, 
  Music, 
  Plus, 
  Heart, 
  Play, 
  X, 
  FolderPlus,
  Trash2,
  ListPlus
} from 'lucide-react';

function PlayerAppContent() {
  const {
    tracks,
    favorites,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addToRecentSearches,
    removeRecentSearch,
    clearRecentSearches,
    activeSection,
    setActiveSection,
    setShowScanner,
    playTrack
  } = useAudio();

  // Navigation Maximize / bottom drawer controllers
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [activeMenuTrack, setActiveMenuTrack] = useState<Track | null>(null);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  // Dynamic filter lists for fast queries
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return tracks;
    const q = searchQuery.toLowerCase().trim();
    return tracks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [tracks, searchQuery]);

  // Handler to open actions drawer for a track
  const handleOpenMenu = (track: Track) => {
    setActiveMenuTrack(track);
  };

  const handleCloseMenu = () => {
    setActiveMenuTrack(null);
  };

  const handleGenrePress = (genreName: string) => {
    // Filter matching genre songs and start playing
    const genreTracks = tracks.filter(t => t.genre === genreName);
    if (genreTracks.length > 0) {
      playTrack(genreTracks[0], genreTracks);
    } else {
      // If we don't have matching, filter by search list
      setSearchQuery(genreName);
      setActiveSection('search');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] overflow-hidden relative">
      
      {/* Absolute Modal Sheets */}
      <ScannerModal />
      
      {activeMenuTrack && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end select-none">
          <div className="absolute inset-0" onClick={handleCloseMenu}></div>
          <div className="bg-[#121212] border-t border-white/10 rounded-t-3xl p-6 relative z-10 w-full flex flex-col space-y-3.5 shadow-2xl">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 shrink-0"></div>
            
            <div className="text-left mb-2">
              <h4 className="text-base font-bold text-white">{activeMenuTrack.title}</h4>
              <p className="text-xs text-[#A0A0A0] mt-0.5">{activeMenuTrack.artist}</p>
            </div>

            <button 
              onClick={() => {
                setShowPlaylistSelector(true);
                handleCloseMenu();
              }}
              className="w-full py-3 px-4 bg-white/5 hover:bg-[#00FF66]/15 hover:text-[#00FF66] rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-colors"
            >
              <ListPlus className="w-5 h-5" />
              <span>Add to Playlist...</span>
            </button>

            <button 
              onClick={handleCloseMenu}
              className="w-full py-3.5 bg-white/5 rounded-xl text-center text-sm font-bold text-[#A0A0A0] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPlaylistSelector && (
        <PlaylistModal 
          track={activeMenuTrack} 
          onClose={() => {
            setShowPlaylistSelector(false);
            setActiveMenuTrack(null);
          }} 
        />
      )}

      {/* Expanded player modal view overlay */}
      <ExpandedPlayer 
        isOpen={isPlayerExpanded} 
        onClose={() => setIsPlayerExpanded(false)} 
        onOpenPlaylists={() => {
          setIsPlayerExpanded(false);
          setActiveSection('library');
        }}
      />

      {/* Persistent Static Top AppBar */}
      <header className="flex justify-between items-center px-6 py-4 shrink-0 z-10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          {/* Neon green official sleek theme logo */}
          <div className="w-8 h-8 bg-[#00FF66] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,255,102,0.4)]">
            <div className="w-4 h-4 bg-black rounded-sm transform rotate-45"></div>
          </div>
          <h1 className="text-xl font-extrabold text-[#00FF66] tracking-tight font-sans">
            Beatlify
          </h1>
        </div>
        <button 
          onClick={() => setActiveSection('search')}
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white border border-white/5"
        >
          <Search className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* Tab/Section content wrapper with auto-scroll preservation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* VIEW 1: HOME */}
        {activeSection === 'home' && (
          <div className="px-6 space-y-6 pb-20">
            {/* Search Launcher */}
            <div 
              onClick={() => setActiveSection('search')}
              className="relative w-full bg-[#1A1A1A] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-left text-sm text-[#A0A0A0] transition-all hover:bg-[#202020] cursor-pointer"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[#A0A0A0]" />
              </div>
              Artists, songs, or podcasts
            </div>

            {/* Simulated Android Memory Device Banner */}
            <div className="bg-gradient-to-r from-[#00FF66]/10 to-transparent p-5 rounded-3xl border border-[#00FF66]/10 relative overflow-hidden text-left shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF66]/5 blur-2xl rounded-full"></div>
              <h3 className="font-black text-sm text-white">Device Music Sync</h3>
              <p className="text-xs text-[#A0A0A0] mt-1 pr-6 leading-relaxed">
                Automatically indexes local storage audio directories (mp3, wav, ogg) into responsive libraries.
              </p>
              <button 
                onClick={() => setShowScanner(true)}
                className="mt-4 px-4 py-2 bg-[#00FF66] hover:bg-[#00e059] text-black font-extrabold text-xs rounded-full transition-all shadow-[0_0_12px_rgba(0,255,102,0.35)] active:scale-95"
              >
                Scan Offline Files
              </button>
            </div>

            {/* Bento Genre Grid: Browse All */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-white text-left tracking-tight">Browse All</h2>
              <div className="grid grid-cols-2 gap-4">
                {GENRE_DATA.map((genre) => (
                  <div 
                    key={genre.name}
                    onClick={() => handleGenrePress(genre.name)}
                    className={`relative rounded-3xl overflow-hidden cursor-pointer group hover:scale-101 border border-white/5 max-h-48 shadow-lg transition-transform ${
                      genre.isDoubleWidth ? 'col-span-2 h-36' : 'h-40'
                    }`}
                  >
                    {/* Dark gradient mapping overlays */}
                    <div 
                      className="absolute inset-0 z-10 transition-colors group-hover:bg-black/15" 
                      style={{ backgroundImage: `linear-gradient(135deg, ${genre.colorFrom}, rgba(0,0,0,0.8))` }}
                    ></div>
                    <img 
                      src={genre.artworkUrl} 
                      alt={genre.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute z-20 font-black text-white tracking-tight ${
                      genre.isDoubleWidth ? 'left-6 top-1/2 -translate-y-1/2 text-2xl' : 'left-4 bottom-4 text-base'
                    }`}>
                      {genre.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* All local tracks listed on flat table */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-black text-white tracking-tight text-left">All Songs on Device</h2>
                <span className="text-xs font-semibold text-[#A0A0A0] font-mono">{tracks.length} tracks</span>
              </div>

              <div className="space-y-2">
                {tracks.map((track, i) => (
                  <SongRow
                    key={track.id}
                    track={track}
                    index={i}
                    tracksList={tracks}
                    onOpenMenu={handleOpenMenu}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SEARCH SCREEN */}
        {activeSection === 'search' && (
          <div className="px-6 space-y-6 pb-20">
            {/* Direct Active Search Input field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[#A0A0A0]" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    addToRecentSearches(searchQuery);
                  }
                }}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-full py-3.5 pl-12 pr-10 text-white placeholder:text-[#A0A0A0] text-sm focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:border-[#00FF66]"
                placeholder="Artists, songs, or podcasts"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-[#A0A0A0] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Recent Searches Header */}
            {recentSearches.length > 0 && !searchQuery && (
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#A0A0A0] uppercase tracking-wider">
                    Recent Searches
                  </h3>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs font-bold text-[#00FF66] uppercase tracking-wider hover:opacity-80- select-none"
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {recentSearches.map((term) => (
                    <div 
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-white/5 border border-white/5 hover:border-[#00FF66]/20 hover:bg-[#00FF66]/5 rounded-full flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-white transition-all duration-200"
                    >
                      <span className="truncate max-w-[120px]">{term}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                        className="text-[#A0A0A0] hover:text-[#ff4141] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results rendering */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#A0A0A0] uppercase tracking-wider text-left pl-1">
                {searchQuery ? `Search Results (${filteredTracks.length})` : 'Popular Tracks'}
              </h3>

              {filteredTracks.length === 0 ? (
                <div className="py-12 bg-[#121212] rounded-3xl text-xs text-[#A0A0A0] text-center border border-dashed border-white/10">
                  <Music className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  No matching files found. Try scanning folders!
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map((track, i) => (
                    <SongRow
                      key={track.id}
                      track={track}
                      index={i}
                      tracksList={filteredTracks}
                      onOpenMenu={handleOpenMenu}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LIBRARY SWITCHER (FAVORITES & PLAYLISTS) */}
        {activeSection === 'library' && (
          <LibraryTab 
            onOpenMenu={handleOpenMenu}
            onOpenPlaylists={(track) => {
              setActiveMenuTrack(track);
              setShowPlaylistSelector(true);
            }}
          />
        )}

      </div>

      {/* Mini Player Fixed Bar */}
      <MiniPlayer onExpand={() => setIsPlayerExpanded(true)} />

      {/* Bottom Sticky Navigation Capsule Dock */}
      <nav className="absolute bottom-0 w-full bg-[#121212]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] flex justify-around items-center py-3 select-none z-40 shrink-0">
        <button 
          onClick={() => setActiveSection('home')}
          className={`flex flex-col items-center gap-1.5 px-6 py-2 transition-all relative ${
            activeSection === 'home' ? 'text-[#00FF66]' : 'text-[#A0A0A0] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
          {activeSection === 'home' && (
            <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-[#00FF66] rounded-full shadow-[0_0_8px_#00FF66]"></span>
          )}
        </button>

        <button 
          onClick={() => setShowScanner(true)}
          className="flex flex-col items-center justify-center bg-[#00FF66] text-black w-12 h-12 rounded-full -mt-5 shadow-[0_0_15px_rgba(0,255,102,0.45)] hover:scale-105 active:scale-95 transition-all"
        >
          <Compass className="w-6 h-6" />
        </button>

        <button 
          onClick={() => {
            setActiveSection('library');
          }}
          className={`flex flex-col items-center gap-1.5 px-6 py-2 transition-all relative ${
            activeSection === 'library' ? 'text-[#00FF66]' : 'text-[#A0A0A0] hover:text-white'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] font-bold">Library</span>
          {activeSection === 'library' && (
            <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-[#00FF66] rounded-full shadow-[0_0_8px_#00FF66]"></span>
          )}
        </button>
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MobileFrame>
        <PlayerAppContent />
      </MobileFrame>
    </AudioProvider>
  );
}
