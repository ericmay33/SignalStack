import { useState } from "react";

interface TickerChipProps {
  ticker: string;
  name: string;
  price: number | null;
  change: number | null;
  loading: boolean;
  logoUrl?: string;
  onRemove: () => void;
  index: number;
}

export default function TickerChip({ ticker, name, price, change, loading, logoUrl, onRemove, index }: TickerChipProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const isUp = (change ?? 0) >= 0;

  return (
    <div
      className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-3 animate-fade-slide-in hover:border-primary/20 transition-colors"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Logo / $ icon box */}
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt={ticker}
            className="w-full h-full object-contain p-1"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="text-primary font-bold text-sm">$</span>
        )}
      </div>

      {/* Ticker + price */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-on-surface font-bold text-sm tracking-wide">{ticker}</span>
          <span className="text-zinc-600 text-[11px] truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {loading || price === null ? (
            <span className="text-zinc-600 font-medium animate-pulse">Loading...</span>
          ) : (
            <>
              <span className="text-zinc-400 font-medium">
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`font-semibold ${isUp ? "text-primary" : "text-red-400"}`}>
                {isUp ? "+" : ""}{(change ?? 0).toFixed(2)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer bg-transparent border-none"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
