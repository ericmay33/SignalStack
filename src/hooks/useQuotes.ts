import { useState, useEffect } from "react";
import type { StockData } from "../types";
import { fetchStockData } from "../lib/api";

/**
 * Lightweight hook that fetches real price/change data for the
 * ListManager ticker chips. Returns a map of ticker → StockData
 * (only price and change are used by TickerChip).
 */
export function useQuotes(tickers: string[]) {
  const [quotes, setQuotes] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState(false);

  const key = tickers.join(",");

  useEffect(() => {
    if (tickers.length === 0) {
      setQuotes({});
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetchStockData(tickers, controller.signal)
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [key, tickers]);

  return { quotes, loading };
}
