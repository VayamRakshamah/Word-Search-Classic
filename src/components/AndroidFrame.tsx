import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

interface AndroidFrameProps {
  children: React.ReactNode;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Outer Phone Frame - Only displays as phone on medium screens and up */}
      <div className="w-full h-screen md:h-[840px] md:w-[412px] md:rounded-[40px] md:border-[12px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col overflow-hidden relative transition-all duration-300">
        
        {/* Notch - camera bubble */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-850 rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 mr-2" />
          <div className="w-16 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Status Bar */}
        <div className="w-full h-8 bg-slate-900 text-slate-100 px-6 flex items-center justify-between text-xs font-semibold z-40 select-none">
          <div>{time}</div>
          
          {/* Right Icons */}
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-emerald-400" />
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-300 font-mono">100%</span>
              <Battery className="w-4 h-4 text-emerald-400 rotate-90 origin-center" />
            </div>
          </div>
        </div>

        {/* Content Area - Holds the actual Word Search app */}
        <div className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>

        {/* Bottom Navigation Gesture Bar (Android Native-style pill) */}
        <div className="w-full h-5 bg-slate-950 flex items-center justify-center pb-1 z-40 select-none">
          <div className="w-28 h-1 bg-slate-700 rounded-full hover:bg-slate-500 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
