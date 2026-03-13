import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CONSENSUS_COLORS, CONSENSUS_LABELS, type StockRatings } from "../lib/mockData";

interface ConsensusDonutProps {
  ratings: StockRatings;
  consensus: string;
  size?: number;
}

export default function ConsensusDonut({
  ratings,
  consensus,
  size = 130,
}: ConsensusDonutProps) {
  const data = [
    { name: "Strong Buy", value: ratings.strongBuy, color: CONSENSUS_COLORS.strongBuy },
    { name: "Buy", value: ratings.buy, color: CONSENSUS_COLORS.buy },
    { name: "Hold", value: ratings.hold, color: CONSENSUS_COLORS.hold },
    { name: "Sell", value: ratings.sell, color: CONSENSUS_COLORS.sell },
    { name: "Strong Sell", value: ratings.strongSell, color: CONSENSUS_COLORS.strongSell },
  ].filter((d) => d.value > 0);

  const label = CONSENSUS_LABELS[consensus] ?? CONSENSUS_LABELS["Hold"];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.33}
            outerRadius={size * 0.46}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-extrabold text-center leading-[1.1] tracking-[0.02em]"
          style={{
            fontSize: consensus.length > 5 ? 11 : 13,
            color: label.bg,
            maxWidth: size * 0.5,
          }}
        >
          {consensus}
        </span>
      </div>
    </div>
  );
}
