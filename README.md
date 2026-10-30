# 🕹️ Soup - Retro Arcade

A retro-styled multiplayer/collaborative arcade web platform inspired by the iconic *Invader Zim / Cupcake Attack* neon-grunge aesthetic. Built with Next.js, TypeScript, and Tailwind CSS. Players play classic arcade games (**Crossy Road**, **Flappy Bird**, **Minesweeper**, and **Subway Surfers**), earn arcade tickets, and spend them on prizes in the redemption vault.

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## 🏗️ Architecture & Shared Foundation

This repository provides the shared foundation for all team members:

| Component | Path | Description |
| :--- | :--- | :--- |
| **Shared Games Registry** | `src/data/games.ts` | The list of all arcade games, routes, and metadata. |
| **Ticket Wallet** | `src/context/TicketContext.tsx` | Central state for tickets with `addTickets()` and `spendTickets()`. |
| **Global Header** | `src/components/Header.tsx` | Site-wide header displaying the arcade branding and live ticket balance. |
| **Arcade Floor (Home)** | `src/app/page.tsx` | Visual cabinet selector floor. |
| **Cabinet Pages** | `src/app/games/[slug]/` | Individual game pages with CRT monitor styling and "Coming Soon" states. |
| **Prize Shop** | `src/app/shop/page.tsx` | Redemption counter where players spend tickets. |
| **Prize Catalog** | `src/data/prizes.ts` | Items available in the prize shop. |

---

## 🛠️ Instructions for Teammates

### 1. Claim your Game
Open `src/data/games.ts` and customize your game entry (title, developer name, colors, payout).

### 2. Implement your Game
Navigate to `src/app/games/[slug]/GameClientView.tsx` (or add a dedicated component under `src/components/games/`) to implement your gameplay canvas/loop.

### 3. Rewarding & Spending Tickets
Import the `useTickets` hook into any component:

```tsx
import { useTickets } from "@/context/TicketContext";

export function Game() {
  const { tickets, addTickets, spendTickets } = useTickets();

  // Award tickets when a player wins or beats a high score:
  const onGameEnd = (score: number) => {
    addTickets(25);
  };

  // Spending tickets (returns false if balance is too low, never drops below 0):
  const onPurchase = () => {
    const success = spendTickets(50);
    if (!success) {
      alert("Insufficient tickets!");
    }
  };
}
```
