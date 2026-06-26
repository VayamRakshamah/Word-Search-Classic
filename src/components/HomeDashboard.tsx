import React, { useState, useMemo } from "react";
import { 
  Trophy, Star, Play, Sparkles, BookOpen, Clock, BarChart3,
  Flame, HelpCircle, Shield, Award, Lock, ChevronLeft, ChevronRight, CheckCircle2 
} from "lucide-react";
import { GameLevel, UserStats, LevelProgress } from "../types";
import { getGameLevel } from "../utils/levels";
import { SoundEngine } from "./SoundEngine";

interface HomeDashboardProps {
  userStats: UserStats;
  levelProgress: LevelProgress[];
  onSelectLevel: (level: GameLevel) => void;
  onNavigateToAI: () => void;
  onNavigateToStats: () => void;
  onOpenHelp: () => void;
}

const CHAPTERS = [
  { id: 1, name: "Forest Pack", range: [1, 30], difficulty: "Easy", color: "#8BA88E", bg: "from-[#8BA88E] to-[#739276]" },
  { id: 2, name: "Ocean Pack", range: [31, 60], difficulty: "Medium", color: "#54889E", bg: "from-[#54889E] to-[#3B6E84]" },
  { id: 3, name: "Cosmic Pack", range: [61, 90], difficulty: "Medium", color: "#A87FA2", bg: "from-[#A87FA2] to-[#8C6286]" },
  { id: 4, name: "Desert Pack", range: [91, 120], difficulty: "Hard", color: "#D19263", bg: "from-[#D19263] to-[#BD7947]" },
];

export default function HomeDashboard({
  userStats,
  levelProgress,
  onSelectLevel,
  onNavigateToAI,
  onNavigateToStats,
  onOpenHelp,
}: HomeDashboardProps) {

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = CHAPTERS[activeChapterIndex];

  // Map progress by levelId for fast lookup
  const progressMap = useMemo(() => {
    const map: Record<string, LevelProgress> = {};
    levelProgress.forEach((item) => {
      map[item.levelId] = item;
    });
    return map;
  }, [levelProgress]);

  // Total campaign levels completed count
  const completedCampaignCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 120; i++) {
      if (progressMap[`level_${i}`]?.completed) {
        count++;
      }
    }
    return count;
  }, [progressMap]);

  const isLevelUnlocked = (levelNum: number): boolean => {
    if (levelNum === 1) return true;
    const prevLevelId = `level_${levelNum - 1}`;
    return !!progressMap[prevLevelId]?.completed;
  };

  const handleLevelClick = (levelNum: number) => {
    if (!isLevelUnlocked(levelNum)) {
      // Gentle buzz feedback
      SoundEngine.playError();
      return;
    }
    SoundEngine.playClick();
    const levelObj = getGameLevel(levelNum);
    onSelectLevel(levelObj);
  };

  const nextChapter = () => {
    SoundEngine.playClick();
    setActiveChapterIndex((prev) => (prev + 1) % CHAPTERS.length);
  };

  const prevChapter = () => {
    SoundEngine.playClick();
    setActiveChapterIndex((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
  };

  // Generate levels list for the active chapter
  const chapterLevels = useMemo(() => {
    const [start, end] = activeChapter.range;
    const list = [];
    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }, [activeChapter]);

  return (
    <div className="flex-1 bg-[#FDFBF7] text-[#4A443F] flex flex-col justify-between p-5 select-none">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 shrink-0 mb-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#4A443F] flex items-center gap-1.5">
            Word Search
            <span className="text-[10px] bg-[#8BA88E] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Classic
            </span>
          </h1>
          <p className="text-xs text-[#8BA88E] font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#D18063] fill-current animate-pulse" />
            <span>{userStats.currentStreak} Day Streak</span>
          </p>
        </div>

        {/* Currency & Stats button */}
        <div className="flex items-center gap-2">
          <div className="bg-[#E8E2D6] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="text-sm font-bold text-[#D18063]">🪙</span>
            <span className="font-bold text-xs text-[#4A443F]">{userStats.coins}</span>
          </div>

          <button
            onClick={() => {
              SoundEngine.playClick();
              onNavigateToStats();
            }}
            className="w-9 h-9 bg-[#E8E2D6] hover:bg-[#8BA88E] hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer text-[#4A443F]"
            title="Statistics"
            id="btn-nav-stats"
          >
            <BarChart3 className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1">
        
        {/* Dynamic AI Banner */}
        <div className="bg-gradient-to-r from-[#8BA88E] to-[#78967B] rounded-3xl p-4 mb-4 text-white shadow-sm relative overflow-hidden flex flex-col justify-between shrink-0">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <Sparkles className="w-24 h-24 text-white" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-1 inline-block">
              Dynamic AI Lab
            </span>
            <h2 className="text-sm font-black tracking-tight leading-tight">
              Create Custom Word Lists
            </h2>
            <p className="text-[11px] opacity-90 leading-snug mt-0.5">
              Enter any topic and let Gemini formulate the vocabulary grid!
            </p>
          </div>
          <button
            onClick={() => {
              SoundEngine.playClick();
              onNavigateToAI();
            }}
            className="mt-3 bg-[#FDFBF7] text-[#4A443F] hover:bg-[#F5F2EA] active:scale-95 text-[11px] font-black px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 self-start shadow-sm transition-all cursor-pointer"
            id="btn-home-ai"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D18063]" />
            <span>Generate Theme</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-[#F5F2EA] border-2 border-[#E8E2D6] rounded-2xl p-3.5 mb-4 flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#4A443F]">Campaign Progression</span>
            <span className="font-black text-[#8BA88E]">{completedCampaignCount} / 120 Solved</span>
          </div>
          <div className="w-full bg-[#E8E2D6] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#8BA88E] h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCampaignCount / 120) * 100}%` }}
            />
          </div>
        </div>

        {/* Chapter Carousel Control */}
        <div className="flex justify-between items-center mb-3 bg-[#E8E2D6]/40 rounded-2xl p-2 border border-[#E8E2D6]/60 shrink-0">
          <button
            onClick={prevChapter}
            className="w-8 h-8 rounded-xl bg-[#E8E2D6] hover:bg-[#8BA88E] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8BA88E] leading-none">
              {activeChapter.name}
            </h3>
            <p className="text-[10px] text-[#6E6760] mt-0.5 font-semibold">
              Levels {activeChapter.range[0]} - {activeChapter.range[1]} • {activeChapter.difficulty}
            </p>
          </div>

          <button
            onClick={nextChapter}
            className="w-8 h-8 rounded-xl bg-[#E8E2D6] hover:bg-[#8BA88E] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-5 gap-2.5 p-1 bg-[#F5F2EA] rounded-3xl border-2 border-[#E8E2D6] flex-1 min-h-[220px]">
          {chapterLevels.map((lvl) => {
            const levelId = `level_${lvl}`;
            const progress = progressMap[levelId];
            const isCompleted = !!progress?.completed;
            const stars = progress?.stars || 0;
            const unlocked = isLevelUnlocked(lvl);

            // Is this the first incomplete level (next to play)?
            const isActive = unlocked && !isCompleted;

            return (
              <button
                key={lvl}
                onClick={() => handleLevelClick(lvl)}
                disabled={!unlocked}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer select-none
                  ${!unlocked 
                    ? "bg-[#E8E2D6]/40 text-gray-400 border-2 border-transparent cursor-not-allowed opacity-60" 
                    : isCompleted
                      ? "bg-gradient-to-br from-[#F6F1E5] to-[#EAE3D4] text-[#4A443F] border-2 border-[#D6CDB8] shadow-sm hover:scale-105"
                      : isActive
                        ? "bg-[#8BA88E] text-white border-2 border-[#769379] shadow-md animate-pulse scale-[1.03]"
                        : "bg-[#FDFBF7] text-[#4A443F] border-2 border-[#E8E2D6] shadow-sm hover:scale-105 hover:border-[#8BA88E]"
                  }
                `}
                id={`lvl-node-${lvl}`}
              >
                {!unlocked ? (
                  <Lock className="w-4 h-4 text-gray-400/80" />
                ) : (
                  <>
                    <span className="text-[13px] font-black leading-none">{lvl}</span>
                    {/* Stars achieved */}
                    {isCompleted && (
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3].map((num) => (
                          <Star
                            key={num}
                            className={`w-2 h-2 ${
                              num <= stars ? "text-amber-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {/* Active dynamic indicator */}
                    {isActive && (
                      <span className="absolute bottom-1 text-[7px] font-bold uppercase tracking-wider opacity-90 animate-bounce">
                        Play
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="mt-3 shrink-0 border-t border-[#E8E2D6] pt-2.5 flex items-center justify-between text-xs font-semibold text-[#8BA88E]">
        <button
          onClick={() => {
            SoundEngine.playClick();
            onOpenHelp();
          }}
          className="flex items-center gap-1 hover:text-[#4A443F] transition-colors cursor-pointer"
          id="btn-help"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to Play</span>
        </button>

        <span className="text-[#6E6760] font-mono text-[9px]">
          Ver 2.0.0 • 120 levels Mode
        </span>
      </footer>
    </div>
  );
}
