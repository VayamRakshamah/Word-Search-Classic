import React from "react";
import { ArrowLeft, Trophy, Star, Clock, Sparkles, Flame, RefreshCw, Trash2, Zap, Award } from "lucide-react";
import { UserStats } from "../types";
import { SoundEngine } from "./SoundEngine";

interface StatsDashboardProps {
  userStats: UserStats;
  onBack: () => void;
  onResetStats: () => void;
}

export default function StatsDashboard({ userStats, onBack, onResetStats }: StatsDashboardProps) {

  // Formatting helper for seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    if (totalSeconds === 0 || totalSeconds === Infinity) return "--:--";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleReset = () => {
    SoundEngine.playClick();
    if (confirm("Reset all statistics, stars, coins, and level completions? This cannot be undone.")) {
      onResetStats();
    }
  };

  return (
    <div className="flex-1 bg-[#FDFBF7] text-[#4A443F] flex flex-col justify-between p-6">
      {/* Header */}
      <header className="flex items-center gap-4 h-16 shrink-0 mb-4">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-[#E8E2D6] hover:bg-[#8BA88E] hover:text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer text-[#4A443F]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#4A443F]">Trophy Room</h1>
          <p className="text-xs text-[#8BA88E] font-semibold uppercase tracking-widest">Achievements & Stats</p>
        </div>
      </header>

      {/* Main stats list */}
      <main className="flex-1 overflow-y-auto pr-1 space-y-5 py-2">
        {/* Streak highlight banner */}
        <div className="bg-[#D18063] rounded-3xl p-5 text-white flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
              Daily Grind
            </span>
            <h2 className="text-lg font-black tracking-tight leading-tight pt-1">
              {userStats.currentStreak} Day Word Streak
            </h2>
            <p className="text-[11px] opacity-90 leading-normal">
              Play every day to keep your brain active and earn double daily rewards!
            </p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 ml-3">
            <Flame className="w-9 h-9 text-white fill-current animate-bounce" />
          </div>
        </div>

        {/* Bento Grid stats layout */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-[#F5F2EA] p-4 rounded-3xl border-2 border-[#E8E2D6] flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-[#8BA88E] uppercase tracking-wider">Levels Done</span>
            <span className="text-2xl font-black text-[#4A443F] mt-2">{userStats.levelsCompleted}</span>
          </div>

          <div className="bg-[#F5F2EA] p-4 rounded-3xl border-2 border-[#E8E2D6] flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-[#8BA88E] uppercase tracking-wider">Stars Earned</span>
            <span className="text-2xl font-black text-amber-500 mt-2 flex items-center gap-1">
              ★ {userStats.totalStars}
            </span>
          </div>

          <div className="bg-[#F5F2EA] p-4 rounded-3xl border-2 border-[#E8E2D6] flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-[#8BA88E] uppercase tracking-wider">AI Lab Runs</span>
            <span className="text-2xl font-black text-[#8BA88E] mt-2 flex items-center gap-1">
              🧪 {userStats.customThemesCreated}
            </span>
          </div>

          <div className="bg-[#F5F2EA] p-4 rounded-3xl border-2 border-[#E8E2D6] flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-[#8BA88E] uppercase tracking-wider">Fastest Win</span>
            <span className="text-2xl font-black text-[#4A443F] mt-2 font-mono">
              {formatTime(userStats.fastestTime)}
            </span>
          </div>

        </div>

        {/* Mini Achievements or ranks */}
        <div className="bg-[#F5F2EA] rounded-3xl p-5 border-2 border-[#E8E2D6] space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-black text-[#8BA88E] mb-1">
            Unlocked Medals
          </h3>

          <div className="space-y-3">
            
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                userStats.levelsCompleted >= 1 ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-400"
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs">First Victory</h4>
                <p className="text-[10px] text-[#6E6760]">Complete any puzzle search grid.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                userStats.totalStars >= 10 ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-400"
              }`}>
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs">Superstar</h4>
                <p className="text-[10px] text-[#6E6760]">Earn 10 or more stars in campaigns.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                userStats.customThemesCreated >= 3 ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-400"
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs">AI Alchemist</h4>
                <p className="text-[10px] text-[#6E6760]">Generate 3 custom AI topics with Gemini.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Dangerous Reset Footer option */}
      <footer className="mt-4 shrink-0 border-t border-[#E8E2D6] pt-4 text-center">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
          id="btn-reset-stats"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </footer>
    </div>
  );
}
