import React, { useState } from "react";
import { Sparkles, Loader2, ArrowLeft, Send } from "lucide-react";
import { GameLevel, UserStats } from "../types";
import { SoundEngine } from "./SoundEngine";

interface AIThemeCreatorProps {
  userStats: UserStats;
  onBack: () => void;
  onThemeGenerated: (level: GameLevel) => void;
  onStatsUpdate: (stats: UserStats) => void;
}

export default function AIThemeCreator({ userStats, onBack, onThemeGenerated, onStatsUpdate }: AIThemeCreatorProps) {
  const [themeInput, setThemeInput] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeInput.trim()) return;

    if (userStats.coins < 25) {
      SoundEngine.playError();
      setError("Generating an AI category requires 25 coins. Solve preset puzzles to earn more!");
      return;
    }

    setLoading(true);
    setError(null);
    SoundEngine.playClick();

    try {
      const response = await fetch("/api/generate-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeInput.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate puzzle.");
      }

      const data = await response.json();
      if (!data.words || data.words.length < 3) {
        throw new Error("Gemini generated too few valid words. Try a different topic!");
      }

      // Deduct coins & update stats
      const updatedStats = {
        ...userStats,
        coins: userStats.coins - 25,
        customThemesCreated: userStats.customThemesCreated + 1,
      };
      onStatsUpdate(updatedStats);

      // Create custom dynamic GameLevel object
      const customLevel: GameLevel = {
        id: `custom_${Date.now()}`,
        categoryName: data.themeName || themeInput,
        difficulty: difficulty,
        gridSize: difficulty === "Easy" ? 8 : difficulty === "Medium" ? 10 : 12,
        words: data.words,
        isCustomAI: true,
      };

      SoundEngine.playSuccess();
      onThemeGenerated(customLevel);
    } catch (err: any) {
      console.error(err);
      SoundEngine.playError();
      setError(err.message || "Something went wrong generating your puzzle. Please try again.");
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-bold tracking-tight text-[#4A443F]">AI Theme Lab</h1>
          <p className="text-xs text-[#8BA88E] font-semibold uppercase tracking-widest">Powered by Gemini AI</p>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="bg-[#F5F2EA] rounded-3xl p-6 border-4 border-[#E8E2D6] shadow-inner mb-6">
          <div className="w-14 h-14 bg-[#8BA88E]/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-7 h-7 text-[#8BA88E]" />
          </div>

          <h2 className="text-lg font-bold text-center text-[#4A443F] mb-2">Create Custom Word Search</h2>
          <p className="text-xs text-center text-[#6E6760] mb-6 leading-relaxed">
            Type any topic, hobby, movie, or idea you like! Gemini will dynamically curate 8-12 words and generate a brand-new board.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#8BA88E] mb-1.5">
                Topic or Keyword
              </label>
              <input
                type="text"
                value={themeInput}
                onChange={(e) => {
                  setThemeInput(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                placeholder="e.g. Harry Potter, retro arcade, birds of prey"
                maxLength={40}
                className="w-full px-4 py-3 bg-white border border-[#E8E2D6] rounded-2xl text-[#4A443F] placeholder-[#A59D95] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BA88E] focus:border-transparent transition-all"
              />
            </div>

            {/* Difficulty selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#8BA88E] mb-1.5">
                Choose Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                  const isActive = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        SoundEngine.playClick();
                        setDifficulty(diff);
                      }}
                      disabled={loading}
                      className={`
                        py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer
                        ${isActive
                          ? "bg-[#D18063] text-white border-[#D18063] shadow-md"
                          : "bg-white text-[#4A443F] border-[#E8E2D6] hover:bg-[#F5F2EA]"
                        }
                      `}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cost disclaimer */}
            <div className="flex items-center justify-between text-xs font-semibold px-1 pt-1 text-[#6E6760]">
              <span>Cost:</span>
              <span className="flex items-center gap-1 text-[#D18063]">
                🪙 25 Coins
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                <span className="font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !themeInput.trim()}
              className={`
                w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer
                ${loading || !themeInput.trim()
                  ? "bg-[#E8E2D6] text-[#A59D95] cursor-not-allowed"
                  : "bg-[#8BA88E] hover:bg-[#78967B] active:scale-95 text-white"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Curating Words...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Theme</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer coin info */}
      <footer className="text-center shrink-0 py-2">
        <p className="text-xs text-[#6E6760] font-semibold">
          Your Wallet: <span className="text-[#D18063] font-bold">🪙 {userStats.coins} Coins</span>
        </p>
      </footer>
    </div>
  );
}
