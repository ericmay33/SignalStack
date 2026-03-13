# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SignalStack** is a full-stack Wall Street analyst consensus dashboard. Users build a watchlist of up to 8 stock tickers and view analyst ratings, price targets, and growth estimates side-by-side.

**Current state**: Frontend scaffold only (`src/App.tsx` is still the default Vite template). Phase 1 UI mockup lives in `REFERENCE_UI.jsx` (root, untracked). Backend does not exist yet.

The authoritative implementation blueprint is `SIGNALSTACK_ARCHITECTURE.md` — read it before starting any implementation work.

---

## Commands

### Frontend (root directory)

```bash
npm run dev        # Dev server → http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint (TypeScript + React rules)
npm run preview    # Preview production build
```

### Backend (once scaffolded at `backend/`)

```bash
cd backend
source venv/bin/activate          # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload     # → http://localhost:8000
# Swagger UI available at http://localhost:8000/docs
```

---

## Architecture

### Two-Page Frontend

| Page | Route | Purpose |
|------|-------|---------|
| ListManager | `/` | Search bar + ticker chip management, "Apply to Dashboard" CTA |
| Dashboard | `/dashboard` | Responsive card grid with analyst data per ticker |

### Data Flow

```
useWatchlist (localStorage) → ListManager → navigate("/dashboard")
                                           ↓
                              useStockData(tickers) → POST /api/stocks
                                           ↓
                              StockCard[] → ConsensusDonut, PriceTargetBar, GrowthEstimates
```

### Backend Data Sources

- **Finnhub.io** (primary): price quotes, analyst recommendations, price targets, EPS estimates. Requires `FINNHUB_API_KEY` env var. Free tier = 60 calls/min (5 endpoints × 8 tickers = 40 calls/load).
- **yfinance** (supplementary): company name, forward PE, revenue/earnings growth. No API key. Blocking calls — run in `ThreadPoolExecutor`.
- Finnhub recommendation array is sorted date-descending; always use index `[0]` for the latest month.

### Consensus Label Formula

Derived in `backend/app/services/aggregator.py` (not from API):

```python
score = ((strongBuy*5) + (buy*4) + (hold*3) + (sell*2) + (strongSell*1)) / total
# ≥4.5 → Strong Buy, ≥3.5 → Buy, ≥2.5 → Hold, ≥1.5 → Sell, else → Strong Sell
```

### Key API Contract

`POST /api/stocks` accepts `{"tickers": ["NVDA", "TSLA"]}` and returns per-ticker objects with `price`, `consensus`, `price_target`, `growth`, and optional `sentiment` fields. See `SIGNALSTACK_ARCHITECTURE.md` §5 for the full response schema.

### Design System

- Font: JetBrains Mono throughout (terminal aesthetic)
- Background: `#050505`, cards: `rgba(15, 25, 18, 0.92)` with `backdrop-filter: blur(20px)`
- Accent: `#22c55e` (green). Rating colors: Strong Buy `#22c55e`, Buy `#4ade80`, Hold `#eab308`, Sell `#ef4444`, Strong Sell `#dc2626`
- Card: 16px border-radius, top-edge green glow, min 260px / max 340px width

---

## Environment Variables

**Backend (`.env`)**:
```
FINNHUB_API_KEY=your_key_here
ANTHROPIC_API_KEY=sk-ant-xxx   # optional, for Claude sentiment analysis
ENV=development
PORT=8000
```

**Frontend (`.env`)**:
```
VITE_API_URL=http://localhost:8000
```

---

## Implementation Phases

Per `SIGNALSTACK_ARCHITECTURE.md` §10:

- **Phase 1** (done): UI mockup → see `REFERENCE_UI.jsx`
- **Phase 2**: Scaffold backend, implement Finnhub + yfinance services, wire `POST /api/stocks`
- **Phase 3**: Replace mock data with real API calls; add `useStockData`, `useWatchlist` hooks; loading/error states
- **Phase 4**: Framer Motion animations, optional Claude sentiment, deploy (Vercel + Railway)

---

## Installed Frontend Dependencies

`recharts`, `framer-motion`, `lucide-react`, `axios`, `react-is` (recharts peer dep), `tailwindcss`, `@tailwindcss/vite`

> **Note**: `@tailwindcss/vite` declares peer support for Vite ^5/6/7, but Vite 8 is installed. Install with `--legacy-peer-deps`. It works correctly at runtime.

**Backend** (Python, not yet scaffolded):
```
fastapi uvicorn httpx yfinance python-dotenv
```
