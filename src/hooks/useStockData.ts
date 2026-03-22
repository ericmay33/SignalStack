import { useState, useEffect, useMemo } from "react";
import type { StockData } from "../types";
import { fetchStockData } from "../lib/api";

interface FetchResult {
  data: Record<string, StockData> | null;
  error: string | null;
  fetchedKey: string;
  latencyMs: number | null;
}

export interface UseStockDataReturn {
  data: Record<string, StockData> | null;
  loading: boolean;
  error: string | null;
  latencyMs: number | null;
  retry: () => void;
}

export function useStockData(tickers: string[]): UseStockDataReturn {
  const [result, setResult] = useState<FetchResult>({
    data: null,
    error: null,
    fetchedKey: "",
    latencyMs: null,
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
    const start = performance.now();

    fetchStockData(tickers, controller.signal)
      .then((data) => {
        const latencyMs = Math.round(performance.now() - start);
        setResult({ data, error: null, fetchedKey: key, latencyMs });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;

        setResult({
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch stock data",
          fetchedKey: key,
          latencyMs: null,
        });
      });

    return () => controller.abort();
  }, [tickers, tickerKey, requestKey]);

  const data = useMemo(
    () => (tickers.length === 0 ? null : result.data),
    [tickers.length, result.data]
  );

  const retry = () => setRetryCount((c) => c + 1);

  return {
    data,
    loading,
    error: loading ? null : result.error,
    latencyMs: result.latencyMs,
    retry,
  };
}
