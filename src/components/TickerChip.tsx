import { X } from "lucide-react";
import { type StockData } from "../lib/mockData";

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
      className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-lg px-3 py-2 animate-fade-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="text-[13px]">{data.logo}</span>
      <span className="text-slate-200 font-bold text-[13px] font-mono">
        {ticker}
      </span>
      <span
        className={`text-[11px] font-semibold ${isUp ? "text-green-500" : "text-red-500"}`}
      >
        ${data.price}
      </span>
      <button
        onClick={onRemove}
        className="flex opacity-50 hover:opacity-100 transition-opacity duration-150 p-0.5 cursor-pointer bg-transparent border-none"
      >
        <X size={13} color="#ef4444" />
      </button>
    </div>
  );
}
