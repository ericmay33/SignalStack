import type { StockData } from "../types";

interface FooterProps {
  data?: Record<string, StockData> | null;
}

export default function Footer({ data }: FooterProps) {
  const entries = data ? Object.values(data) : [];

  const avgUpside =
    entries.length > 0
      ? (
          entries.reduce((sum, d) => {
            return d.target.avg && d.price
              ? sum + ((d.target.avg - d.price) / d.price) * 100
              : sum;
          }, 0) / entries.length
        ).toFixed(1)
      : "0.0";

  const totalAnalysts = entries.reduce((sum, d) => {
    const r = d.ratings;
    return sum + r.strongBuy + r.buy + r.hold + r.sell + r.strongSell;
  }, 0);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-xl border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-[11px]">
        {/* Left */}
        <div className="flex items-center gap-2 text-zinc-600 font-medium">
          <span className="text-zinc-500">SignalStack Terminal v1.0.4</span>
          <span className="text-zinc-700">•</span>
          <span className="text-primary/70">Market Open</span>
        </div>

        {/* Center stats */}
        <div className="hidden sm:flex items-center gap-6 text-zinc-500 font-medium">
          <span>
            Avg Upside:{" "}
            <span className={`font-semibold ${Number(avgUpside) >= 0 ? "text-primary" : "text-red-400"}`}>
              {Number(avgUpside) >= 0 ? "+" : ""}{avgUpside}%
            </span>
          </span>
          <span>
            Total Analysts:{" "}
            <span className="text-on-surface font-semibold">{totalAnalysts}</span>
          </span>
          <span>
            System Latency:{" "}
            <span className="text-on-surface font-semibold">14ms</span>
          </span>
        </div>

        {/* Right: Live indicator */}
        <div className="flex items-center gap-2 text-zinc-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-live" />
          <span>Live Feed</span>
        </div>
      </div>
    </footer>
  );
}
