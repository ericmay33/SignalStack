import StockCard from "../components/StockCard";
import { STOCK_DB } from "../lib/mockData";
import type { StockData } from "../types";

interface DashboardProps {
  tickers: string[];
  data: Record<string, StockData> | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export default function Dashboard({ tickers, data, loading, error, retry }: DashboardProps) {
  // Merge: use API data when available, fill in logo/color from mock
  const displayData: Record<string, StockData> | null = data
    ? Object.fromEntries(
        Object.entries(data).map(([ticker, d]) => [
          ticker,
          {
            ...d,
            logo: d.logo || STOCK_DB[ticker]?.logo || "",
            color: d.color || STOCK_DB[ticker]?.color || "",
          },
        ])
      )
    : null;

  return (
    <div className="pt-20 pb-16 px-5 max-w-7xl mx-auto min-h-screen">
      {/* Title section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-on-surface font-headline uppercase mb-1">
          SignalStack <span className="text-zinc-600">|</span> Dashboard
        </h1>
        <p className="text-[11px] text-zinc-600 font-semibold uppercase tracking-[0.15em]">
          Real-time analyst terminal &bull; session active
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <span className="text-red-400 text-[13px] font-medium">
            {error} — showing {data ? "cached" : "mock"} data
          </span>
          <button
            onClick={retry}
            className="text-red-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer border-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading &&
          tickers.map((t) => (
            <div
              key={t}
              className="glass-panel rounded-2xl h-[380px] animate-pulse"
            />
          ))}

        {!loading &&
          displayData &&
          tickers.map(
            (t, i) =>
              displayData[t] && (
                <StockCard
                  key={t}
                  ticker={t}
                  data={displayData[t]}
                  delay={i * 80}
                />
              )
          )}
      </div>
    </div>
  );
}
