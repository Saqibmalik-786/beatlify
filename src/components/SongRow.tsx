import React from 'react';
import { Track } from '../types';
import { useAudio } from '../context/AudioContext';
import { MoreVertical, Heart, Music, Play } from 'lucide-react';

interface SongRowProps {
  track: Track;
  onOpenMenu: (track: Track) => void;
  index: number;
  tracksList: Track[];
}

export const SongRow: React.FC<SongRowProps> = ({ track, onOpenMenu, index, tracksList }) => {
  const { playTrack, activeTrack, isPlaying, toggleFavorite } = useAudio();
  const isActive = activeTrack?.id === track.id;

  const handleRowPress = () => {
    playTrack(track, tracksList);
  };

  return (
    <div 
      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
        isActive ? 'bg-[#00FF66]/10 border border-[#00FF66]/20' : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={handleRowPress}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        
        {/* Track Artwork / Sequence Indicator */}
        <div className="relative w-12 h-12 rounded-xl bg-[#1A1A1A] overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
          {track.artworkUrl ? (
            <img 
              src={track.artworkUrl} 
              alt={track.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Music className="w-5 h-5 text-[#A0A0A0]" />
          )}

          {isActive && isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
              <span className="w-1 h-3.5 bg-[#00FF66] rounded-full animate-pulse"></span>
              <span className="w-1 h-5 bg-[#00FF66] rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-2.5 bg-[#00FF66] rounded-full animate-pulse delay-150"></span>
            </div>
          )}
        </div>

        {/* Track Title / Artist */}
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-sm font-bold truncate leading-tight transition-colors ${isActive ? 'text-[#00FF66]' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="text-xs text-[#A0A0A0] truncate mt-1">
            {track.artist} {track.album ? `• ${track.album}` : ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => toggleFavorite(track.id)}
          className="p-1 hover:scale-105 transition-transform"
        >
          <Heart 
            className={`w-4 h-4 ${track.isFavorite ? 'text-[#00FF66] fill-[#00FF66]' : 'text-[#A0A0A0] hover:text-white'}`} 
          />
        </button>
        <button 
          onClick={() => onOpenMenu(track)}
          className="p-1.5 hover:bg-white/5 rounded-full text-[#A0A0A0] hover:text-white transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
