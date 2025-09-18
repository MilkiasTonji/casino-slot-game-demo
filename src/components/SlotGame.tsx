import React, { useEffect, useRef, useState } from "react";
import type { SymbolKey, WinningSymbolKey } from "../types";

const SYMBOLS: SymbolKey[] = ["🍒", "🍋", "🔔", "🍇", "⭐", "💎"];
const WINNING_SYMBOLS: SymbolKey[] = ["🍒", "🍒", "🍒", "🍒", "⭐", "💎"];

const PAYOUTS: Record<SymbolKey, number> = {
  "🍒": 2,
  "🍋": 3,
  "🔔": 4,
  "🍇": 5,
  "⭐": 8,
  "💎": 20,
};

const WINNING_PAYOUTS: Record<WinningSymbolKey, number> = {
  "🍒": 2,
  "⭐": 8,
  "💎": 20,
};
const PAYLINES = [
  [0, 1, 2, 3, 4], // top row
  [5, 6, 7, 8, 9], // middle row
  [10, 11, 12, 13, 14], // bottom row
  [0, 6, 12, 8, 4], // diagonal top-left to bottom-right
  [10, 6, 2, 8, 14], // diagonal bottom-left to top-right
];

const WINNING_PAYLINES = [
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

const PAYLINES_MULTIPLIER = 5; // each payline pays this multiplier

const SlotGame: React.FC = () => {
  const [balance, setBalance] = useState<number>(50);
  const [bet, setBet] = useState<number>(1);
  const [reels, setReels] = useState<SymbolKey[]>(Array(15).fill("🍒"));
  const [spinning, setSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Good luck!");
  const [winningLines, setWinningLines] = useState<number[][]>([]);
  const [symbols, setSymbols] = useState<SymbolKey[] | WinningSymbolKey[]>(
    SYMBOLS
  );
  const [payouts, setPayouts] =
    useState<Record<SymbolKey | WinningSymbolKey, number>>(PAYOUTS);
  const [payLines, setPayLines] = useState<number[][]>(PAYLINES);
  const [winningModeActivated, setWinningModeActivated] =
    useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  // Sound effects
  const spinSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinSound.current = new Audio("/audio/beep_short.ogg");
    winSound.current = new Audio("/audio/clang_and_wobble.ogg");
    loseSound.current = new Audio("/audio/wood_plank_flicks.ogg");
    return () => {
      timersRef.current.forEach((t) => clearInterval(t));
    };
  }, []);

  const randomSymbol = (): SymbolKey => {
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    console.log("Random symbol picked--------", sym);
    return sym;
  };

  const spin = () => {
    if (spinning) return;
    if (bet <= 0) {
      setMessage("Bet must be at least 1");
      return;
    }
    if (bet > balance) {
      setMessage("Not enough balance");
      return;
    }

    setSpinning(true);
    setMessage("Spinning...");
    setWinningLines([]);
    setBalance((b) => b - bet);

    spinSound.current?.play();

    const newSymbols: SymbolKey[] = Array.from({ length: 15 }, randomSymbol);
    setTimeout(() => {
      setReels(newSymbols);
      processSpinResult(newSymbols);
      setSpinning(false);
    }, 1500);
  };

  //   Process the result of the spin or evealute the randomly generated reels
  const processSpinResult = (newReels: SymbolKey[]) => {
    // uses randomly generated reels to determine wins
    const wins: number[][] = [];
    let totalWin = 0;
    console.log("Evaluating spin randomly generated reels--------", newReels);

    payLines.forEach((line) => {
      const symbols = line.map((i) => newReels[i]);
      if (symbols.every((s) => s === symbols[0])) {
        const win = payouts[symbols[0]] * bet * PAYLINES_MULTIPLIER; // payline multiplier
        totalWin += win;
        wins.push(line);
      }
    });

    if (wins.length > 0) {
      setBalance((b) => b + totalWin);
      setMessage(`You win ${totalWin} 🎉`);
      setWinningLines(wins);
      winSound.current?.play();
      setTimeout(() => setWinningLines([]), 2000);
    } else {
      setMessage("No win — try again!");
      loseSound.current?.play();
    }
  };

  const resetGame = () => {
    setBalance(50);
    setBet(1);
    setReels(Array(15).fill("🍒"));
    setMessage("Game reset. Good luck!");
    setSpinning(false);
    setWinningLines([]);
  };

  const makeGameWinningMode = () => {
    setWinningModeActivated(true);
    setSymbols(WINNING_SYMBOLS);
    setPayouts(WINNING_PAYOUTS as Record<SymbolKey, number>);
    setPayLines(WINNING_PAYLINES);
    setMessage("Winning mode activated! Try your luck!");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur rounded-2xl p-5 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2 flex items-center gap-3">
            🎰 5x3 Slot Demo
          </h1>
          {winningModeActivated && (
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
              Winning Mode
            </span>
          )}
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Your Balance:{" "}
          <span className="font-medium text-white">${balance}</span>
        </p>
        {/* add winning mode switcher button for testing */}
        {winningModeActivated && (
          <button
            onClick={makeGameWinningMode}
            className="mb-4 px-3 py-1.5 rounded-md bg-purple-600 text-white text-sm cursor-pointer hover:bg-purple-700"
            disabled={spinning}
          >
            Activate Winning Mode
          </button>
        )}

        {/* Bet controls */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <label className="text-sm text-gray-300">Bet:</label>
          <input
            type="number"
            min={1}
            value={bet}
            onChange={(e) => setBet(Math.max(1, Number(e.target.value || 1)))}
            className="w-20 bg-white/10 text-white px-2 py-1 rounded-md outline-none text-center"
            disabled={spinning}
          />
          <button
            onClick={() => setBet((b) => Math.min(balance, b + 1))}
            className="w-16 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm cursor-pointer hover:bg-white/20"
            disabled={spinning}
          >
            +
          </button>
          <button
            onClick={() => setBet((b) => Math.max(1, b - 1))}
            className="w-16 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm cursor-pointer hover:bg-white/20"
            disabled={spinning}
          >
            -
          </button>

          <div className="w-full text-sm text-gray-300 mt-2 sm:mt-0">
            Message: <span className="text-white">{message}</span>
          </div>
        </div>
        {/* Display reels here */}
        <div className="bg-white/3 p-3 rounded-lg border border-white/5 mb-4">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-3xl sm:text-4xl text-center">
            {reels.map((symbol, idx) => {
              const isWinning = winningLines.some((line) => line.includes(idx));
              return (
                <div
                  key={idx}
                  className={`py-6 rounded-lg bg-white/5 backdrop-blur flex items-center justify-center text-xl sm:text-5xl ${
                    spinning ? "reel-spin" : ""
                  } ${isWinning ? "win-glow" : ""}`}
                >
                  {symbol}
                </div>
              );
            })}
          </div>
        </div>
        {/* Bottom section for buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={spin}
            disabled={spinning}
            className={`flex-1 py-3 rounded-lg font-semibold transition-opacity ${
              spinning
                ? "bg-white/10 text-gray-200 opacity-60 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
            }`}
          >
            {spinning ? "Spinning..." : "Spin"}
          </button>

          <button
            onClick={resetGame}
            className="sm:w-28 py-3 rounded-lg bg-white/10 text-white"
          >
            Reset
          </button>
        </div>
        {/* Rules and Notices */}
        <div className="mt-4 text-xs text-gray-400">
          <span className="text-red-400">Rules</span>: 5 paylines (3
          horizontals, 2 diagonals). 5 of a kind pays multiplier × bet.
        </div>
      </div>
    </div>
  );
};

export default SlotGame;
