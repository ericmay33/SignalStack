# SignalStack

Real-time analyst consensus dashboard aggregating Wall Street ratings, price targets, and growth estimates.

## Overview

SignalStack lets you build a watchlist of up to 8 stock tickers and view analyst consensus ratings, price targets, and growth metrics side-by-side. It pulls live data from Finnhub and yfinance, presenting it in a dark terminal-style interface with SVG donut charts and gradient price bars.

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, TypeScript
- **Backend**: Python FastAPI, Uvicorn
- **Data Sources**: Finnhub.io (quotes, analyst ratings, price targets, EPS), yfinance (company info, growth metrics)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- [Finnhub API key](https://finnhub.io/) (free tier)

### Installation

```bash
# Clone
git clone [https://github.com/your-username/signalstack.git](https://github.com/your-username/signalstack.git)
cd signalstack

# Frontend
npm install --legacy-peer-deps
cp .env.example .env  # set VITE_API_URL if needed

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # set FINNHUB_API_KEY
```

### Running

```bash
# Backend (terminal 1)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload  # http://localhost:8000

# Frontend (terminal 2)
npm run dev  # http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```text
signalstack/
├── src/
│   ├── components/     # Header, Footer, StockCard, SvgDonut, SearchBar, etc.
│   ├── pages/          # ListManager, Dashboard
│   ├── hooks/          # useWatchlist (localStorage), useStockData (API)
│   ├── lib/            # api.ts (fetch + mapping), mockData.ts (fallback)
│   ├── types.ts        # StockData, StockRatings, StockTarget
│   ├── App.tsx         # Page state + shared chrome
│   └── index.css       # Tailwind v4 theme + custom utilities
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app + CORS
│       ├── services/
│       │   ├── finnhub_service.py
│       │   ├── yfinance_service.py
│       │   └── aggregator.py    # Merges sources + consensus formula
│       └── tests/
└── docs/
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/stocks` | Accepts `{"tickers": ["NVDA", "TSLA"]}`, returns per-ticker analyst data |
| `GET` | `/api/health` | Health check |

## Data Sources

- **Finnhub** (primary): Real-time quotes, analyst recommendation trends, price targets, EPS estimates. Free tier supports 60 calls/min.
- **yfinance** (supplementary): Company name, forward PE, revenue/earnings growth. No API key required.

Consensus labels are derived from weighted analyst ratings, not sourced from any API directly.

## License

MIT
