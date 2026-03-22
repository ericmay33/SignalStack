import type { StockData } from "../types";

interface TickerChipProps {
  ticker: string;
  data: StockData;
  onRemove: () => void;
  index: number;
}

export default function TickerChip({ ticker, data, onRemove, index }: TickerChipProps) {
  const isUp = data.change >= 0;

  return (
    <div
      className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-3 animate-fade-slide-in hover:border-primary/20 transition-colors"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* $ icon box */}
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-primary font-bold text-sm">$</span>
      </div>

      {/* Ticker + price */}
      <div className="flex-1 min-w-0">
        <div className="text-on-surface font-bold text-sm tracking-wide">
          {ticker}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 font-medium">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className={`font-semibold ${isUp ? "text-primary" : "text-red-400"}`}>
            {isUp ? "+" : ""}{data.change.toFixed(2)}%
          </span>
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
