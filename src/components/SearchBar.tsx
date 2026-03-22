import { useState, useRef, useEffect } from "react";
import { TICKER_LIST, SP500_TICKERS } from "../lib/tickers";

interface SearchBarProps {
  tickers: string[];
  onAdd: (ticker: string) => void;
  count: number;
}

export default function SearchBar({ tickers, onAdd, count }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.length > 0) {
      const upper = val.toUpperCase();
      setSuggestions(
        TICKER_LIST.filter(
          (t) =>
            (t.includes(upper) ||
              SP500_TICKERS[t].toUpperCase().includes(upper)) &&
            !tickers.includes(t)
        ).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleAdd = (t: string) => {
    onAdd(t);
    setSearch("");
    setSuggestions([]);
  };

  return (
    <div className={`relative transition-[margin] duration-200 ${suggestions.length > 0 ? "mb-56" : "mb-5"}`}>
      {/* Search input wrapper */}
      <div
        className={`flex items-center gap-3 glass-panel rounded-xl px-4 py-3.5 transition-all duration-200 ${
          focused ? "glow-green border-primary/30" : ""
        }`}
      >
        <span className="material-symbols-outlined text-primary text-[20px]">search</span>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) handleAdd(suggestions[0]);
          }}
          placeholder="SEARCH TICKER OR COMPANY..."
          className="flex-1 bg-transparent border-none outline-none text-on-surface text-sm font-medium placeholder:text-zinc-600 placeholder:uppercase"
        />
        <div className="hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-zinc-500 font-medium border border-white/10">
            CMD
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-zinc-500 font-medium border border-white/10">
            K
          </kbd>
        </div>
        <span className="text-[11px] text-zinc-600 font-semibold tabular-nums">
          {count}/8
        </span>
      </div>

      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50 bg-[#141414] border border-white/[0.08]">
          {suggestions.map((t) => (
            <div
              key={t}
              onClick={() => handleAdd(t)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-primary/[0.06] border-b border-white/[0.04] last:border-0 transition-colors duration-150 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary font-bold text-xs">$</span>
                <span className="text-on-surface font-bold text-sm">
                  {t}
                </span>
                <span className="text-zinc-500 text-xs">
                  {SP500_TICKERS[t]}
                </span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-zinc-600 group-hover:text-primary transition-colors">
                add_circle
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
