import React from "react";
import type { SymbolKey } from "../types";

type ReelCardProps = {
  reels: SymbolKey[];
  spinning: boolean;
  winningLines: number[][];
};

const ReelCard: React.FC<ReelCardProps> = ({
  reels,
  winningLines,
  spinning,
}) => {
  return (
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
  );
};

export default ReelCard;
