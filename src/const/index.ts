import type { SymbolKey, WinningSymbolKey } from "../types";


export const SYMBOLS: SymbolKey[] = ["🍒", "🍋", "🔔", "🍇", "⭐", "💎"];
export const WINNING_SYMBOLS: WinningSymbolKey[] = ["🍒", "🍒", "🍒", "🍒", "⭐", "💎"];

export const PAYOUTS: Record<SymbolKey, number> = {
  "🍒": 2,
  "🍋": 3,
  "🔔": 4,
  "🍇": 5,
  "⭐": 8,
  "💎": 20,
};

export const WINNING_PAYOUTS: Record<WinningSymbolKey, number> = {
  "🍒": 2,
  "⭐": 8,
  "💎": 20,
};
export const PAYLINES = [
  [0, 1, 2, 3, 4], // top row
  [5, 6, 7, 8, 9], // middle row
  [10, 11, 12, 13, 14], // bottom row
  [0, 6, 12, 8, 4], // diagonal top-left to bottom-right
  [10, 6, 2, 8, 14], // diagonal bottom-left to top-right
];

export const WINNING_PAYLINES = [
  [0, 1, 2, 3, 4], // top row
  [5, 6, 7, 8, 9], // middle row
  [10, 11, 12, 13, 14], // bottom row
  [0, 6, 12, 8, 4], // diagonal top-left to bottom-right
  [10, 6, 2, 8, 14], // diagonal bottom-left to top-right
  [0, 1, 7, 13, 14], // V shape
  [10, 11, 7, 3, 4], // inverted V shape
  [5, 1, 2, 3, 9], // small n shape
  [5, 11, 12, 13, 9], // inverted small n shape
  [0, 6, 7, 8, 14], // zigzag down
  [10, 6, 7, 8, 4], // zigzag up
  [2, 3, 7, 11, 12], // middle cross
];

export const PAYLINES_MULTIPLIER = 5; // each payline pays this multiplier
