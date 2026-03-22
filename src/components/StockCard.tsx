import { useState, useEffect } from "react";
import SvgDonut from "./SvgDonut";
import LogoBox from "./LogoBox";
import PriceTargetBar from "./PriceTargetBar";
import type { StockData } from "../types";

interface StockCardProps {
  ticker: string;
  data: StockData;
  delay?: number;
}

const ratingRows = [
  { label: "Strong Buy", key: "strongBuy" as const, color: "#22c55e" },
  { label: "Buy", key: "buy" as const, color: "#4ade80" },
  { label: "Hold", key: "hold" as const, color: "#eab308" },
  { label: "Sell", key: "sell" as const, color: "#ef4444" },
  { label: "Strong Sell", key: "strongSell" as const, color: "#dc2626" },
];

export default function StockCard({ ticker, data, delay = 0 }: StockCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isUp = data.change >= 0;
  const total =
    data.ratings.strongBuy +
    data.ratings.buy +
    data.ratings.hold +
    data.ratings.sell +
    data.ratings.strongSell;

  return (
    <div
      className="glass-panel rounded-2xl p-5 hover:border-primary/20 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease",
      }}
    >
      {/* Header: Logo + Ticker + Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <LogoBox ticker={ticker} size={48} />
          <div>
            <div className="text-on-surface font-bold text-base tracking-wide">
              {ticker}
            </div>
            <div className="text-zinc-500 text-xs font-medium">
              {data.name}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-on-surface font-bold text-lg tabular-nums">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`text-xs font-semibold ${isUp ? "text-primary" : "text-red-400"}`}
          >
            {isUp ? "+" : ""}{data.change.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Donut + Ratings breakdown */}
      <div className="flex items-center gap-4 mb-5">
        <SvgDonut ratings={data.ratings} consensus={data.consensus} size={100} />
        <div className="flex-1 flex flex-col gap-1.5">
          {ratingRows.map((r) => {
            const count = data.ratings[r.key];
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={r.label} className="flex items-center gap-2 text-[11px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: r.color }}
                />
                <span className="text-zinc-500 font-medium flex-1 min-w-0">
                  {r.label}
                </span>
                <span className="text-on-surface font-bold tabular-nums w-5 text-right">
                  {count}
                </span>
                <span className="text-zinc-600 font-medium tabular-nums w-9 text-right">
                  {pct.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Target Bar */}
      <PriceTargetBar
        low={data.target.low}
        avg={data.target.avg}
        high={data.target.high}
        current={data.price}
      />
    </div>
  );
}
