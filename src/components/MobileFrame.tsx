import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] flex items-center justify-center p-0 md:p-8 font-sans selection:bg-[#00FF66] selection:text-black">
      {/* Outer Glow wrapper on desktop */}
      <div className="w-full max-w-[390px] h-screen md:h-[820px] bg-[#0A0A0A] text-[#e2e2e2] flex flex-col relative overflow-hidden md:rounded-[48px] md:border-[10px] md:border-[#1A1A1A] md:shadow-[0_0_85px_rgba(0,255,102,0.18)] select-none">
        
        {/* Status bar mock on desktop/mobile */}
        <div className="h-11 px-6 bg-black flex justify-between items-center text-xs font-semibold select-none z-50 shrink-0">
          <span className="text-white">20:53</span>
          {/* Speaker capsule/dynamic island mock */}
          <div className="hidden md:block w-28 h-5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 border border-white/5 top-2.5"></div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded leading-none text-[#00FF66]">LTE</span>
            <span className="w-3.5 h-2 border border-white/20 rounded-sm p-[1px] flex items-center">
              <span className="w-full h-full bg-[#00FF66] rounded-2xs"></span>
            </span>
          </div>
        </div>

        {/* Dynamic content rendering with safearea scroll */}
        <div className="flex-1 flex flex-col overflow-hidden relative pb-[120px]">
          {children}
        </div>
      </div>
    </div>
  );
};
