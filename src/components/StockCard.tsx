import { useState, useEffect } from "react";
import ConsensusDonut from "./ConsensusDonut";
import PriceTargetBar from "./PriceTargetBar";
import { CONSENSUS_COLORS, type StockData } from "../lib/mockData";

interface StockCardProps {
  ticker: string;
  data: StockData;
  delay?: number;
}

const ratingKeys = [
  { label: "Strong Buy", key: "strongBuy" as const, colorKey: "strongBuy" },
  { label: "Buy", key: "buy" as const, colorKey: "buy" },
  { label: "Hold", key: "hold" as const, colorKey: "hold" },
  { label: "Sell", key: "sell" as const, colorKey: "sell" },
  { label: "Strong Sell", key: "strongSell" as const, colorKey: "strongSell" },
];

export default function StockCard({ ticker, data, delay = 0 }: StockCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isUp = data.change >= 0;

  return (
    <div
      className="relative overflow-hidden backdrop-blur-xl min-w-[260px] max-w-[340px] flex-[1_1_280px] px-[22px] py-5 rounded-2xl border border-green-500/15"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background:
          "linear-gradient(145deg, rgba(15,25,18,0.92) 0%, rgba(10,18,12,0.95) 100%)",
      }}
    >
      {/* Top edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)",
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{data.logo}</span>
            <span className="text-lg font-extrabold text-slate-100 tracking-[0.03em]">
              {ticker}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Full Comparison
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-semibold mt-[3px]">
          {ticker}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2.5 mb-3.5">
        <span
          className="text-[32px] font-extrabold text-slate-100 tracking-[-0.02em] font-mono"
        >
          ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span
          className={`text-sm font-bold ${isUp ? "text-green-500" : "text-red-500"}`}
        >
          {isUp ? "+" : ""}
          {data.change}%
        </span>
      </div>

      {/* Analyst Consensus label */}
      <span className="text-[11px] text-slate-400 font-semibold tracking-[0.05em] uppercase block mb-2.5">
        Analyst Consensus
      </span>

      {/* Donut + Ratings breakdown */}
      <div className="flex items-center gap-3.5 mb-4">
        <ConsensusDonut ratings={data.ratings} consensus={data.consensus} size={110} />
        <div className="flex flex-col gap-1">
          {ratingKeys.map((r) => (
            <div key={r.label} className="flex items-center gap-1.5 text-[11px]">
              <div
                className="w-[7px] h-[7px] rounded-full shrink-0"
                style={{ background: CONSENSUS_COLORS[r.colorKey] }}
              />
              <span className="text-slate-400 font-medium min-w-[70px]">
                {r.label}
              </span>
              <span className="text-slate-200 font-bold min-w-[18px] text-right">
                {data.ratings[r.key]}
              </span>
            </div>
          ))}
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
