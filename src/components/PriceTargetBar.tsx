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
  const range = high - low || 1;
  const avgPos = Math.max(0, Math.min(100, ((avg - low) / range) * 100));
  const upside = current > 0 ? (((avg - current) / current) * 100).toFixed(1) : "0.0";
  const isUp = avg >= current;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
          Price Targets
        </span>
        <span
          className={`text-[10px] font-bold ${isUp ? "text-primary" : "text-red-400"}`}
        >
          {isUp ? "+" : ""}{upside}% {isUp ? "upside" : "downside"}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-1.5 rounded-full bg-white/[0.06] mb-2">
        {/* Gradient fill */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left: 0,
            width: `${avgPos}%`,
            background: "linear-gradient(90deg, rgba(75,226,119,0.2), rgba(75,226,119,0.5))",
          }}
        />
        {/* Avg dot */}
        <div
          className="absolute w-3 h-3 rounded-full bg-white border-2 top-1/2 -translate-y-1/2"
          style={{
            left: `${avgPos}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            borderColor: isUp ? "#4be277" : "#ef4444",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-zinc-600 font-medium uppercase">
        <span>Low ${low}</span>
        <span className="text-zinc-400 font-semibold">Avg ${avg}</span>
        <span>High ${high}</span>
      </div>
    </div>
  );
}
