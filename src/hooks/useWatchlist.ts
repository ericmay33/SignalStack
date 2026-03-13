import { useState, useEffect } from "react";

const STORAGE_KEY = "signalstack_watchlist";
const MAX_TICKERS = 8;

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as string[]) : ["NVDA", "PLTR", "TSLA"];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickers));
  }, [tickers]);

  const addTicker = (t: string) => {
    if (!tickers.includes(t) && tickers.length < MAX_TICKERS) {
      setTickers((prev) => [...prev, t]);
    }
  };

  const removeTicker = (t: string) => {
    setTickers((prev) => prev.filter((x) => x !== t));
  };

  return { tickers, addTicker, removeTicker, setTickers };
}
