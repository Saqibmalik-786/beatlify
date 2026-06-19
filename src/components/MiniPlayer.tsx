import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipForward, Music } from 'lucide-react';

interface MiniPlayerProps {
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
  const { activeTrack, isPlaying, togglePlayPause, playNext, currentTime, duration } = useAudio();

  if (!activeTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      onClick={onExpand}
      className="absolute bottom-[88px] left-6 right-6 z-40 bg-[#1A1A1A]/85 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col overflow-hidden cursor-pointer hover:bg-[#202020] transition-colors shadow-2xl active:scale-99"
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Thumbnail Artwork */}
          <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
            {activeTrack.artworkUrl ? (
              <img 
                src={activeTrack.artworkUrl} 
                alt={activeTrack.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Music className="w-4 h-4 text-[#A0A0A0]" />
            )}
          </div>
          
          {/* Metadata */}
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-white font-bold text-xs leading-tight truncate">{activeTrack.title}</span>
            <span className="text-[#A0A0A0] text-[10px] mt-0.5 truncate">{activeTrack.artist}</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4.5 px-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button 
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-[#00FF66]/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-[#00FF66]" fill="#00FF66" />
            ) : (
              <Play className="w-4 h-4 text-[#00FF66]" fill="#00FF66" />
            )}
          </button>
          <button 
            onClick={playNext}
            className="p-1 hover:text-white text-[#A0A0A0] active:scale-90 transition-transform"
          >
            <SkipForward className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Embedded Micro progress line */}
      <div className="w-full h-0.5 bg-white/5 relative">
        <div 
          className="h-full bg-[#00FF66] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(0,255,102,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
