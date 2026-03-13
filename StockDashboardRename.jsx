import { useState, useEffect, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Search,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronDown,
  Settings,
  Bell,
  LayoutGrid,
  X,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────
const STOCK_DB = {
  NVDA: {
    name: "NVIDIA Corp",
    price: 875.28,
    change: 4.25,
    consensus: "Strong Buy",
    ratings: { strongBuy: 38, buy: 12, hold: 4, sell: 0, strongSell: 0 },
    target: { low: 850, avg: 920, high: 1200 },
    logo: "🟢",
    color: "#76b900",
  },
  PLTR: {
    name: "Palantir Technologies",
    price: 24.15,
    change: -1.2,
    consensus: "Hold",
    ratings: { strongBuy: 4, buy: 6, hold: 8, sell: 4, strongSell: 2 },
    target: { low: 15, avg: 21, high: 35 },
    logo: "⚫",
    color: "#f5f5f5",
  },
  TSLA: {
    name: "Tesla Inc",
    price: 175.22,
    change: 1.8,
    consensus: "Hold",
    ratings: { strongBuy: 12, buy: 15, hold: 22, sell: 6, strongSell: 4 },
    target: { low: 85, avg: 210, high: 380 },
    logo: "🔴",
    color: "#e82127",
  },
  AAPL: {
    name: "Apple Inc",
    price: 213.07,
    change: 0.67,
    consensus: "Buy",
    ratings: { strongBuy: 20, buy: 18, hold: 8, sell: 2, strongSell: 0 },
    target: { low: 180, avg: 230, high: 270 },
    logo: "⚪",
    color: "#a2aaad",
  },
  MSFT: {
    name: "Microsoft Corp",
    price: 442.57,
    change: 1.12,
    consensus: "Strong Buy",
    ratings: { strongBuy: 35, buy: 10, hold: 3, sell: 0, strongSell: 0 },
    target: { low: 400, avg: 480, high: 550 },
    logo: "🟦",
    color: "#00a4ef",
  },
  AMZN: {
    name: "Amazon.com Inc",
    price: 198.42,
    change: 2.34,
    consensus: "Strong Buy",
    ratings: { strongBuy: 40, buy: 8, hold: 2, sell: 0, strongSell: 0 },
    target: { low: 170, avg: 220, high: 260 },
    logo: "🟠",
    color: "#ff9900",
  },
  META: {
    name: "Meta Platforms",
    price: 523.18,
    change: -0.45,
    consensus: "Buy",
    ratings: { strongBuy: 28, buy: 14, hold: 6, sell: 1, strongSell: 0 },
    target: { low: 450, avg: 560, high: 650 },
    logo: "🔵",
    color: "#0668E1",
  },
  GOOGL: {
    name: "Alphabet Inc",
    price: 171.84,
    change: 0.93,
    consensus: "Strong Buy",
    ratings: { strongBuy: 30, buy: 12, hold: 5, sell: 1, strongSell: 0 },
    target: { low: 155, avg: 195, high: 230 },
    logo: "🔴",
    color: "#4285F4",
  },
  AMD: {
    name: "Advanced Micro Devices",
    price: 164.32,
    change: 3.18,
    consensus: "Buy",
    ratings: { strongBuy: 22, buy: 15, hold: 7, sell: 2, strongSell: 0 },
    target: { low: 140, avg: 190, high: 230 },
    logo: "🔴",
    color: "#ED1C24",
  },
  SOFI: {
    name: "SoFi Technologies",
    price: 9.87,
    change: -2.4,
    consensus: "Hold",
    ratings: { strongBuy: 3, buy: 5, hold: 9, sell: 3, strongSell: 1 },
    target: { low: 7, avg: 11, high: 15 },
    logo: "🟣",
    color: "#6C3EBF",
  },
};

const ALL_TICKERS = Object.keys(STOCK_DB);

const CONSENSUS_COLORS = {
  strongBuy: "#22c55e",
  buy: "#4ade80",
  hold: "#eab308",
  sell: "#ef4444",
  strongSell: "#dc2626",
};

const CONSENSUS_LABELS = {
  "Strong Buy": { bg: "#22c55e", text: "#022c22" },
  Buy: { bg: "#4ade80", text: "#052e16" },
  Hold: { bg: "#eab308", text: "#422006" },
  Sell: { bg: "#ef4444", text: "#450a0a" },
  "Strong Sell": { bg: "#dc2626", text: "#fff" },
};

// ─── Animated Background ─────────────────────────────────────────────
function CircuitBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background:
          "radial-gradient(ellipse at 30% 50%, #0a1a0f 0%, #060d08 40%, #050505 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.12 }}
      >
        <defs>
          <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[...Array(18)].map((_, i) => {
          const y = 40 + i * 60;
          const x1 = Math.random() * 200;
          const x2 = x1 + 200 + Math.random() * 600;
          return (
            <g key={i} filter="url(#glow)">
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="url(#cg1)"
                strokeWidth="1"
              />
              <circle cx={x1} cy={y} r="3" fill="#22c55e" />
              <circle cx={x2} cy={y} r="3" fill="#22c55e" />
              {i % 3 === 0 && (
                <line
                  x1={x2}
                  y1={y}
                  x2={x2}
                  y2={y + 60}
                  stroke="url(#cg1)"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(34,197,94,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

// ─── Donut Gauge ─────────────────────────────────────────────────────
function ConsensusDonut({ ratings, consensus, size = 130 }) {
  const data = [
    { name: "Strong Buy", value: ratings.strongBuy, color: CONSENSUS_COLORS.strongBuy },
    { name: "Buy", value: ratings.buy, color: CONSENSUS_COLORS.buy },
    { name: "Hold", value: ratings.hold, color: CONSENSUS_COLORS.hold },
    { name: "Sell", value: ratings.sell, color: CONSENSUS_COLORS.sell },
    { name: "Strong Sell", value: ratings.strongSell, color: CONSENSUS_COLORS.strongSell },
  ].filter((d) => d.value > 0);

  const label = CONSENSUS_LABELS[consensus] || CONSENSUS_LABELS["Hold"];

  return (
    <div style={{ position: "relative", width: size, height: size }}>
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: consensus.length > 5 ? 11 : 13,
            fontWeight: 800,
            color: label.bg,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
            maxWidth: size * 0.5,
          }}
        >
          {consensus}
        </span>
      </div>
    </div>
  );
}

// ─── Price Target Slider ─────────────────────────────────────────────
function PriceTargetBar({ low, avg, high, current }) {
  const range = high - low;
  const avgPos = ((avg - low) / range) * 100;
  const curPos = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const upside = (((avg - current) / current) * 100).toFixed(1);
  const isUp = avg >= current;

  return (
    <div style={{ width: "100%", marginTop: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#94a3b8",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Price targets
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isUp ? "#22c55e" : "#ef4444",
          }}
        >
          {isUp ? "Upside" : "Downside"} to Avg: {isUp ? "+" : ""}
          {upside}%
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 6,
          borderRadius: 3,
          background: "rgba(255,255,255,0.08)",
          margin: "0 0 4px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${Math.min(curPos, avgPos)}%`,
            width: `${Math.abs(avgPos - curPos)}%`,
            height: "100%",
            borderRadius: 3,
            background: isUp
              ? "linear-gradient(90deg, #22c55e88, #22c55e)"
              : "linear-gradient(90deg, #ef444488, #ef4444)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${curPos}%`,
            top: -5,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `7px solid ${isUp ? "#22c55e" : "#ef4444"}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${avgPos}%`,
            top: -2,
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #22c55e",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        <span>${low}</span>
        <span style={{ color: "#94a3b8", fontWeight: 700 }}>Avg ${avg}</span>
        <span>${high}</span>
      </div>
    </div>
  );
}

// ─── Stock Card ──────────────────────────────────────────────────────
function StockCard({ ticker, data, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isUp = data.change >= 0;
  const ratingEntries = [
    { label: "Strong Buy", val: data.ratings.strongBuy, color: CONSENSUS_COLORS.strongBuy },
    { label: "Buy", val: data.ratings.buy, color: CONSENSUS_COLORS.buy },
    { label: "Hold", val: data.ratings.hold, color: CONSENSUS_COLORS.hold },
    { label: "Sell", val: data.ratings.sell, color: CONSENSUS_COLORS.sell },
    { label: "Strong Sell", val: data.ratings.strongSell, color: CONSENSUS_COLORS.strongSell },
  ];

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background:
          "linear-gradient(145deg, rgba(15,25,18,0.92) 0%, rgba(10,18,12,0.95) 100%)",
        borderRadius: 16,
        border: "1px solid rgba(34,197,94,0.15)",
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        minWidth: 260,
        flex: "1 1 280px",
        maxWidth: 340,
      }}
    >
      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 16 }}>{data.logo}</span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "0.03em",
              }}
            >
              {ticker}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>
            Full Comparison
          </span>
        </div>
        <span
          style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 3 }}
        >
          {ticker}
        </span>
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
          }}
        >
          ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: isUp ? "#22c55e" : "#ef4444",
          }}
        >
          {isUp ? "+" : ""}
          {data.change}%
        </span>
      </div>

      {/* Analyst Consensus label */}
      <span
        style={{
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 10,
        }}
      >
        Analyst Consensus
      </span>

      {/* Donut + Ratings */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <ConsensusDonut
          ratings={data.ratings}
          consensus={data.consensus}
          size={110}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ratingEntries.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: r.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#94a3b8", fontWeight: 500, minWidth: 70 }}>
                {r.label}
              </span>
              <span style={{ color: "#e2e8f0", fontWeight: 700, minWidth: 18, textAlign: "right" }}>
                {r.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Target */}
      <PriceTargetBar
        low={data.target.low}
        avg={data.target.avg}
        high={data.target.high}
        current={data.price}
      />
    </div>
  );
}

// ─── List Manager (Page 1) ───────────────────────────────────────────
function ListManager({ tickers, setTickers, onApply }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.length > 0) {
      const upper = val.toUpperCase();
      setSuggestions(
        ALL_TICKERS.filter(
          (t) =>
            (t.includes(upper) ||
              STOCK_DB[t].name.toUpperCase().includes(upper)) &&
            !tickers.includes(t)
        ).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addTicker = (t) => {
    if (!tickers.includes(t) && tickers.length < 8) {
      setTickers([...tickers, t]);
    }
    setSearch("");
    setSuggestions([]);
  };

  const removeTicker = (t) => setTickers(tickers.filter((x) => x !== t));

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "20px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            marginBottom: 4,
            fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          }}
        >
          <span style={{ color: "#22c55e" }}>$</span> Stock List Manager
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
          Build your watchlist, then compare analyst consensus side-by-side
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(15,25,18,0.9)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 12,
            padding: "12px 16px",
            transition: "border-color 0.2s",
          }}
        >
          <Search size={16} color="#22c55e" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) addTicker(suggestions[0]);
            }}
            placeholder="Search ticker or company name..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f1f5f9",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#475569",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {tickers.length}/8
          </span>
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(10,18,12,0.97)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10,
              marginTop: 4,
              overflow: "hidden",
              zIndex: 50,
              backdropFilter: "blur(20px)",
            }}
          >
            {suggestions.map((t) => (
              <div
                key={t}
                onClick={() => addTicker(t)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(34,197,94,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{STOCK_DB[t].logo}</span>
                  <span
                    style={{
                      color: "#f1f5f9",
                      fontWeight: 700,
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  >
                    {t}
                  </span>
                  <span style={{ color: "#64748b", fontSize: 12 }}>
                    {STOCK_DB[t].name}
                  </span>
                </div>
                <Plus size={14} color="#22c55e" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticker chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
          minHeight: 40,
        }}
      >
        {tickers.map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 8,
              padding: "8px 12px",
              animation: "fadeSlideIn 0.3s ease forwards",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <span style={{ fontSize: 13 }}>{STOCK_DB[t]?.logo}</span>
            <span
              style={{
                color: "#e2e8f0",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "monospace",
              }}
            >
              {t}
            </span>
            <span
              style={{
                fontSize: 11,
                color: (STOCK_DB[t]?.change || 0) >= 0 ? "#22c55e" : "#ef4444",
                fontWeight: 600,
              }}
            >
              ${STOCK_DB[t]?.price}
            </span>
            <button
              onClick={() => removeTicker(t)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                display: "flex",
                opacity: 0.5,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
            >
              <X size={13} color="#ef4444" />
            </button>
          </div>
        ))}
        {tickers.length === 0 && (
          <div
            style={{
              color: "#475569",
              fontSize: 13,
              fontWeight: 500,
              padding: "10px 0",
              fontStyle: "italic",
            }}
          >
            Search and add tickers above to build your list...
          </div>
        )}
      </div>

      {/* Quick add row */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: 10,
            color: "#475569",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Popular
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ALL_TICKERS.filter((t) => !tickers.includes(t))
            .slice(0, 6)
            .map((t) => (
              <button
                key={t}
                onClick={() => addTicker(t)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: "5px 10px",
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "monospace",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34,197,94,0.1)";
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                  e.currentTarget.style.color = "#22c55e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                + {t}
              </button>
            ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        disabled={tickers.length === 0}
        style={{
          width: "100%",
          padding: "14px 24px",
          borderRadius: 12,
          border: "none",
          background:
            tickers.length > 0
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "rgba(255,255,255,0.06)",
          color: tickers.length > 0 ? "#052e16" : "#475569",
          fontSize: 14,
          fontWeight: 800,
          cursor: tickers.length > 0 ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          letterSpacing: "0.03em",
          transition: "all 0.25s",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <LayoutGrid size={16} />
        Apply List to Dashboard
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── Dashboard (Page 2) ──────────────────────────────────────────────
function Dashboard({ tickers, onBack }) {
  return (
    <div style={{ position: "relative", zIndex: 1, padding: "16px 20px" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#94a3b8",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(34,197,94,0.1)";
            e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
            e.currentTarget.style.color = "#22c55e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <ArrowLeft size={14} />
          Back to List Manager
        </button>

        {/* Search chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(15,25,18,0.8)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 10,
            padding: "6px 14px",
          }}
        >
          <Search size={13} color="#64748b" />
          {tickers.map((t) => (
            <span
              key={t}
              style={{
                background: "rgba(34,197,94,0.12)",
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: 11,
                fontWeight: 700,
                color: "#e2e8f0",
                fontFamily: "monospace",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 10 }}>{STOCK_DB[t]?.logo}</span>
              {t}
            </span>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Bell size={16} color="#64748b" style={{ cursor: "pointer" }} />
          <Settings size={16} color="#64748b" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {tickers.map(
          (t, i) =>
            STOCK_DB[t] && (
              <StockCard key={t} ticker={t} data={STOCK_DB[t]} delay={i * 100} />
            )
        )}
      </div>

      {/* Footer summary */}
      <div
        style={{
          marginTop: 24,
          padding: "12px 20px",
          background: "rgba(15,25,18,0.7)",
          border: "1px solid rgba(34,197,94,0.1)",
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Avg Upside",
            value:
              (
                tickers.reduce((sum, t) => {
                  const d = STOCK_DB[t];
                  return d ? sum + ((d.target.avg - d.price) / d.price) * 100 : sum;
                }, 0) / tickers.length
              ).toFixed(1) + "%",
            color: "#22c55e",
          },
          {
            label: "Strong Buys",
            value: tickers.reduce(
              (sum, t) => sum + (STOCK_DB[t]?.ratings.strongBuy || 0),
              0
            ),
            color: "#22c55e",
          },
          {
            label: "Total Analysts",
            value: tickers.reduce((sum, t) => {
              const r = STOCK_DB[t]?.ratings;
              return r
                ? sum + r.strongBuy + r.buy + r.hold + r.sell + r.strongSell
                : sum;
            }, 0),
            color: "#94a3b8",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: stat.color,
                fontFamily: "monospace",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("list");
  const [tickers, setTickers] = useState(["NVDA", "PLTR", "TSLA"]);
  const [transitioning, setTransitioning] = useState(false);

  const navigate = (target) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(target);
      setTransitioning(false);
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        color: "#f1f5f9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 3px; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #475569; }
      `}</style>

      <CircuitBackground />

      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.98)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {page === "list" ? (
          <ListManager
            tickers={tickers}
            setTickers={setTickers}
            onApply={() => navigate("dashboard")}
          />
        ) : (
          <Dashboard tickers={tickers} onBack={() => navigate("list")} />
        )}
      </div>
    </div>
  );
}