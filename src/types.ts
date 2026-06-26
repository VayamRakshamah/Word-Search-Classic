export interface Coordinate {
  row: number;
  col: number;
}

export interface GridCell {
  row: number;
  col: number;
  letter: string;
}

export interface PlacedWord {
  word: string;
  start: Coordinate;
  end: Coordinate;
  path: Coordinate[];
}

export interface WordGrid {
  size: number;
  cells: string[][]; // 2D array of letters
  words: PlacedWord[];
}

export interface PresetCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  words: string[];
}

export interface GameLevel {
  id: string;
  categoryName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  gridSize: number;
  words: string[];
  isCustomAI?: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  levelsCompleted: number;
  customThemesCreated: number;
  totalStars: number;
  coins: number;
  fastestTime: number; // in seconds
  currentStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
}

export interface LevelProgress {
  levelId: string; // categoryId or customId
  stars: number;
  completed: boolean;
  bestTime: number; // in seconds
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
}
