interface PriceTargetBarProps {
  low: number;
  avg: number;
  high: number;
  current: number;
}

export default function PriceTargetBar({
  low,
  avg,
  high,
  current,
}: PriceTargetBarProps) {
  const range = high - low;
  const avgPos = ((avg - low) / range) * 100;
  const curPos = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const upside = (((avg - current) / current) * 100).toFixed(1);
  const isUp = avg >= current;

  return (
    <div className="w-full mt-1.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] text-slate-400 font-semibold tracking-[0.05em] uppercase">
          Price targets
        </span>
        <span
          className={`text-[11px] font-bold ${isUp ? "text-green-500" : "text-red-500"}`}
        >
          {isUp ? "Upside" : "Downside"} to Avg: {isUp ? "+" : ""}
          {upside}%
        </span>
      </div>

      <div className="relative h-[6px] rounded-[3px] bg-white/[0.08] mb-1">
        {/* Colored fill between current price and avg */}
        <div
          className="absolute h-full rounded-[3px]"
          style={{
            left: `${Math.min(curPos, avgPos)}%`,
            width: `${Math.abs(avgPos - curPos)}%`,
            background: isUp
              ? "linear-gradient(90deg, #22c55e88, #22c55e)"
              : "linear-gradient(90deg, #ef444488, #ef4444)",
          }}
        />
        {/* Current price triangle indicator */}
        <div
          className="absolute w-0 h-0"
          style={{
            left: `${curPos}%`,
            top: -5,
            transform: "translateX(-50%)",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `7px solid ${isUp ? "#22c55e" : "#ef4444"}`,
          }}
        />
        {/* Average price dot */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-green-500"
          style={{
            left: `${avgPos}%`,
            top: -2,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-medium">
        <span>${low}</span>
        <span className="text-slate-400 font-bold">Avg ${avg}</span>
        <span>${high}</span>
      </div>
    </div>
  );
}
