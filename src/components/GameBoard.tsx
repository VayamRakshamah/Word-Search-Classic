import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Star, HelpCircle, ArrowLeft, RefreshCw, 
  Lightbulb, CheckCircle2, Play, Home, AlertCircle, Clock
} from "lucide-react";
import { Coordinate, PlacedWord, WordGrid, GameLevel, UserStats } from "../types";
import { generateWordGrid, getLineCoordinates, checkWordMatch } from "../utils/gridGenerator";
import { SoundEngine } from "./SoundEngine";

// A set of beautiful pastel colors for successfully found words
const PASTEL_COLORS = [
  "bg-emerald-200/90 text-emerald-900 border-emerald-350 shadow-emerald-100",
  "bg-sky-200/90 text-sky-900 border-sky-350 shadow-sky-100",
  "bg-amber-200/90 text-amber-900 border-amber-350 shadow-amber-100",
  "bg-purple-200/90 text-purple-900 border-purple-350 shadow-purple-100",
  "bg-rose-200/90 text-rose-900 border-rose-350 shadow-rose-100",
  "bg-indigo-200/90 text-indigo-900 border-indigo-350 shadow-indigo-100",
  "bg-orange-200/90 text-orange-900 border-orange-350 shadow-orange-100",
  "bg-teal-200/90 text-teal-900 border-teal-350 shadow-teal-100",
  "bg-fuchsia-200/90 text-fuchsia-900 border-fuchsia-350 shadow-fuchsia-100",
];

interface GameBoardProps {
  level: GameLevel;
  userStats: UserStats;
  onBack: () => void;
  onLevelCleared: (timeSpent: number, stars: number, coinsEarned: number) => void;
}

export default function GameBoard({ level, userStats, onBack, onLevelCleared }: GameBoardProps) {
  const [gridData, setGridData] = useState<WordGrid | null>(null);
  const [alreadyFound, setAlreadyFound] = useState<string[]>([]);
  const [foundPaths, setFoundPaths] = useState<{ path: Coordinate[]; colorIndex: number }[]>([]);
  const [activeSelection, setActiveSelection] = useState<Coordinate[] | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [flashingHintCell, setFlashingHintCell] = useState<Coordinate | null>(null);
  const [gridReady, setGridReady] = useState(false);

  const startCellRef = useRef<Coordinate | null>(null);
  const lastLoggedCellRef = useRef<Coordinate | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);

  // Generate grid on load
  useEffect(() => {
    SoundEngine.playClick();
    const grid = generateWordGrid(level.words, level.gridSize, level.difficulty);
    setGridData(grid);
    setAlreadyFound([]);
    setFoundPaths([]);
    setActiveSelection(null);
    setTimer(0);
    setHintsUsed(0);
    setFlashingHintCell(null);
    setGridReady(true);

    // Timer start
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [level]);

  // Handle Game Complete check
  useEffect(() => {
    if (!gridData || gridData.words.length === 0) return;

    if (alreadyFound.length === gridData.words.length && alreadyFound.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      SoundEngine.playWin();

      // Calculate Stars (1-3 stars based on speed & hints)
      const idealTime = gridData.words.length * 15; // 15s per word
      let stars = 3;
      if (timer > idealTime * 1.5 || hintsUsed > 1) {
        stars = 2;
      }
      if (timer > idealTime * 2.5 || hintsUsed > 3) {
        stars = 1;
      }

      // Calculate Coins Earned (base 20 + 5 per star + speed bonus)
      const speedBonus = Math.max(0, Math.floor((idealTime * 2 - timer) / 5));
      const coinsEarned = 20 + stars * 10 + speedBonus;

      // Trigger completion callback after a small delay
      setTimeout(() => {
        onLevelCleared(timer, stars, coinsEarned);
      }, 1200);
    }
  }, [alreadyFound, gridData, timer, hintsUsed]);

  // Clear flashing hint cell after a few seconds
  useEffect(() => {
    if (flashingHintCell) {
      const t = setTimeout(() => {
        setFlashingHintCell(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [flashingHintCell]);

  // Utility to get grid coordinate from cell element point
  const getCellFromEvent = (clientX: number, clientY: number): Coordinate | null => {
    const elem = document.elementFromPoint(clientX, clientY);
    if (!elem) return null;

    // Find closest cell container
    const cellElem = elem.closest("[data-row]");
    if (!cellElem) return null;

    const row = parseInt(cellElem.getAttribute("data-row") || "", 10);
    const col = parseInt(cellElem.getAttribute("data-col") || "", 10);

    if (isNaN(row) || isNaN(col)) return null;
    return { row, col };
  };

  // Drag start (Mouse + Touch)
  const handleDragStart = (row: number, col: number) => {
    if (alreadyFound.length === gridData?.words.length) return; // level already complete
    SoundEngine.playClick();
    const cell = { row, col };
    startCellRef.current = cell;
    lastLoggedCellRef.current = cell;
    setActiveSelection([cell]);
    setIsSelecting(true);
  };

  // Drag moving (Mouse)
  const handleMouseMove = (row: number, col: number) => {
    if (!isSelecting || !startCellRef.current || !gridData) return;
    const current = { row, col };

    // Prevent excessive state renders if still over same cell
    if (
      lastLoggedCellRef.current &&
      lastLoggedCellRef.current.row === row &&
      lastLoggedCellRef.current.col === col
    ) {
      return;
    }

    lastLoggedCellRef.current = current;
    const path = getLineCoordinates(startCellRef.current, current, gridData.size);
    setActiveSelection(path);
  };

  // Touch Move (Supports dragging without letting finger go)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting || !startCellRef.current || !gridData) return;
    const touch = e.touches[0];
    const cell = getCellFromEvent(touch.clientX, touch.clientY);

    if (cell) {
      if (
        lastLoggedCellRef.current &&
        lastLoggedCellRef.current.row === cell.row &&
        lastLoggedCellRef.current.col === cell.col
      ) {
        return;
      }
      lastLoggedCellRef.current = cell;
      const path = getLineCoordinates(startCellRef.current, cell, gridData.size);
      setActiveSelection(path);
    }
  };

  // Drag release (End selection)
  const handleDragEnd = () => {
    if (!isSelecting || !activeSelection || !gridData) return;
    setIsSelecting(false);

    // Verify if word is matched
    const matchedWordObj = checkWordMatch(activeSelection, gridData.words, alreadyFound);

    if (matchedWordObj) {
      // Success! Lock path with a beautiful color
      const newFoundWord = matchedWordObj.word;
      SoundEngine.playSuccess();
      setAlreadyFound((prev) => [...prev, newFoundWord]);
      setFoundPaths((prev) => [
        ...prev,
        {
          path: activeSelection,
          colorIndex: prev.length % PASTEL_COLORS.length,
        },
      ]);
    } else {
      // Error sound
      SoundEngine.playError();
    }

    setActiveSelection(null);
    startCellRef.current = null;
    lastLoggedCellRef.current = null;
  };

  // Helper to trigger Hint (Costs 15 coins)
  const handleUseHint = () => {
    if (!gridData) return;
    if (userStats.coins < 15) {
      SoundEngine.playError();
      alert("Not enough coins! Earn more by solving puzzles.");
      return;
    }

    // Find words not yet found
    const missingWords = gridData.words.filter((w) => !alreadyFound.includes(w.word));
    if (missingWords.length === 0) return;

    // Deduct coins & play chime
    SoundEngine.playHint();
    setHintsUsed((prev) => prev + 1);

    // Pick random missing word and flash its starting letter
    const targetWord = missingWords[Math.floor(Math.random() * missingWords.length)];
    const hintStartCell = targetWord.start;

    setFlashingHintCell(hintStartCell);
    
    // Auto-deduct coin in game callback context
    userStats.coins -= 15;
  };

  // Helper to restart level
  const handleRestart = () => {
    SoundEngine.playClick();
    if (confirm("Restart this puzzle grid? Timer and progress will reset.")) {
      const grid = generateWordGrid(level.words, level.gridSize, level.difficulty);
      setGridData(grid);
      setAlreadyFound([]);
      setFoundPaths([]);
      setActiveSelection(null);
      setTimer(0);
      setHintsUsed(0);
      setFlashingHintCell(null);
    }
  };

  // Formatting helper for seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // Check if a cell is part of the active user selection
  const isCellInActiveSelection = (r: number, c: number): boolean => {
    if (!activeSelection) return false;
    return activeSelection.some((coord) => coord.row === r && coord.col === c);
  };

  // Check if a cell is part of a successfully found word path
  const getCellFoundColorClass = (r: number, c: number): string | null => {
    // Find the last locked path this cell belongs to so the overlay uses the newest found color
    for (let i = foundPaths.length - 1; i >= 0; i--) {
      const fp = foundPaths[i];
      if (fp.path.some((coord) => coord.row === r && coord.col === c)) {
        return PASTEL_COLORS[fp.colorIndex];
      }
    }
    return null;
  };

  if (!gridData) {
    return (
      <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-lg font-medium text-emerald-300">Generating puzzle grid...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between select-none touch-none pb-4"
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10 shadow-md">
        <button 
          onClick={onBack}
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-350 hover:text-white"
          id="btn-game-back"
        >
          <ArrowLeft className="w-5.5 h-5.5" />
        </button>

        <div className="text-center flex-1 mx-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 truncate">
            {level.categoryName}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-450 mt-0.5">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] uppercase font-bold text-slate-300">
              {level.difficulty}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-emerald-400" />
              {formatTime(timer)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Restart level */}
          <button 
            onClick={handleRestart}
            className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-350 hover:text-white"
            title="Reset Board"
            id="btn-game-restart"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>

          {/* Player Coins counter */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-full border border-slate-750">
            <span className="text-amber-400 font-bold text-xs">🪙</span>
            <span className="text-xs font-mono font-bold text-amber-100">{userStats.coins}</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas Section */}
      <div className="flex-1 flex items-center justify-center p-3 relative" ref={boardContainerRef}>
        <div 
          className="w-full max-w-[370px] aspect-square bg-slate-900 border-2 border-slate-800 rounded-3xl p-2.5 shadow-2xl relative select-none"
          onTouchMove={handleTouchMove}
        >
          {/* Main 2D Letter Grid */}
          <div 
            className="grid h-full w-full gap-0.5 select-none"
            style={{
              gridTemplateRows: `repeat(${gridData.size}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${gridData.size}, minmax(0, 1fr))`,
            }}
          >
            {gridData.cells.map((rowArr, r) =>
              rowArr.map((letter, c) => {
                const foundColor = getCellFoundColorClass(r, c);
                const isActive = isCellInActiveSelection(r, c);
                const isHint = flashingHintCell && flashingHintCell.row === r && flashingHintCell.col === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    data-row={r}
                    data-col={c}
                    onMouseDown={() => handleDragStart(r, c)}
                    onMouseEnter={() => handleMouseMove(r, c)}
                    className={`
                      grid-cell flex items-center justify-center text-sm sm:text-base font-extrabold font-mono rounded-lg relative cursor-pointer select-none transition-all duration-150
                      ${foundColor ? foundColor : "text-slate-200 hover:bg-slate-800/60"}
                      ${isActive ? "bg-amber-400/90 text-slate-950 scale-105 z-20 border border-amber-300 shadow-md" : ""}
                      ${isHint ? "animate-ping bg-emerald-500 text-slate-950 font-black scale-110 z-30" : ""}
                    `}
                  >
                    {letter}

                    {/* Locked Word Highlight Dot or Line Segment */}
                    {foundColor && (
                      <span className="absolute w-1.5 h-1.5 rounded-full bg-current opacity-30 bottom-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Word List Tracker */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 shadow-inner z-10 flex flex-col justify-end min-h-[170px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Find the Words ({alreadyFound.length} / {gridData.words.length})
          </span>
          
          {/* Hint trigger */}
          <button
            onClick={handleUseHint}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold rounded-full text-xs transition-all shadow-md"
            id="btn-use-hint"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint (-15 🪙)</span>
          </button>
        </div>

        {/* Scrollable grid layout of all words */}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[120px] pr-1 py-1 text-center font-semibold">
          {gridData.words.map((pw) => {
            const isFound = alreadyFound.includes(pw.word);
            return (
              <motion.div
                key={pw.word}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`
                  px-2 py-1.5 rounded-xl border text-xs tracking-wider uppercase truncate relative transition-all duration-300 flex items-center justify-center gap-1
                  ${isFound 
                    ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-400/70 line-through decoration-emerald-500 decoration-2" 
                    : "bg-slate-800 border-slate-750 text-slate-200"
                  }
                `}
              >
                {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <span className="truncate">{pw.word}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
