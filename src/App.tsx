import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import AndroidFrame from "./components/AndroidFrame";
import HomeDashboard from "./components/HomeDashboard";
import GameBoard from "./components/GameBoard";
import LevelComplete from "./components/LevelComplete";
import AIThemeCreator from "./components/AIThemeCreator";
import StatsDashboard from "./components/StatsDashboard";
import HelpDialog from "./components/HelpDialog";
import { GameLevel, UserStats, LevelProgress } from "./types";
import { SoundEngine } from "./components/SoundEngine";
import { getGameLevel } from "./utils/levels";

const STORAGE_KEYS = {
  STATS: "android_wordsearch_stats",
  PROGRESS: "android_wordsearch_progress",
};

const INITIAL_STATS: UserStats = {
  gamesPlayed: 0,
  levelsCompleted: 0,
  customThemesCreated: 0,
  totalStars: 0,
  coins: 60, // Friendly start balance to try AI themes or hints right away!
  fastestTime: 9999, // default placeholder
  currentStreak: 1,
  lastPlayedDate: new Date().toISOString().split("T")[0],
};

export default function App() {
  const [screen, setScreen] = useState<"HOME" | "GAME" | "COMPLETE" | "AI_CREATOR" | "STATS" | "HELP">("HOME");
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [levelProgress, setLevelProgress] = useState<LevelProgress[]>([]);
  const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);

  // Completed Level state for the victory screen
  const [lastCompletedInfo, setLastCompletedInfo] = useState<{
    levelName: string;
    isCustomAI: boolean;
    timeSpent: number;
    stars: number;
    coinsEarned: number;
  } | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        // Clean infinite / invalid values
        if (parsed.fastestTime === null || parsed.fastestTime === 0) {
          parsed.fastestTime = 9999;
        }
        setUserStats(parsed);
      }

      const storedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (storedProgress) {
        setLevelProgress(JSON.parse(storedProgress));
      }

      // Handle daily streak update
      updateDailyStreak();
    } catch (e) {
      console.error("Failed loading local storage", e);
    }
  }, []);

  const updateDailyStreak = () => {
    try {
      const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!storedStats) return;

      const parsed: UserStats = JSON.parse(storedStats);
      const todayStr = new Date().toISOString().split("T")[0];
      const lastDateStr = parsed.lastPlayedDate;

      if (lastDateStr !== todayStr) {
        const lastDate = new Date(lastDateStr);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = parsed.currentStreak;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // streak broken
        }

        const updated = {
          ...parsed,
          currentStreak: newStreak,
          lastPlayedDate: todayStr,
        };
        setUserStats(updated);
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Persist Stats & Progress helper
  const saveStats = (newStats: UserStats) => {
    setUserStats(newStats);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
  };

  const saveProgress = (newProgress: LevelProgress[]) => {
    setLevelProgress(newProgress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
  };

  // Select Level to Start
  const handleSelectLevel = (level: GameLevel) => {
    setActiveLevel(level);
    setScreen("GAME");
  };

  // Handle Game Over / Cleared Board
  const handleLevelCleared = (timeSpent: number, stars: number, coinsEarned: number) => {
    if (!activeLevel) return;

    // Update level progress list
    const existingIndex = levelProgress.findIndex((p) => p.levelId === activeLevel.id);
    let updatedProgress = [...levelProgress];

    if (existingIndex > -1) {
      // Keep best score
      const prev = updatedProgress[existingIndex];
      updatedProgress[existingIndex] = {
        levelId: activeLevel.id,
        completed: true,
        stars: Math.max(prev.stars, stars),
        bestTime: Math.min(prev.bestTime || 9999, timeSpent),
      };
    } else {
      updatedProgress.push({
        levelId: activeLevel.id,
        completed: true,
        stars,
        bestTime: timeSpent,
      });
    }
    saveProgress(updatedProgress);

    // Update stats
    const totalStarsCount = updatedProgress.reduce((sum, item) => sum + item.stars, 0);
    const completedCount = updatedProgress.filter((item) => item.completed).length;

    const newStats: UserStats = {
      ...userStats,
      gamesPlayed: userStats.gamesPlayed + 1,
      levelsCompleted: completedCount,
      totalStars: totalStarsCount,
      coins: userStats.coins + coinsEarned,
      fastestTime: Math.min(userStats.fastestTime, timeSpent),
    };
    saveStats(newStats);

    // Save level info for summary
    setLastCompletedInfo({
      levelName: activeLevel.categoryName,
      isCustomAI: !!activeLevel.isCustomAI,
      timeSpent,
      stars,
      coinsEarned,
    });

    setScreen("COMPLETE");
  };

  const handleResetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    setUserStats(INITIAL_STATS);
    setLevelProgress([]);
    setScreen("HOME");
  };

  const handleThemeGenerated = (customLevel: GameLevel) => {
    setActiveLevel(customLevel);
    setScreen("GAME");
  };

  return (
    <AndroidFrame>
      <div className="flex-1 w-full flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {screen === "HOME" && (
            <motion.div
              key="HOME"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 w-full flex flex-col overflow-hidden"
            >
              <HomeDashboard
                userStats={userStats}
                levelProgress={levelProgress}
                onSelectLevel={handleSelectLevel}
                onNavigateToAI={() => setScreen("AI_CREATOR")}
                onNavigateToStats={() => setScreen("STATS")}
                onOpenHelp={() => setScreen("HELP")}
              />
            </motion.div>
          )}

          {screen === "GAME" && activeLevel && (
            <motion.div
              key="GAME"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 w-full flex flex-col overflow-hidden"
            >
              <GameBoard
                level={activeLevel}
                userStats={userStats}
                onBack={() => setScreen("HOME")}
                onLevelCleared={handleLevelCleared}
              />
            </motion.div>
          )}

          {screen === "COMPLETE" && lastCompletedInfo && (() => {
            const isCampaign = activeLevel && !activeLevel.isCustomAI && activeLevel.id.startsWith("level_");
            const currentLevelNum = isCampaign ? parseInt(activeLevel!.id.replace("level_", ""), 10) : 0;
            const hasNextLevel = isCampaign && currentLevelNum < 120;

            const handleNextLevel = () => {
              if (hasNextLevel) {
                const nextLvl = getGameLevel(currentLevelNum + 1);
                setActiveLevel(nextLvl);
                setScreen("GAME");
              }
            };

            return (
              <motion.div
                key="COMPLETE"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex-1 w-full flex flex-col overflow-hidden"
              >
                <LevelComplete
                  levelName={lastCompletedInfo.levelName}
                  isCustomAI={lastCompletedInfo.isCustomAI}
                  timeSpent={lastCompletedInfo.timeSpent}
                  stars={lastCompletedInfo.stars}
                  coinsEarned={lastCompletedInfo.coinsEarned}
                  onHome={() => setScreen("HOME")}
                  onPlayAgain={() => {
                    if (activeLevel) {
                      setScreen("GAME");
                    } else {
                      setScreen("HOME");
                    }
                  }}
                  onNextLevel={hasNextLevel ? handleNextLevel : undefined}
                />
              </motion.div>
            );
          })()}

          {screen === "AI_CREATOR" && (
            <motion.div
              key="AI_CREATOR"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 w-full flex flex-col overflow-hidden"
            >
              <AIThemeCreator
                userStats={userStats}
                onBack={() => setScreen("HOME")}
                onThemeGenerated={handleThemeGenerated}
                onStatsUpdate={saveStats}
              />
            </motion.div>
          )}

          {screen === "STATS" && (
            <motion.div
              key="STATS"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 w-full flex flex-col overflow-hidden"
            >
              <StatsDashboard
                userStats={userStats}
                onBack={() => setScreen("HOME")}
                onResetStats={handleResetAllProgress}
              />
            </motion.div>
          )}

          {screen === "HELP" && (
            <motion.div
              key="HELP"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 w-full flex flex-col overflow-hidden"
            >
              <HelpDialog onBack={() => setScreen("HOME")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AndroidFrame>
  );
}
