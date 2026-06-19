import React from 'react';
import { useAudio } from '../context/AudioContext';
import { ChevronDown, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Music, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExpandedPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaylists: () => void;
}

export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({ isOpen, onClose, onOpenPlaylists }) => {
  const { 
    activeTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    isShuffle, 
    repeatMode, 
    togglePlayPause, 
    playNext, 
    playPrevious, 
    seek, 
    toggleShuffle, 
    toggleRepeatMode, 
    toggleFavorite 
  } = useAudio();

  if (!activeTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="absolute inset-0 z-50 bg-[#000000] flex flex-col p-6 text-white select-none"
        >
          {/* Background glowing ambient color matching artwork */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] opacity-30 bg-gradient-to-b from-[#00FF66]/20 via-[#000000]/0 to-transparent blur-[80px] rounded-full pointer-events-none"></div>

          {/* Top navigation header of expanded player */}
          <div className="flex justify-between items-center z-10 shrink-0">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90"
            >
              <ChevronDown className="w-6 h-6 text-[#A0A0A0]" />
            </button>
            <span className="text-xs uppercase tracking-widest text-[#A0A0A0] font-semibold">
              Now Playing
            </span>
            <button 
              onClick={onOpenPlaylists}
              className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90"
            >
              <ListMusic className="w-5 h-5 text-[#A0A0A0]" />
            </button>
          </div>

          {/* Center Cover Artwork Area */}
          <div className="flex-1 flex flex-col justify-center items-center py-6 min-h-0 z-10">
            <div className="w-72 h-72 md:w-80 md:h-80 max-h-[40vh] relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden border border-white/10 shrink-0 group">
              {activeTrack.artworkUrl ? (
                <img 
                  src={activeTrack.artworkUrl} 
                  alt={activeTrack.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-[#111111] flex items-center justify-center">
                  <Music className="w-24 h-24 text-[#A0A0A0]" />
                </div>
              )}
            </div>

            {/* Title / Artist / Fav Heart */}
            <div className="w-full mt-6 flex justify-between items-center px-4 shrink-0">
              <div className="text-left flex-1 min-w-0 mr-4">
                <h2 className="text-xl font-black truncate tracking-tight text-white leading-tight">
                  {activeTrack.title}
                </h2>
                <p className="text-sm text-[#A0A0A0] truncate mt-1">
                  {activeTrack.artist}
                </p>
              </div>

              <button 
                onClick={() => toggleFavorite(activeTrack.id)}
                className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              >
                <Heart 
                  className={`w-6 h-6 ${
                    activeTrack.isFavorite ? 'text-[#00FF66] fill-[#00FF66]' : 'text-[#A0A0A0] hover:text-white'
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Player controls details */}
          <div className="mt-auto space-y-6 z-10 shrink-0">
            {/* Progress Bar Seek Area */}
            <div className="space-y-4 px-4">
              <div className="relative group">
                {/* Visual Glow progress track */}
                <input 
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSliderChange}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF66] focus:outline-none transition-all group-hover:h-1.5"
                />
              </div>

              <div className="flex justify-between text-xs text-[#A0A0A0] font-semibold font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Core Controls Controller row */}
            <div className="flex justify-between items-center px-6 py-4">
              {/* Shuffle button */}
              <button 
                onClick={toggleShuffle}
                className="p-2 transition-colors relative"
              >
                <Shuffle className={`w-5 h-5 ${isShuffle ? 'text-[#00FF66]' : 'text-[#A0A0A0]'}`} />
                {isShuffle && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00FF66] rounded-full"></span>
                )}
              </button>

              {/* Prev Button */}
              <button 
                onClick={playPrevious}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors active:scale-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              >
                <SkipBack className="w-6 h-6" fill="currentColor" />
              </button>

              {/* Big Play / Pause button */}
              <button 
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-[#00FF66] flex items-center justify-center text-black focus:outline-none transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,102,0.3)]"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 ml-1" fill="currentColor" />
                )}
              </button>

              {/* Next Button */}
              <button 
                onClick={playNext}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors active:scale-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              >
                <SkipForward className="w-6 h-6" fill="currentColor" />
              </button>

              {/* Repeat button */}
              <button 
                onClick={toggleRepeatMode}
                className="p-2 transition-colors relative"
              >
                <Repeat className={`w-5 h-5 ${repeatMode !== 'none' ? 'text-[#00FF66]' : 'text-[#A0A0A0]'}`} />
                {repeatMode !== 'none' && (
                  <span className="absolute bottom-0 text-[8px] font-bold text-[#00FF66] left-1/2 -translate-x-1/2 leading-none">
                    {repeatMode === 'one' ? '1' : 'A'}
                  </span>
                )}
              </button>
            </div>
            
            {/* Quick spacer to avoid bottom tabs area issues */}
            <div className="h-6"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
