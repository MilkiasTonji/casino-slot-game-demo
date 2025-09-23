import React, { useEffect, useRef, useState } from "react";
import type { SymbolKey, WinningSymbolKey } from "../types";
import ReelCard from "./ReelCard";
import {
  PAYLINES,
  PAYLINES_MULTIPLIER,
  PAYOUTS,
  SYMBOLS,
  WINNING_PAYLINES,
  WINNING_PAYOUTS,
  WINNING_SYMBOLS,
} from "../const";

const SlotGame: React.FC = () => {
  const [balance, setBalance] = useState<number>(50);
  const [bet, setBet] = useState<number>(1);
  const [symbols, setSymbols] = useState<SymbolKey[] | WinningSymbolKey[]>(
    SYMBOLS
  );
  const [spinning, setSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Good luck!");
  const [winningLines, setWinningLines] = useState<number[][]>([]);

  const [payouts, setPayouts] =
    useState<Record<SymbolKey | WinningSymbolKey, number>>(PAYOUTS);
  const [payLines, setPayLines] = useState<number[][]>(PAYLINES);
  const [winningModeActivated, setWinningModeActivated] =
    useState<boolean>(false);

  const [reelSpinning, setReelSpinning] = useState<boolean[]>(
    Array(5).fill(false) // 5 reels for spinning step by step
  );

  const randomSymbol = (): SymbolKey => {
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    return sym;
  };

  const generateReelStrip = (length = 15): SymbolKey[] => {
    return Array.from({ length }, randomSymbol);
  };

  const [reels, setReels] = useState<SymbolKey[][]>(
    Array.from({ length: 5 }, () => generateReelStrip())
  );

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

  const newReelsFlattened = (reels: SymbolKey[][]): SymbolKey[] => {
    const cols = reels.length;
    const rows = reels[0]?.length ?? 3;
    const flat: SymbolKey[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        flat.push(reels[col]?.[row] ?? (symbols[0] as SymbolKey));
      }
    }
    return flat;
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

    // play spin sound and start all cols spinning
    spinSound.current?.play();
    setReelSpinning(Array(5).fill(true));

    // stop reels one by one
    reels.forEach((_, colIdx) => {
      setTimeout(() => {
        const newReel = Array.from({ length: 3 }, randomSymbol);
        setReels((prev) => {
          const copy = [...prev];
          copy[colIdx] = newReel;
          return copy;
        });

        // stop animation for this reel
        setReelSpinning((prev) => {
          const updated = [...prev];
          updated[colIdx] = false;
          return updated;
        });

        // last reel stopped, evaluate result
        if (colIdx === reels.length - 1) {
          setSpinning(false);
          setReels((prev) => {
            const copy = [...prev];
            copy[colIdx] = newReel;
            processSpinResult(newReelsFlattened(copy));
            return copy;
          });
        }
      }, 800 + colIdx * 600); // calculated delay based on index
    });
  };

  //   Process the result of the spin or evealute the randomly generated reels
  const processSpinResult = (newReels: SymbolKey[]) => {
    // uses randomly generated reels to determine wins
    const wins: number[][] = [];
    let totalWin = 0;
    // console.log("Evaluating spin randomly generated reels--------", newReels);

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
    setReels(Array.from({ length: 5 }, () => Array(3).fill("🍒" as SymbolKey)));
    setMessage("Game reset. Good luck!");
    setSpinning(false);
    setWinningLines([]);
  };

  const makeGameWinningMode = () => {
    setWinningModeActivated((prev) => {
      const newMode = !prev;

      if (newMode) {
        // Switching to Winning Mode
        setSymbols(WINNING_SYMBOLS);
        setPayouts(WINNING_PAYOUTS as Record<SymbolKey, number>);
        setPayLines(WINNING_PAYLINES);
        setMessage("🎉 Winning mode activated! Try your luck!");
      } else {
        // Switching back to Standard Mode
        setSymbols(SYMBOLS);
        setPayouts(PAYOUTS);
        setPayLines(PAYLINES);
        setMessage("Standard mode activated. Good luck!");
      }

      return newMode;
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur rounded-2xl p-5 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2 flex items-center gap-3">
            🎰 5x3 Slot Demo
          </h1>
          <button
            type="button"
            role="switch"
            aria-checked={winningModeActivated}
            onClick={() => makeGameWinningMode()}
            disabled={spinning}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              winningModeActivated
                ? "bg-purple-600 focus:ring-purple-500"
                : "bg-gray-300 dark:bg-gray-600 focus:ring-indigo-500"
            } ${spinning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                winningModeActivated ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-300 mb-4">
            Your Balance:{" "}
            <span className="font-medium text-white">${balance}</span>
          </p>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
            {winningModeActivated ? "Winning Mode" : "Standard Mode"}
          </span>
        </div>

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
          <ReelCard
            reels={reels}
            spinning={spinning}
            winningLines={winningLines}
            reelSpinning={reelSpinning}
          />
        </div>
        {/* Bottom section for buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={spin}
            disabled={spinning}
            className={`flex-1 py-3 rounded-lg font-semibold transition-opacity relative ${
              spinning
                ? "bg-white/10 text-gray-200 opacity-60 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
            }`}
          >
            {spinning ? (
              <div className="w-6 h-6 border-4 border-t-4 border-l-4 border-white border-t-amber-500 border-l-amber-500 rounded-full animate-spin mx-auto"></div>
            ) : (
              "Spin"
            )}
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
        <div className="mt-4 text-xs text-gray-400">
          <span className="text-red-400">Hint</span>: Switch the game mode to
          winning mode to increase the chance of winning. Use toggle button on
          the top right.
        </div>
      </div>
    </div>
  );
};

export default SlotGame;
