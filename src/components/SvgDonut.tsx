import type { StockRatings } from "../types";

interface SvgDonutProps {
  ratings: StockRatings;
  consensus: string;
  size?: number;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 8;
const VIEW_SIZE = 100;

function getConsensusColor(consensus: string): string {
  switch (consensus) {
    case "Strong Buy":
    case "Buy":
      return "#4be277";
    case "Hold":
      return "#f7bf1e";
    case "Sell":
    case "Strong Sell":
      return "#ffb3ad";
    default:
      return "#4be277";
  }
}

export default function SvgDonut({ ratings, consensus, size = 100 }: SvgDonutProps) {
  const green = ratings.strongBuy + ratings.buy;
  const yellow = ratings.hold;
  const red = ratings.sell + ratings.strongSell;
  const total = green + yellow + red;

  if (total === 0) return null;

  const segments = [
    { value: green, color: "#22c55e" },
    { value: yellow, color: "#eab308" },
    { value: red, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const len = (seg.value / total) * CIRCUMFERENCE;
    const gap = 4;
    const arc = {
      dasharray: `${Math.max(0, len - gap)} ${CIRCUMFERENCE - Math.max(0, len - gap)}`,
      dashoffset: -offset - gap / 2,
      color: seg.color,
    };
    offset += len;
    return arc;
  });

  const consensusColor = getConsensusColor(consensus);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} width={size} height={size}>
        {/* Background track */}
        <circle
          cx={VIEW_SIZE / 2}
          cy={VIEW_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={VIEW_SIZE / 2}
            cy={VIEW_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={arc.dasharray}
            strokeDashoffset={arc.dashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${VIEW_SIZE / 2} ${VIEW_SIZE / 2})`}
          />
        ))}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold text-center leading-tight"
          style={{
            fontSize: size * 0.12,
            color: consensusColor,
          }}
        >
          {consensus}
        </span>
      </div>
    </div>
  );
}
