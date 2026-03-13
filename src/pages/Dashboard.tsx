import { ArrowLeft, Search, Bell, Settings } from "lucide-react";
import StockCard from "../components/StockCard";
import SummaryFooter from "../components/SummaryFooter";
import { STOCK_DB } from "../lib/mockData";

interface DashboardProps {
  tickers: string[];
  onBack: () => void;
}

export default function Dashboard({ tickers, onBack }: DashboardProps) {
  return (
    <div className="relative z-[1] px-5 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-lg px-3.5 py-2 text-slate-400 text-xs font-semibold cursor-pointer uppercase tracking-[0.05em] hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-500 transition-all duration-150"
        >
          <ArrowLeft size={14} />
          Back to List Manager
        </button>

        {/* Active ticker chips */}
        <div className="flex items-center gap-1.5 bg-[rgba(15,25,18,0.8)] border border-green-500/15 rounded-[10px] px-3.5 py-1.5">
          <Search size={13} color="#64748b" />
          {tickers.map((t) => (
            <span
              key={t}
              className="bg-green-500/[0.12] rounded-[6px] px-2 py-[3px] text-[11px] font-bold text-slate-200 font-mono flex items-center gap-1"
            >
              <span className="text-[10px]">{STOCK_DB[t]?.logo}</span>
              {t}
            </span>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex gap-2.5 items-center">
          <Bell size={16} color="#64748b" className="cursor-pointer" />
          <Settings size={16} color="#64748b" className="cursor-pointer" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap gap-4 justify-center">
        {tickers.map(
          (t, i) =>
            STOCK_DB[t] && (
              <StockCard key={t} ticker={t} data={STOCK_DB[t]} delay={i * 100} />
            )
        )}
      </div>

      {/* Summary footer */}
      <SummaryFooter tickers={tickers} />
    </div>
  );
}
