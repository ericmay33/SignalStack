import type { StockData } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Map a single ticker's API response (snake_case) to frontend StockData ──

interface ApiTickerData {
  ticker: string;
  name: string;
  price: {
    current: number;
    change_pct: number;
    change_dollar: number;
    high: number;
    low: number;
  };
  consensus: {
    overall: string;
    strong_buy: number;
    buy: number;
    hold: number;
    sell: number;
    strong_sell: number;
    total_analysts: number;
  };
  price_target: {
    low: number;
    avg: number;
    median: number;
    high: number;
    upside_pct: number;
  };
  growth: {
    eps_forward: number | null;
    forward_pe: number | null;
    revenue_growth_pct: number;
    earnings_growth_pct: number;
  };
}

interface ApiResponse {
  data: Record<string, ApiTickerData>;
  meta: { fetched_at: string; source: string };
}

export function mapApiTicker(d: ApiTickerData): StockData {
  return {
    name: d.name,
    price: d.price.current,
    change: d.price.change_pct,
    consensus: d.consensus.overall,
    ratings: {
      strongBuy: d.consensus.strong_buy,
      buy: d.consensus.buy,
      hold: d.consensus.hold,
      sell: d.consensus.sell,
      strongSell: d.consensus.strong_sell,
    },
    target: {
      low: d.price_target.low,
      avg: d.price_target.avg,
      high: d.price_target.high,
    },
    logo: "",
    color: "",
  };
}

export function mapApiResponse(
  apiData: Record<string, ApiTickerData>
): Record<string, StockData> {
  const result: Record<string, StockData> = {};
  for (const [ticker, d] of Object.entries(apiData)) {
    result[ticker] = mapApiTicker(d);
  }
  return result;
}

export async function fetchStockData(
  tickers: string[],
  signal?: AbortSignal
): Promise<Record<string, StockData>> {
  const resp = await fetch(`${API_BASE_URL}/api/stocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickers }),
    signal,
  });

  if (!resp.ok) {
    throw new Error(`API error: ${resp.status} ${resp.statusText}`);
  }

  const json: ApiResponse = await resp.json();
  return mapApiResponse(json.data);
}
