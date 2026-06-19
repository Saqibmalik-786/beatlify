import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Shield, Disc3, FolderHeart, FileAudio, Upload } from 'lucide-react';

export const ScannerModal: React.FC = () => {
  const { 
    isScanning, 
    scanProgress, 
    scannedCount, 
    startScanning, 
    showScanner, 
    setShowScanner,
    importLocalFile
  } = useAudio();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  if (!showScanner) return null;

  const handleGrantPermission = () => {
    setHasPermission(true);
    startScanning();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      await importLocalFile(file);
    }
    // Auto-close scanner on success
    setShowScanner(false);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-6 text-center select-none text-white">
      <div className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
        
        {/* Glow backdrop inside */}
        <div className="absolute top-0 w-32 h-32 bg-[#00FF66]/5 blur-3xl rounded-full"></div>

        {hasPermission === null && (
          <div className="space-y-6 w-full flex flex-col items-center z-10">
            <div className="w-16 h-16 bg-[#00FF66]/10 rounded-full flex items-center justify-center border border-[#00FF66]/20">
              <Shield className="w-8 h-8 text-[#00FF66]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-sans">Storage Permission</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Beatlify needs media storage access to scan for offline audio files stored on your Android device. Your music stays private.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <button 
                onClick={handleGrantPermission}
                className="w-full py-3.5 bg-[#00FF66] text-black font-extrabold rounded-full hover:shadow-[0_0_15px_rgba(0,255,102,0.4)] active:scale-98 transition-all"
              >
                Allow Access
              </button>
              <button 
                onClick={() => setShowScanner(false)}
                className="w-full py-3 text-sm text-[#A0A0A0] hover:text-white transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        )}

        {hasPermission === true && isScanning && (
          <div className="space-y-6 w-full flex flex-col items-center z-10 pb-4">
            <div className="relative flex items-center justify-center">
              {/* Spinning Disc */}
              <div className="w-24 h-24 rounded-full border border-dashed border-[#00FF66] animate-spin flex items-center justify-center duration-[4000ms]">
                <Disc3 className="w-12 h-12 text-[#00FF66]/40" />
              </div>
              <span className="absolute text-sm font-bold text-[#00FF66] font-mono">{scanProgress}%</span>
            </div>

            <div className="space-y-2 text-center w-full">
              <h3 className="text-lg font-bold">Scanning Local Directories...</h3>
              <p className="text-xs text-[#A0A0A0] font-mono truncate max-w-xs block mx-auto py-1 px-3 bg-white/5 rounded">
                {scanProgress < 25 && '/storage/emulated/0/Music/...'}
                {scanProgress >= 25 && scanProgress < 60 && '/storage/emulated/0/Download/...'}
                {scanProgress >= 60 && '/storage/emulated/0/WhatsApp/...'}
              </p>
              <p className="text-xs text-[#00FF66] font-semibold mt-2">
                Discovered {scannedCount} audio files
              </p>
            </div>
          </div>
        )}

        {hasPermission === true && !isScanning && (
          <div className="space-y-6 w-full flex flex-col items-center z-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <FolderHeart className="w-8 h-8 text-[#00FF66]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">Import Success</h3>
              <p className="text-xs text-[#A0A0A0]">
                Beatlify successfully scanned local directories and synchronized {scannedCount} tracks.
              </p>
            </div>

            <div className="w-full border-t border-white/5 pt-4 space-y-4">
              <div className="text-left">
                <p className="text-xs font-semibold text-white/50 mb-2">OR IMPORT REAL SONGS</p>
                <label className="flex items-center justify-center gap-2 p-3.5 bg-white/5 rounded-xl border border-dashed border-white/10 hover:border-[#00FF66]/30 cursor-pointer text-xs font-semibold transition-colors">
                  <Upload className="w-4 h-4 text-[#00FF66]" />
                  <span>Choose MP3, WAV or OGG from disk</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="audio/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                onClick={() => setShowScanner(false)}
                className="w-full py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 active:scale-98 transition-all"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
