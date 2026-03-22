import { useState, useEffect, useMemo } from "react";
import type { StockData } from "../types";
import { fetchStockData } from "../lib/api";

interface QuoteResult {
  data: Record<string, StockData>;
  fetchedKey: string;
}

export function useQuotes(tickers: string[]) {
  const [result, setResult] = useState<QuoteResult>({
    data: {},
    fetchedKey: "",
  });

  const key = tickers.join(",");
  const loading = tickers.length > 0 && result.fetchedKey !== key;

  useEffect(() => {
    if (tickers.length === 0) return;

    const controller = new AbortController();
    const currentKey = key;

    fetchStockData(tickers, controller.signal)
      .then((data) => {
        setResult({ data, fetchedKey: currentKey });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setResult({ data: {}, fetchedKey: currentKey });
      });

    return () => controller.abort();
  }, [key, tickers]);

  const quotes = useMemo(
    () => (tickers.length === 0 ? {} : result.data),
    [tickers.length, result.data]
  );

  return { quotes, loading };
}
