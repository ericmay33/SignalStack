import { useState, useEffect, useMemo } from "react";
import type { StockData } from "../types";
import { fetchStockData } from "../lib/api";
import { STOCK_DB } from "../lib/mockData";

interface FetchResult {
  data: Record<string, StockData> | null;
  error: string | null;
  fetchedKey: string;
}

interface UseStockDataReturn {
  data: Record<string, StockData> | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useStockData(tickers: string[]): UseStockDataReturn {
  const [result, setResult] = useState<FetchResult>({
    data: null,
    error: null,
    fetchedKey: "",
  });
  const [retryCount, setRetryCount] = useState(0);

  const tickerKey = tickers.join(",");
  const requestKey = `${tickerKey}:${retryCount}`;

  // Loading is derived: we haven't received a result matching the current request
  const loading = tickers.length > 0 && result.fetchedKey !== requestKey;

  useEffect(() => {
    if (tickers.length === 0) return;

    const controller = new AbortController();
    const key = requestKey;

    fetchStockData(tickers, controller.signal)
      .then((data) => {
        setResult({ data, error: null, fetchedKey: key });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;

        // Fall back to mock data when API is unreachable
        const fallback: Record<string, StockData> = {};
        for (const t of tickers) {
          if (STOCK_DB[t]) fallback[t] = STOCK_DB[t];
        }

        setResult({
          data: Object.keys(fallback).length > 0 ? fallback : null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch stock data",
          fetchedKey: key,
        });
      });

    return () => controller.abort();
  }, [tickers, tickerKey, requestKey]);

  const data = useMemo(
    () => (tickers.length === 0 ? null : result.data),
    [tickers.length, result.data]
  );

  const retry = () => setRetryCount((c) => c + 1);

  return { data, loading, error: loading ? null : result.error, retry };
}
