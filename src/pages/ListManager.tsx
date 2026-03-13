import { ArrowRight, LayoutGrid } from "lucide-react";
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

  const popularTickers = ALL_TICKERS.filter((t) => !tickers.includes(t)).slice(0, 6);

  return (
    <div className="max-w-[520px] mx-auto p-5 relative z-[1]">
      {/* Title */}
      <div className="text-center mb-[30px]">
        <h1 className="text-[28px] font-extrabold text-slate-100 tracking-[-0.02em] mb-1 font-mono">
          ⚡ SignalStack
        </h1>
        <p className="text-[13px] text-slate-500 font-medium">
          Layered analyst signals — build your list, compare consensus side-by-side
        </p>
      </div>

      {/* Search */}
      <SearchBar tickers={tickers} onAdd={addTicker} count={tickers.length} />

      {/* Ticker chips */}
      <div className="flex flex-wrap gap-2 mb-5 min-h-[40px]">
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
        {tickers.length === 0 && (
          <div className="text-slate-600 text-[13px] font-medium py-2.5 italic">
            Search and add tickers above to build your list...
          </div>
        )}
      </div>

      {/* Popular quick-add row */}
      <div className="mb-6">
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-[0.1em] block mb-2">
          Popular
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularTickers.map((t) => (
            <button
              key={t}
              onClick={() => addTicker(t)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[6px] px-2.5 py-[5px] text-slate-400 text-[11px] font-semibold cursor-pointer font-mono hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-500 transition-all duration-150"
            >
              + {t}
            </button>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <button
        onClick={onApply}
        disabled={tickers.length === 0}
        className="w-full px-6 py-3.5 rounded-xl border-none flex items-center justify-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.03em] font-mono transition-all duration-[250ms]"
        style={{
          background:
            tickers.length > 0
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "rgba(255,255,255,0.06)",
          color: tickers.length > 0 ? "#052e16" : "#475569",
          cursor: tickers.length > 0 ? "pointer" : "not-allowed",
        }}
      >
        <LayoutGrid size={16} />
        Apply List to Dashboard
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
