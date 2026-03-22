import SearchBar from "../components/SearchBar";
import TickerChip from "../components/TickerChip";
import { STOCK_DB, ALL_TICKERS } from "../lib/mockData";

interface ListManagerProps {
  tickers: string[];
  setTickers: (tickers: string[]) => void;
  onApply: () => void;
}

export default function ListManager({
  tickers,
  setTickers,
  onApply,
}: ListManagerProps) {
  const addTicker = (t: string) => {
    if (!tickers.includes(t) && tickers.length < 8) {
      setTickers([...tickers, t]);
    }
  };

  const removeTicker = (t: string) => {
    setTickers(tickers.filter((x) => x !== t));
  };

  const trendingTickers = ALL_TICKERS.filter((t) => !tickers.includes(t)).slice(0, 6);

  return (
    <div className="pt-20 pb-16 px-5 max-w-6xl mx-auto dot-grid-bg min-h-screen">
      {/* Title section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-on-surface font-headline uppercase">
            List Manager
          </h1>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md tabular-nums">
            [{String(tickers.length).padStart(2, "0")}]
          </span>
        </div>
        <p className="text-sm text-zinc-500 font-medium">
          Configure your real-time data stream stack
        </p>
      </div>

      {/* Bento grid: Search + chips on left, trending on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Search + Chips */}
        <div className="lg:col-span-2">
          <SearchBar tickers={tickers} onAdd={addTicker} count={tickers.length} />

          {/* Ticker chips grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 min-h-[60px]">
            {tickers.map((t, i) =>
              STOCK_DB[t] ? (
                <TickerChip
                  key={t}
                  ticker={t}
                  data={STOCK_DB[t]}
                  onRemove={() => removeTicker(t)}
                  index={i}
                />
              ) : null
            )}
          </div>

          {tickers.length === 0 && (
            <div className="text-zinc-600 text-sm font-medium py-4 italic text-center">
              Search and add tickers above to build your watchlist...
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={onApply}
            disabled={tickers.length === 0}
            className="w-full px-6 py-4 rounded-xl border-none flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
            style={{
              background:
                tickers.length > 0
                  ? "linear-gradient(135deg, #4be277 0%, #22c55e 100%)"
                  : "rgba(255,255,255,0.04)",
              color: tickers.length > 0 ? "#003915" : "#6b6b6b",
              cursor: tickers.length > 0 ? "pointer" : "not-allowed",
              boxShadow:
                tickers.length > 0
                  ? "0 0 30px rgba(75,226,119,0.25), 0 0 80px rgba(75,226,119,0.08)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (tickers.length > 0) {
                (e.target as HTMLElement).style.boxShadow =
                  "0 0 40px rgba(75,226,119,0.4), 0 0 100px rgba(75,226,119,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (tickers.length > 0) {
                (e.target as HTMLElement).style.boxShadow =
                  "0 0 30px rgba(75,226,119,0.25), 0 0 80px rgba(75,226,119,0.08)";
              }
            }}
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            Apply List to Dashboard
          </button>
        </div>

        {/* Right column: Trending Quick-Add */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
              Trending Quick-Add
            </h3>
            <div className="flex flex-col gap-1">
              {trendingTickers.map((t) => (
                <button
                  key={t}
                  onClick={() => addTicker(t)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-primary/[0.06] transition-colors cursor-pointer bg-transparent border-none group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      $
                    </span>
                    <div>
                      <span className="text-on-surface font-semibold text-sm block">
                        {t}
                      </span>
                      <span className="text-zinc-600 text-[11px]">
                        {STOCK_DB[t]?.name}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-zinc-600 group-hover:text-primary transition-colors">
                    add_circle
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
