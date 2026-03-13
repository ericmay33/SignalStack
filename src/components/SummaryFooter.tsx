import { STOCK_DB } from "../lib/mockData";

interface SummaryFooterProps {
  tickers: string[];
}

export default function SummaryFooter({ tickers }: SummaryFooterProps) {
  const validTickers = tickers.filter((t) => STOCK_DB[t]);

  const avgUpside =
    validTickers.length > 0
      ? (
          validTickers.reduce((sum, t) => {
            const d = STOCK_DB[t];
            return sum + ((d.target.avg - d.price) / d.price) * 100;
          }, 0) / validTickers.length
        ).toFixed(1) + "%"
      : "0%";

  const strongBuys = validTickers.reduce(
    (sum, t) => sum + STOCK_DB[t].ratings.strongBuy,
    0
  );

  const totalAnalysts = validTickers.reduce((sum, t) => {
    const r = STOCK_DB[t].ratings;
    return sum + r.strongBuy + r.buy + r.hold + r.sell + r.strongSell;
  }, 0);

  const stats = [
    { label: "Avg Upside", value: avgUpside, color: "text-green-500" },
    { label: "Strong Buys", value: strongBuys, color: "text-green-500" },
    { label: "Total Analysts", value: totalAnalysts, color: "text-slate-400" },
  ];

  return (
    <div className="mt-6 px-5 py-3 bg-[rgba(15,25,18,0.7)] border border-green-500/10 rounded-[10px] flex justify-center gap-[30px] flex-wrap">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-lg font-extrabold font-mono ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.08em]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
