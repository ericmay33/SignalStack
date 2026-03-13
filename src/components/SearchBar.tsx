import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { STOCK_DB, ALL_TICKERS } from "../lib/mockData";

interface SearchBarProps {
  tickers: string[];
  onAdd: (ticker: string) => void;
  count: number;
}

export default function SearchBar({ tickers, onAdd, count }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.length > 0) {
      const upper = val.toUpperCase();
      setSuggestions(
        ALL_TICKERS.filter(
          (t) =>
            (t.includes(upper) ||
              STOCK_DB[t].name.toUpperCase().includes(upper)) &&
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
    <div className="relative mb-4">
      <div className="flex items-center gap-2.5 bg-[rgba(15,25,18,0.9)] border border-green-500/20 rounded-xl px-4 py-3 transition-colors duration-200">
        <Search size={16} color="#22c55e" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) handleAdd(suggestions[0]);
          }}
          placeholder="Search ticker or company name..."
          className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm font-medium font-mono"
        />
        <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">
          {count}/8
        </span>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-[rgba(10,18,12,0.97)] border border-green-500/20 rounded-[10px] mt-1 overflow-hidden z-50 backdrop-blur-xl">
          {suggestions.map((t) => (
            <div
              key={t}
              onClick={() => handleAdd(t)}
              className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-green-500/[0.08] border-b border-white/[0.04] last:border-0 transition-colors duration-150"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{STOCK_DB[t].logo}</span>
                <span className="text-slate-100 font-bold text-[13px] font-mono">
                  {t}
                </span>
                <span className="text-slate-500 text-xs">
                  {STOCK_DB[t].name}
                </span>
              </div>
              <Plus size={14} color="#22c55e" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
