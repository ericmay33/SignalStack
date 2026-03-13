export interface StockRatings {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface StockTarget {
  low: number;
  avg: number;
  high: number;
}

export interface StockData {
  name: string;
  price: number;
  change: number;
  consensus: string;
  ratings: StockRatings;
  target: StockTarget;
  logo: string;
  color: string;
}

export type StockDB = Record<string, StockData>;

export const STOCK_DB: StockDB = {
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

export const ALL_TICKERS = Object.keys(STOCK_DB);

export const CONSENSUS_COLORS: Record<string, string> = {
  strongBuy: "#22c55e",
  buy: "#4ade80",
  hold: "#eab308",
  sell: "#ef4444",
  strongSell: "#dc2626",
};

export const CONSENSUS_LABELS: Record<string, { bg: string; text: string }> = {
  "Strong Buy": { bg: "#22c55e", text: "#022c22" },
  Buy: { bg: "#4ade80", text: "#052e16" },
  Hold: { bg: "#eab308", text: "#422006" },
  Sell: { bg: "#ef4444", text: "#450a0a" },
  "Strong Sell": { bg: "#dc2626", text: "#fff" },
};
