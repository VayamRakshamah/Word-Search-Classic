import { Coordinate, PlacedWord, WordGrid } from "../types";

// Direction vectors
const ALL_DIRECTIONS = [
  { r: 0, c: 1 },    // Horizontal Right
  { r: 1, c: 0 },    // Vertical Down
  { r: 1, c: 1 },    // Diagonal Down-Right
  { r: 1, c: -1 },   // Diagonal Down-Left
  { r: 0, c: -1 },   // Horizontal Left (backwards)
  { r: -1, c: 0 },   // Vertical Up (backwards)
  { r: -1, c: -1 },  // Diagonal Up-Left (backwards)
  { r: -1, c: 1 },   // Diagonal Up-Right (backwards)
];

// Limit directions based on difficulty
function getDirectionsForDifficulty(difficulty: "Easy" | "Medium" | "Hard") {
  if (difficulty === "Easy") {
    // Easy: horizontal right, vertical down
    return ALL_DIRECTIONS.slice(0, 2);
  }
  if (difficulty === "Medium") {
    // Medium: horizontal right, vertical down, diagonal down-right, diagonal down-left
    return ALL_DIRECTIONS.slice(0, 4);
  }
  // Hard: all 8 directions (forwards & backwards)
  return ALL_DIRECTIONS;
}

export function generateWordGrid(
  wordsToPlace: string[],
  size: number,
  difficulty: "Easy" | "Medium" | "Hard"
): WordGrid {
  // 1. Initialize grid with empty strings
  const cells: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));

  const placedWords: PlacedWord[] = [];
  const directions = getDirectionsForDifficulty(difficulty);

  // Sort words by length descending to place longer words first (increases success rate)
  const sortedWords = [...wordsToPlace]
    .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
    .sort((a, b) => b.length - a.length);

  for (const rawWord of sortedWords) {
    if (rawWord.length > size) continue; // Skip words that are too long for the grid

    let placed = false;
    let attempts = 0;
    const maxAttempts = 150;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Choose random start position
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      
      // Choose random direction allowed for this difficulty
      const dir = directions[Math.floor(Math.random() * directions.length)];

      // Check if word fits in this direction
      let canPlace = true;
      const path: Coordinate[] = [];

      for (let i = 0; i < rawWord.length; i++) {
        const nextRow = startRow + dir.r * i;
        const nextCol = startCol + dir.c * i;

        // Verify out of bounds
        if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
          canPlace = false;
          break;
        }

        // Verify letter conflicts
        const existingLetter = cells[nextRow][nextCol];
        if (existingLetter !== "" && existingLetter !== rawWord[i]) {
          canPlace = false;
          break;
        }

        path.push({ row: nextRow, col: nextCol });
      }

      if (canPlace) {
        // Place letters on grid
        for (let i = 0; i < rawWord.length; i++) {
          cells[path[i].row][path[i].col] = rawWord[i];
        }

        placedWords.push({
          word: rawWord,
          start: { row: startRow, col: startCol },
          end: { row: startRow + dir.r * (rawWord.length - 1), col: startCol + dir.c * (rawWord.length - 1) },
          path,
        });
        placed = true;
      }
    }
  }

  // 2. Fill empty spaces with random uppercase letters
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (cells[r][c] === "") {
        cells[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return {
    size,
    cells,
    words: placedWords,
  };
}

/**
 * Checks if a selection coordinate sequence exactly matches a word's path.
 * In a word search, the selection can be backwards (end-to-start) or forwards.
 */
export function checkWordMatch(
  selectionPath: Coordinate[],
  placedWords: PlacedWord[],
  alreadyFound: string[]
): PlacedWord | null {
  if (selectionPath.length < 3) return null;

  // Selection start and end
  const start = selectionPath[0];
  const end = selectionPath[selectionPath.length - 1];

  for (const placed of placedWords) {
    if (alreadyFound.includes(placed.word)) continue;

    const len = placed.path.length;
    if (len !== selectionPath.length) continue;

    // Check forwards match
    let matchForwards = true;
    for (let i = 0; i < len; i++) {
      if (
        placed.path[i].row !== selectionPath[i].row ||
        placed.path[i].col !== selectionPath[i].col
      ) {
        matchForwards = false;
        break;
      }
    }

    if (matchForwards) return placed;

    // Check backwards match
    let matchBackwards = true;
    for (let i = 0; i < len; i++) {
      if (
        placed.path[i].row !== selectionPath[len - 1 - i].row ||
        placed.path[i].col !== selectionPath[len - 1 - i].col
      ) {
        matchBackwards = false;
        break;
      }
    }

    if (matchBackwards) return placed;
  }

  return null;
}

/**
 * Generates coordinate list for cells from start to current position if it forms
 * a valid straight line (horizontal, vertical, or 45-degree diagonal).
 */
export function getLineCoordinates(start: Coordinate, current: Coordinate, size: number): Coordinate[] {
  const dRow = current.row - start.row;
  const dCol = current.col - start.col;

  // Must be non-zero move
  if (dRow === 0 && dCol === 0) {
    return [start];
  }

  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);

  let stepRow = 0;
  let stepCol = 0;
  let steps = 0;

  if (dRow === 0) {
    // Horizontal
    stepCol = dCol > 0 ? 1 : -1;
    steps = absCol;
  } else if (dCol === 0) {
    // Vertical
    stepRow = dRow > 0 ? 1 : -1;
    steps = absRow;
  } else if (absRow === absCol) {
    // Diagonal
    stepRow = dRow > 0 ? 1 : -1;
    stepCol = dCol > 0 ? 1 : -1;
    steps = absRow;
  } else {
    // Not a straight horizontal, vertical, or 45-deg line.
    // Return only the start element or snap to nearest direction for beautiful swipe selection
    // To make it feel premium, we snap to the closest 45-deg or straight angle.
    if (absRow > absCol * 2) {
      // Snaps to vertical
      stepRow = dRow > 0 ? 1 : -1;
      steps = absRow;
    } else if (absCol > absRow * 2) {
      // Snaps to horizontal
      stepCol = dCol > 0 ? 1 : -1;
      steps = absCol;
    } else {
      // Snaps to diagonal
      stepRow = dRow > 0 ? 1 : -1;
      stepCol = dCol > 0 ? 1 : -1;
      steps = Math.min(absRow, absCol);
    }
  }

  const path: Coordinate[] = [];
  for (let i = 0; i <= steps; i++) {
    const r = start.row + stepRow * i;
    const c = start.col + stepCol * i;
    if (r >= 0 && r < size && c >= 0 && c < size) {
      path.push({ row: r, col: c });
    }
  }

  return path;
}
