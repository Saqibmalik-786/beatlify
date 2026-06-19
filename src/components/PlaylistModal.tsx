import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { FolderPlus, Trash2, Edit2, Play, Music } from 'lucide-react';
import { Track } from '../types';

interface PlaylistModalProps {
  track: Track | null;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ track, onClose }) => {
  const { 
    playlists, 
    createPlaylist, 
    addTrackToPlaylist,
    deletePlaylist,
    renamePlaylist,
    tracks
  } = useAudio();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName);
    setNewPlaylistName('');
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    renamePlaylist(id, editName);
    setEditingPlaylistId(null);
    setEditName('');
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end select-none">
      
      {/* Tap backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Bottom Sheet Modal Panel */}
      <div className="bg-[#121212] border-t border-white/10 rounded-t-3xl p-6 relative z-10 w-full flex flex-col max-h-[75%] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Handle bar mimic */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 shrink-0"></div>

        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">
              {track ? `Add "${track.title}" to Playlist` : 'Manage Playlists'}
            </h3>
            {track && <p className="text-xs text-[#A0A0A0]">{track.artist}</p>}
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10 text-white"
          >
            Done
          </button>
        </div>

        {/* Existing Playlists list */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {playlists.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#A0A0A0]">
              No custom playlists created yet. Create one below!
            </div>
          ) : (
            playlists.map((playlist) => {
              const isEditing = editingPlaylistId === playlist.id;
              
              return (
                <div 
                  key={playlist.id}
                  className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-[#00FF66]/20 transition-all group"
                >
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-black border border-white/15 px-3 py-1 text-sm rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(playlist.id)}
                          className="bg-[#00FF66] text-black px-3 py-1 rounded-lg text-xs font-extrabold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (track) {
                            addTrackToPlaylist(playlist.id, track.id);
                            onClose();
                          }
                        }}
                        disabled={!track}
                        className="text-left w-full block"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors">
                          {playlist.name}
                        </p>
                        <p className="text-xs text-[#A0A0A0] mt-0.5 flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          {playlist.songIds.length} tracks
                        </p>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => {
                            setEditingPlaylistId(playlist.id);
                            setEditName(playlist.name);
                          }}
                          className="p-2 text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlaylist(playlist.id)}
                          className="p-2 text-[#A0A0A0] hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create Playlist Form */}
        <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-white/5 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="New Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-[#1A1A1A] text-white border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:border-[#00FF66] text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 bg-[#00FF66] hover:bg-[#00e059] text-black rounded-xl font-bold transition-all flex items-center gap-1 select-none active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
