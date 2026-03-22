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
}
