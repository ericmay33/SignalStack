# SignalStack — Software Architecture Plan

> **Purpose**: This document is the single source of truth for building SignalStack. Feed this into your AI coding agent (Claude Code, Cursor, Codex) as project context before beginning any implementation work.

---

## 1. Product Overview

**SignalStack** is a full-stack web application that aggregates Wall Street analyst consensus data and presents it in a dark-themed, side-by-side comparison dashboard. Users build a custom watchlist of up to 8 stock tickers, then view analyst ratings breakdowns, price targets, and growth estimates for each ticker on a visual dashboard.

### Core Pages

| Page | Route | Description |
|------|-------|-------------|
| List Manager | `/` | Search bar with autocomplete, ticker chip management, quick-add row, "Apply to Dashboard" CTA |
| Dashboard | `/dashboard` | Responsive card grid showing analyst consensus donut charts, rating breakdowns, price target sliders, growth estimates, and aggregate summary footer |

### Key Constraints

- **100% free-tier infrastructure** — no paid APIs, no paid hosting
- **Max 8 tickers per watchlist**
- All data is public sell-side analyst data (same underlying source as TipRanks, MarketBeat, etc.)
- Watchlist persists across sessions via `localStorage`

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React (Vite) | Fast HMR, lightweight, no SSR needed |
| Styling | Tailwind CSS | Utility-first, dark mode support, rapid iteration |
| Charts | Recharts | Composable React chart components, good PieChart/donut support |
| Animations | Framer Motion | Staggered card entrances, page transitions, background effects |
| Backend | Python FastAPI | Async, fast, auto-generates OpenAPI docs, clean JSON responses |
| Data Library | `yfinance` | Zero API keys, no strict rate limits, hits Yahoo Finance directly |
| Data API | Finnhub.io (free tier) | 60 calls/min, analyst consensus + price targets + EPS estimates |
| Persistence | `localStorage` (frontend) | Watchlist persists across browser sessions |
| Frontend Hosting | Vercel | Free tier, one-click deploy from GitHub |
| Backend Hosting | Railway | Free tier, supports Python/FastAPI, auto-deploy from GitHub |

---

## 3. Project Structure

```
signalstack/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CircuitBackground.jsx    # Animated SVG circuit-board background
│   │   │   ├── ConsensusDonut.jsx       # Recharts donut gauge for analyst ratings
│   │   │   ├── PriceTargetBar.jsx       # Linear slider showing low/avg/high targets
│   │   │   ├── StockCard.jsx            # Individual ticker card (composes Donut + Bar)
│   │   │   ├── SearchBar.jsx            # Ticker search with autocomplete dropdown
│   │   │   ├── TickerChip.jsx           # Removable ticker badge
│   │   │   └── SummaryFooter.jsx        # Aggregate stats bar at bottom of dashboard
│   │   ├── pages/
│   │   │   ├── ListManager.jsx          # Page 1 — watchlist builder
│   │   │   └── Dashboard.jsx            # Page 2 — comparison cards grid
│   │   ├── hooks/
│   │   │   ├── useWatchlist.js           # localStorage-backed watchlist state
│   │   │   └── useStockData.js           # Fetches data from backend, manages loading/error
│   │   ├── lib/
│   │   │   └── api.js                    # Axios/fetch wrapper for backend calls
│   │   ├── App.jsx                       # Router + page transitions
│   │   ├── main.jsx                      # Vite entry point
│   │   └── index.css                     # Tailwind directives + custom CSS
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                       # FastAPI app, CORS config, root route
│   │   ├── routers/
│   │   │   └── stocks.py                 # /api/stocks endpoint
│   │   ├── services/
│   │   │   ├── finnhub_service.py        # Finnhub API calls (consensus, targets, estimates)
│   │   │   ├── yfinance_service.py       # yfinance fallback (growth estimates, forward PE)
│   │   │   └── aggregator.py             # Merges data from both sources into unified schema
│   │   ├── models/
│   │   │   └── schemas.py                # Pydantic models for request/response validation
│   │   └── config.py                     # Environment variables, API keys
│   ├── requirements.txt
│   ├── .env.example                      # FINNHUB_API_KEY=your_key_here
│   └── Dockerfile                        # For Railway deployment
│
├── .gitignore
└── README.md
```

---

## 4. Data Layer — Sources & Endpoints

### 4.1 Finnhub.io (Primary Source)

**Setup**: Sign up at https://finnhub.io → copy free API key → set as `FINNHUB_API_KEY` env var.

| Data Point | Endpoint | Example Call |
|-----------|----------|-------------|
| Current price + % change | `GET /quote?symbol={ticker}` | `GET /quote?symbol=NVDA&token={key}` |
| Analyst consensus breakdown | `GET /stock/recommendation?symbol={ticker}` | Returns array of monthly snapshots with `strongBuy`, `buy`, `hold`, `sell`, `strongSell` counts |
| Price targets | `GET /stock/price-target?symbol={ticker}` | Returns `targetHigh`, `targetLow`, `targetMean`, `targetMedian`, `lastUpdated` |
| EPS estimates | `GET /stock/eps-estimate?symbol={ticker}&freq=annual` | Forward EPS consensus estimate |
| Revenue estimates | `GET /stock/revenue-estimate?symbol={ticker}&freq=annual` | Forward revenue consensus estimate |

**Rate limit**: 60 calls/minute on free tier. With 5 endpoints × 8 tickers = 40 calls per full dashboard load. Stays within limit.

#### Example Finnhub Response: `/stock/recommendation?symbol=NVDA`

```json
[
  {
    "buy": 12,
    "hold": 4,
    "period": "2025-03-01",
    "sell": 0,
    "strongBuy": 38,
    "strongSell": 0,
    "symbol": "NVDA"
  }
]
```

> **Implementation note**: This returns an array sorted by date descending. Always use index `[0]` for the most recent month's consensus.

#### Example Finnhub Response: `/stock/price-target?symbol=NVDA`

```json
{
  "lastUpdated": "2025-03-10",
  "symbol": "NVDA",
  "targetHigh": 1200.00,
  "targetLow": 850.00,
  "targetMean": 920.45,
  "targetMedian": 915.00
}
```

#### Example Finnhub Response: `/quote?symbol=NVDA`

```json
{
  "c": 875.28,
  "d": 35.67,
  "dp": 4.25,
  "h": 880.50,
  "l": 842.10,
  "o": 843.00,
  "pc": 839.61,
  "t": 1710000000
}
```

> **Field mapping**: `c` = current price, `dp` = daily percent change, `d` = dollar change, `h` = high, `l` = low, `o` = open, `pc` = previous close.

### 4.2 yfinance (Supplementary Source — Growth Estimates)

yfinance is a Python library that scrapes Yahoo Finance. No API key required. Used for data Finnhub doesn't provide on free tier.

```python
import yfinance as yf

ticker = yf.Ticker("NVDA")

# Growth estimates
ticker.growth_estimates
# Returns DataFrame with columns like:
# currentEstimate, 7daysAgo, 30daysAgo, 60daysAgo, 90daysAgo
# Rows: "Stock", "Industry", "Sector", "S&P 500"

# Forward EPS / PE
ticker.info["forwardEps"]       # e.g., 4.15
ticker.info["forwardPE"]        # e.g., 210.9
ticker.info["trailingPE"]       # e.g., 65.3

# Revenue/earnings growth
ticker.info["revenueGrowth"]    # e.g., 0.783 (78.3%)
ticker.info["earningsGrowth"]   # e.g., 1.09 (109%)

# Analyst recommendation summary
ticker.recommendations_summary
# DataFrame with columns: strongBuy, buy, hold, sell, strongSell
```

> **Implementation note**: `yfinance` can be slow (1-3 sec per ticker). Batch requests using `yf.Tickers("NVDA PLTR TSLA")` or use `asyncio` + `concurrent.futures.ThreadPoolExecutor` to parallelize.

### 4.3 Sentiment (Optional Enhancement)

Two approaches, both free:

**Option A — Finnhub News Sentiment (built-in)**
```
GET /news-sentiment?symbol={ticker}&token={key}
```
Returns: `buzz` score, `sentiment` score (-1 to 1), `companyNewsScore`, `sectorAverageNewsScore`.

**Option B — Claude-Powered Custom Sentiment**
1. Backend pulls recent headlines via Finnhub `/company-news?symbol={ticker}&from=2025-03-01&to=2025-03-13`
2. Batch headlines into a single Claude API call:
```python
prompt = f"""Analyze these {ticker} headlines and return JSON:
{{"sentiment": "bullish"|"neutral"|"bearish", "score": float(-1 to 1), "summary": "one sentence"}}
Headlines: {headlines_text}"""
```
3. Uses Claude Sonnet — fractions of a cent per call.

---

## 5. Backend API Contract

### `POST /api/stocks`

**Request Body**:
```json
{
  "tickers": ["NVDA", "PLTR", "TSLA"]
}
```

**Response Body** (unified schema per ticker):
```json
{
  "data": {
    "NVDA": {
      "ticker": "NVDA",
      "name": "NVIDIA Corp",
      "price": {
        "current": 875.28,
        "change_pct": 4.25,
        "change_dollar": 35.67,
        "high": 880.50,
        "low": 842.10
      },
      "consensus": {
        "overall": "Strong Buy",
        "strong_buy": 38,
        "buy": 12,
        "hold": 4,
        "sell": 0,
        "strong_sell": 0,
        "total_analysts": 54
      },
      "price_target": {
        "low": 850.00,
        "avg": 920.45,
        "median": 915.00,
        "high": 1200.00,
        "upside_pct": 5.16
      },
      "growth": {
        "eps_forward": 4.15,
        "forward_pe": 210.9,
        "revenue_growth_pct": 78.3,
        "earnings_growth_pct": 109.0
      },
      "sentiment": {
        "score": 0.72,
        "label": "bullish",
        "summary": "Analysts remain highly optimistic on AI infrastructure demand."
      }
    }
  },
  "meta": {
    "fetched_at": "2025-03-13T14:30:00Z",
    "source": "finnhub+yfinance"
  }
}
```

### Consensus Label Derivation Logic

The `overall` consensus label is computed from the ratings breakdown, not pulled from an API:

```python
def derive_consensus(strong_buy, buy, hold, sell, strong_sell):
    total = strong_buy + buy + hold + sell + strong_sell
    if total == 0:
        return "Hold"
    
    score = (
        (strong_buy * 5) + (buy * 4) + (hold * 3) + (sell * 2) + (strong_sell * 1)
    ) / total
    
    if score >= 4.5:
        return "Strong Buy"
    elif score >= 3.5:
        return "Buy"
    elif score >= 2.5:
        return "Hold"
    elif score >= 1.5:
        return "Sell"
    else:
        return "Strong Sell"
```

---

## 6. Frontend Data Flow

```
App.jsx
 ├── useWatchlist()                    # reads/writes localStorage
 │    └── state: string[]              # ["NVDA", "PLTR", "TSLA"]
 │
 ├── ListManager                       # Page 1
 │    ├── SearchBar                    # filters SUPPORTED_TICKERS constant
 │    ├── TickerChip[]                 # map over watchlist
 │    └── "Apply" button → navigate("/dashboard")
 │
 └── Dashboard                         # Page 2
      ├── useStockData(tickers)        # POST /api/stocks, returns { data, loading, error }
      │    └── on mount: fetch data
      │    └── on tickers change: refetch
      ├── StockCard[]                  # map over data
      │    ├── ConsensusDonut          # Recharts PieChart, inner label
      │    ├── RatingsBreakdown        # 5-row legend
      │    ├── GrowthEstimates         # EPS, revenue growth, forward PE
      │    └── PriceTargetBar          # low/avg/high linear slider
      └── SummaryFooter               # aggregate stats
```

### `useWatchlist` Hook

```javascript
function useWatchlist(maxTickers = 8) {
  const [tickers, setTickers] = useState(() => {
    const saved = localStorage.getItem("signalstack_watchlist");
    return saved ? JSON.parse(saved) : ["NVDA", "PLTR", "TSLA"];
  });

  useEffect(() => {
    localStorage.setItem("signalstack_watchlist", JSON.stringify(tickers));
  }, [tickers]);

  const addTicker = (t) => {
    if (!tickers.includes(t) && tickers.length < maxTickers) {
      setTickers(prev => [...prev, t]);
    }
  };

  const removeTicker = (t) => setTickers(prev => prev.filter(x => x !== t));

  return { tickers, addTicker, removeTicker, setTickers };
}
```

### `useStockData` Hook

```javascript
function useStockData(tickers) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tickers.length === 0) return;
    
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/stocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers }),
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(json => setData(json.data))
      .catch(err => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [tickers]);

  return { data, loading, error };
}
```

---

## 7. Backend Implementation

### `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import stocks

app = FastAPI(title="SignalStack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://signalstack.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/api")
```

### `routers/stocks.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.aggregator import fetch_all_stock_data

router = APIRouter()

class StockRequest(BaseModel):
    tickers: list[str]  # max 8

@router.post("/stocks")
async def get_stocks(req: StockRequest):
    tickers = [t.upper().strip() for t in req.tickers[:8]]
    data = await fetch_all_stock_data(tickers)
    return {
        "data": data,
        "meta": {
            "fetched_at": datetime.utcnow().isoformat() + "Z",
            "source": "finnhub+yfinance"
        }
    }
```

### `services/aggregator.py`

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from app.services.finnhub_service import (
    get_quote, get_recommendations, get_price_target, get_eps_estimate
)
from app.services.yfinance_service import get_growth_data

executor = ThreadPoolExecutor(max_workers=8)

async def fetch_single_ticker(ticker: str) -> dict:
    loop = asyncio.get_event_loop()

    # Finnhub calls (async-friendly via httpx or aiohttp)
    quote, recs, targets, eps = await asyncio.gather(
        get_quote(ticker),
        get_recommendations(ticker),
        get_price_target(ticker),
        get_eps_estimate(ticker),
    )

    # yfinance call (blocking, run in thread pool)
    growth = await loop.run_in_executor(executor, get_growth_data, ticker)

    # Merge into unified schema
    latest_rec = recs[0] if recs else {}
    total = sum([
        latest_rec.get("strongBuy", 0), latest_rec.get("buy", 0),
        latest_rec.get("hold", 0), latest_rec.get("sell", 0),
        latest_rec.get("strongSell", 0)
    ])

    return {
        "ticker": ticker,
        "name": growth.get("name", ticker),
        "price": {
            "current": quote.get("c", 0),
            "change_pct": quote.get("dp", 0),
            "change_dollar": quote.get("d", 0),
            "high": quote.get("h", 0),
            "low": quote.get("l", 0),
        },
        "consensus": {
            "overall": derive_consensus(**{k: latest_rec.get(k, 0) 
                       for k in ["strongBuy", "buy", "hold", "sell", "strongSell"]}),
            "strong_buy": latest_rec.get("strongBuy", 0),
            "buy": latest_rec.get("buy", 0),
            "hold": latest_rec.get("hold", 0),
            "sell": latest_rec.get("sell", 0),
            "strong_sell": latest_rec.get("strongSell", 0),
            "total_analysts": total,
        },
        "price_target": {
            "low": targets.get("targetLow", 0),
            "avg": targets.get("targetMean", 0),
            "median": targets.get("targetMedian", 0),
            "high": targets.get("targetHigh", 0),
            "upside_pct": round(
                ((targets.get("targetMean", 0) - quote.get("c", 1)) / quote.get("c", 1)) * 100, 2
            ),
        },
        "growth": growth,
    }

async def fetch_all_stock_data(tickers: list[str]) -> dict:
    results = await asyncio.gather(*[fetch_single_ticker(t) for t in tickers])
    return {r["ticker"]: r for r in results}
```

### `services/finnhub_service.py`

```python
import httpx
from app.config import FINNHUB_API_KEY

BASE = "https://finnhub.io/api/v1"

async def _get(endpoint: str, params: dict) -> dict:
    params["token"] = FINNHUB_API_KEY
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE}{endpoint}", params=params)
        resp.raise_for_status()
        return resp.json()

async def get_quote(ticker: str):
    return await _get("/quote", {"symbol": ticker})

async def get_recommendations(ticker: str):
    return await _get("/stock/recommendation", {"symbol": ticker})

async def get_price_target(ticker: str):
    return await _get("/stock/price-target", {"symbol": ticker})

async def get_eps_estimate(ticker: str):
    return await _get("/stock/eps-estimate", {"symbol": ticker, "freq": "annual"})
```

### `services/yfinance_service.py`

```python
import yfinance as yf

def get_growth_data(ticker: str) -> dict:
    t = yf.Ticker(ticker)
    info = t.info
    return {
        "name": info.get("shortName", ticker),
        "eps_forward": info.get("forwardEps"),
        "forward_pe": info.get("forwardPE"),
        "revenue_growth_pct": round((info.get("revenueGrowth", 0) or 0) * 100, 1),
        "earnings_growth_pct": round((info.get("earningsGrowth", 0) or 0) * 100, 1),
    }
```

---

## 8. Design System

### Color Tokens

```css
:root {
  --bg-primary: #050505;
  --bg-card: rgba(15, 25, 18, 0.92);
  --bg-card-hover: rgba(20, 35, 24, 0.95);
  --border-subtle: rgba(34, 197, 94, 0.15);
  --border-active: rgba(34, 197, 94, 0.4);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-dim: #475569;
  --accent-green: #22c55e;
  --accent-green-dark: #16a34a;
  --accent-red: #ef4444;
  --accent-yellow: #eab308;
  --strong-buy: #22c55e;
  --buy: #4ade80;
  --hold: #eab308;
  --sell: #ef4444;
  --strong-sell: #dc2626;
}
```

### Typography

- **Font**: JetBrains Mono (monospace throughout — terminal aesthetic)
- **Prices**: 32px, weight 800, letter-spacing -0.02em
- **Labels**: 11px, weight 600, uppercase, letter-spacing 0.05em
- **Body**: 13px, weight 500

### Card Specifications

- Border-radius: 16px
- Background: linear-gradient 145deg, `--bg-card`
- Border: 1px solid `--border-subtle`
- Top edge glow: 1px linear-gradient with `--accent-green` at 30% opacity
- Backdrop-filter: blur(20px)
- Min-width: 260px, max-width: 340px, flex: 1 1 280px

---

## 9. Build & Deploy

### Local Development

```bash
# Frontend
cd frontend
npm create vite@latest . -- --template react
npm install recharts framer-motion lucide-react axios
npm install -D tailwindcss @tailwindcss/vite
npm run dev                    # → http://localhost:5173

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn httpx yfinance python-dotenv
cp .env.example .env           # add FINNHUB_API_KEY
uvicorn app.main:app --reload  # → http://localhost:8000
```

### Production Deployment

**Frontend → Vercel**
1. Push `frontend/` to GitHub
2. Import in Vercel dashboard
3. Set `VITE_API_URL` env var to backend URL
4. Auto-deploys on push

**Backend → Railway**
1. Push `backend/` to GitHub
2. Import in Railway dashboard
3. Set `FINNHUB_API_KEY` env var
4. Railway auto-detects Python, runs `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Alternative: AWS Deployment (Portfolio Flex)

```
frontend/ → S3 static site → CloudFront CDN
backend/  → Docker → ECR → ECS Fargate (or EC2)
           → API Gateway → Lambda (if going serverless)
```

This pairs well with your existing Terraform + AWS experience from DesignCode.

---

## 10. Implementation Order

### Phase 1: Frontend Shell ✅ (Completed)

React artifact with mock data, both pages, all UI components.

### Phase 2: Backend + API Integration

1. Scaffold FastAPI project with file structure above
2. Implement `finnhub_service.py` — test each endpoint individually with `httpx`
3. Implement `yfinance_service.py` — test `get_growth_data()` standalone
4. Implement `aggregator.py` — merge both sources into unified schema
5. Wire up `POST /api/stocks` route
6. Test full backend with `curl` or Swagger UI at `/docs`

### Phase 3: Frontend ↔ Backend Wiring

1. Create `useStockData` hook with real fetch calls
2. Replace mock `STOCK_DB` with API response mapping
3. Add loading skeletons and error states to `StockCard`
4. Wire `useWatchlist` with `localStorage` persistence
5. Add ticker search autocomplete (can use a static list or Finnhub `/search` endpoint)

### Phase 4: Polish & Ship

1. Framer Motion — staggered card animations, page transitions, background pulse
2. Add growth estimate fields to `StockCard` (EPS, revenue growth, forward PE)
3. Optional: Claude-powered sentiment summary per ticker
4. Error boundary + rate limit handling (retry with backoff)
5. Deploy frontend to Vercel, backend to Railway
6. README with screenshots and architecture diagram

---

## 11. Environment Variables

### Backend (`.env`)

```
FINNHUB_API_KEY=your_finnhub_api_key_here
ANTHROPIC_API_KEY=sk-ant-xxx              # optional, for Claude sentiment
ENV=development
PORT=8000
```

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:8000        # local
# VITE_API_URL=https://signalstack-api.up.railway.app  # production
```

---

## 12. Supported Tickers (Initial Set)

For the search autocomplete, start with S&P 500 top holdings. The backend accepts any valid ticker symbol, but the frontend search should offer these as suggestions:

```
NVDA, PLTR, TSLA, AAPL, MSFT, AMZN, META, GOOGL, AMD, SOFI,
NFLX, CRM, INTC, UBER, COIN, SNAP, RIVN, SHOP, SQ, PYPL,
JPM, GS, BAC, V, MA, DIS, NKE, COST, WMT, HD
```

Expandable later by querying Finnhub's `/search?q={query}` endpoint for dynamic autocomplete.
