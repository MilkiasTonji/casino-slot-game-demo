# 🎰 Slot Machine Game Demo (React + TypeScript)

A simple **casino-style slot machine demo** built with **React, TypeScript, and Vite**.  
It features:

- 5×3 reels with **5 paylines** (3 horizontal + 2 diagonal).
- Spin animations and sound effects.
- Bet management and balance system.
- Highlighted **winning paylines** with glowing animation.
- Responsive, mobile-friendly design.
- Reset functionality to restart the game.
- Two Play Modes: Standard & Winning

---

# 🎮 Game Modes

The slot game supports two modes of play:

- Standard Mode

  - Default mode.
  - Very low chance of hitting winning paylines (realistic slot odds).
  - Good for simulating a real slot machine.

- Winning Mode
  - Activated using the Winning Mode toggle in the UI.
  - Greatly increases the chance of winning (90%+).

---

## 🚀 Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for fast development and build.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- Node.js **v22.14.0** (recommended).

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
```

---

## 🏃 Running the Project

Start the development server:

```bash
npm run dev
```

Then open your browser at:

```
http://localhost:5173
```

---

📁 Project Structure

```bash
├── src
│   ├── components
│   │   └── SlotGame.tsx     # Main slot machine component
│   ├── main.tsx             # Vite + React entry point
│   └── index.css            # Tailwind base styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

🎮 How to Play

1. Set your bet amount using the input or +/− buttons.

2. Click Spin to play.

3. If a payline hits:

   - Winning symbols glow with animation ✨.

   - Balance is updated based on payout rules.

4. Click Reset to restart the game with default balance.

---

📜 Rules

- 5 paylines: 3 horizontal + 2 diagonal.

- Higher value symbols pay more.

- 50 coins of initial balance is awarded.

- Balance decreases by your bet each spin, and increases if you win.

---

# casino-slot-game-demo
