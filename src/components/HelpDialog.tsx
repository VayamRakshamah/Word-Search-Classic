import React from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Award, Sparkles, HelpCircle } from "lucide-react";
import { SoundEngine } from "./SoundEngine";

interface HelpDialogProps {
  onBack: () => void;
}

export default function HelpDialog({ onBack }: HelpDialogProps) {
  return (
    <div className="flex-1 bg-[#FDFBF7] text-[#4A443F] flex flex-col justify-between p-6">
      {/* Header */}
      <header className="flex items-center gap-4 h-16 shrink-0 mb-4">
        <button
          onClick={() => {
            SoundEngine.playClick();
            onBack();
          }}
          className="w-12 h-12 bg-[#E8E2D6] hover:bg-[#8BA88E] hover:text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer text-[#4A443F]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#4A443F]">How to Play</h1>
          <p className="text-xs text-[#8BA88E] font-semibold uppercase tracking-widest">Guide & Controls</p>
        </div>
      </header>

      {/* Manual content */}
      <main className="flex-1 overflow-y-auto pr-1 space-y-5">
        <div className="bg-[#F5F2EA] rounded-3xl p-5 border-2 border-[#E8E2D6]">
          <div className="flex items-center gap-2 text-[#D18063] font-bold text-sm mb-2">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Basic Rules</span>
          </div>
          <p className="text-xs leading-relaxed text-[#6E6760]">
            Your goal is to find all the hidden words displayed in the word list tracker inside the grid.
          </p>
          <ul className="text-xs leading-relaxed text-[#6E6760] list-disc list-inside mt-2 space-y-1 pl-1">
            <li>Words can be placed horizontally, vertically, or diagonally.</li>
            <li>Words can run forwards or backwards depending on the difficulty selected.</li>
            <li>Press, hold, and swipe across the letter cells to select. Release to lock your choice!</li>
          </ul>
        </div>

        <div className="bg-[#F5F2EA] rounded-3xl p-5 border-2 border-[#E8E2D6]">
          <div className="flex items-center gap-2 text-[#8BA88E] font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Gemini AI Lab</span>
          </div>
          <p className="text-xs leading-relaxed text-[#6E6760]">
            Use your earned coins to craft your own topics! Enter anything you'd like (e.g., "Classic Retro Games") and Gemini will dynamically assemble the word pool and generate the board.
          </p>
        </div>

        <div className="bg-[#F5F2EA] rounded-3xl p-5 border-2 border-[#E8E2D6]">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
            <Award className="w-4 h-4 shrink-0" />
            <span>Coin Rewards</span>
          </div>
          <ul className="text-xs leading-relaxed text-[#6E6760] space-y-1 pl-1">
            <li className="flex items-center gap-2">
              <span className="text-[#8BA88E]">✔</span>
              <span><strong>Easy Levels:</strong> Reward up to 35 coins.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8BA88E]">✔</span>
              <span><strong>Medium Levels:</strong> Reward up to 45 coins.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8BA88E]">✔</span>
              <span><strong>Hard Levels:</strong> Reward up to 55 coins.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8BA88E]">✔</span>
              <span><strong>Hint costs:</strong> 15 coins per hint.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8BA88E]">✔</span>
              <span><strong>AI Lab costs:</strong> 25 coins per custom topic generation.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Back button */}
      <footer className="mt-4 shrink-0 py-2">
        <button
          onClick={() => {
            SoundEngine.playClick();
            onBack();
          }}
          className="w-full py-4 bg-[#8BA88E] hover:bg-[#78967B] active:scale-95 text-white font-black text-xs tracking-wider uppercase rounded-2xl shadow-md cursor-pointer transition-all"
        >
          Got It!
        </button>
      </footer>
    </div>
  );
}
