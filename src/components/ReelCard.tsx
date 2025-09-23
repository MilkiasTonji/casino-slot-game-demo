import React from "react";
import type { SymbolKey } from "../types";

type ReelCardProps = {
  reels: SymbolKey[][]; // each reel = 3 symbols
  spinning: boolean;
  winningLines: number[][];
  reelSpinning: boolean[];
};

const ReelCard: React.FC<ReelCardProps> = ({
  reels,
  spinning,
  winningLines,
  reelSpinning,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 text-3xl sm:text-4xl text-center">
      {reels.map((reel, colIdx) => (
        <div key={colIdx} className="reel-wrapper overflow-hidden">
          <div
            className={`reel-strip ${reelSpinning[colIdx] ? "reel-spin" : ""}`}
          >
            {reel.map((symbol, rowIdx) => {
              const flatIndex = rowIdx * 5 + colIdx; // just flatten to match paylines
              const isWinning = winningLines.some((line) =>
                line.includes(flatIndex)
              );
              return (
                <div
                  key={rowIdx}
                  className={`symbol ${isWinning ? "win-glow" : ""}`}
                >
                  {symbol}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelCard;
