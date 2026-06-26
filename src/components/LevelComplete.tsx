import React from "react";
import { motion } from "motion/react";
import { Trophy, Star, ArrowLeft, RefreshCw, Home, Compass, ChevronRight } from "lucide-react";
import { GameLevel } from "../types";
import { SoundEngine } from "./SoundEngine";

interface LevelCompleteProps {
  levelName: string;
  isCustomAI: boolean;
  timeSpent: number;
  stars: number;
  coinsEarned: number;
  onHome: () => void;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
}

export default function LevelComplete({
  levelName,
  isCustomAI,
  timeSpent,
  stars,
  coinsEarned,
  onHome,
  onPlayAgain,
  onNextLevel,
}: LevelCompleteProps) {

  // Formatting helper for seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 bg-[#FDFBF7] text-[#4A443F] flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-center">
        
        {/* Animated Trophy Header */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="w-24 h-24 bg-gradient-to-br from-[#D18063] to-[#B3684B] rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        {/* Victory Headline */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black tracking-tight text-[#4A443F] mb-1"
        >
          Grid Cleared!
        </motion.h2>
        
        <p className="text-sm font-bold text-[#8BA88E] uppercase tracking-widest mb-6">
          {levelName} {isCustomAI && "🧬 AI"}
        </p>

        {/* Dynamic Stars Rating Display */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((num) => {
            const delay = 0.3 + num * 0.15;
            const isGold = num <= stars;
            return (
              <motion.div
                key={num}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay }}
              >
                <Star
                  className={`w-10 h-10 ${
                    isGold ? "text-amber-400 fill-current" : "text-slate-300"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Stats card */}
        <div className="bg-[#F5F2EA] rounded-3xl p-5 border-4 border-[#E8E2D6] shadow-inner space-y-4 mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-[#8BA88E] uppercase tracking-wider">
            <span>Time Solved</span>
            <span className="text-[#4A443F] font-mono text-sm font-black">{formatTime(timeSpent)}</span>
          </div>
          
          <div className="h-px bg-[#E8E2D6]" />

          <div className="flex justify-between items-center text-xs font-bold text-[#8BA88E] uppercase tracking-wider">
            <span>Coins Earned</span>
            <span className="text-[#D18063] text-sm font-black flex items-center gap-1">
              🪙 +{coinsEarned}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onNextLevel ? (
            <>
              {/* Primary Next Level CTA */}
              <button
                onClick={() => {
                  SoundEngine.playClick();
                  onNextLevel();
                }}
                className="w-full py-4 px-6 bg-[#8BA88E] hover:bg-[#78967B] active:scale-95 text-white font-black text-sm tracking-widest uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce-subtle"
                id="btn-victory-next"
              >
                <span>Next Level</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    onPlayAgain();
                  }}
                  className="py-3 px-4 bg-[#F5F2EA] hover:bg-[#EAE3D4] text-[#4A443F] font-black text-xs tracking-wider uppercase rounded-xl border border-[#E8E2D6] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="btn-victory-replay"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>

                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    onHome();
                  }}
                  className="py-3 px-4 bg-white hover:bg-[#F5F2EA] text-[#4A443F] font-black text-xs tracking-wider uppercase rounded-xl border border-[#E8E2D6] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="btn-victory-home"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  SoundEngine.playClick();
                  onPlayAgain();
                }}
                className="w-full py-4 px-6 bg-[#8BA88E] hover:bg-[#78967B] active:scale-95 text-white font-black text-sm tracking-widest uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="btn-victory-replay"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                onClick={() => {
                  SoundEngine.playClick();
                  onHome();
                }}
                className="w-full py-4 px-6 bg-white hover:bg-[#F5F2EA] active:scale-95 border border-[#E8E2D6] text-[#4A443F] font-black text-sm tracking-widest uppercase rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="btn-victory-home"
              >
                <Home className="w-4 h-4" />
                <span>Back to Levels</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
