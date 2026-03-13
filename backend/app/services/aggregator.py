import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.services.finnhub_service import (
    get_quote,
    get_recommendations,
    get_price_target,
    get_eps_estimate,
)
from app.services.yfinance_service import get_growth_data

_executor = ThreadPoolExecutor(max_workers=8)


def derive_consensus(
    strong_buy: int, buy: int, hold: int, sell: int, strong_sell: int
) -> str:
    total = strong_buy + buy + hold + sell + strong_sell
    if total == 0:
        return "Hold"
    score = (
        (strong_buy * 5) + (buy * 4) + (hold * 3) + (sell * 2) + (strong_sell * 1)
    ) / total
    if score >= 4.5:
        return "Strong Buy"
    if score >= 3.5:
        return "Buy"
    if score >= 2.5:
        return "Hold"
    if score >= 1.5:
        return "Sell"
    return "Strong Sell"


async def fetch_single_ticker(ticker: str) -> dict:
    loop = asyncio.get_running_loop()

    # Fire all four Finnhub endpoints concurrently alongside yfinance
    quote, recs, targets, _eps, growth = await asyncio.gather(
        get_quote(ticker),
        get_recommendations(ticker),
        get_price_target(ticker),
        get_eps_estimate(ticker),
        loop.run_in_executor(_executor, get_growth_data, ticker),
    )

    latest_rec: dict = recs[0] if recs else {}
    sb = int(latest_rec.get("strongBuy", 0))
    b  = int(latest_rec.get("buy", 0))
    h  = int(latest_rec.get("hold", 0))
    s  = int(latest_rec.get("sell", 0))
    ss = int(latest_rec.get("strongSell", 0))
    total = sb + b + h + s + ss

    current_price: float = float(quote.get("c") or 0)
    target_mean: float   = float(targets.get("targetMean") or 0)
    upside_pct = (
        round(((target_mean - current_price) / current_price) * 100, 2)
        if current_price and target_mean
        else 0.0
    )

    return {
        "ticker": ticker,
        "name": growth.get("name", ticker),
        "price": {
            "current": current_price,
            "change_pct": float(quote.get("dp") or 0),
            "change_dollar": float(quote.get("d") or 0),
            "high": float(quote.get("h") or 0),
            "low": float(quote.get("l") or 0),
        },
        "consensus": {
            "overall": derive_consensus(sb, b, h, s, ss),
            "strong_buy": sb,
            "buy": b,
            "hold": h,
            "sell": s,
            "strong_sell": ss,
            "total_analysts": total,
        },
        "price_target": {
            "low": float(targets.get("targetLow") or 0),
            "avg": target_mean,
            "median": float(targets.get("targetMedian") or 0),
            "high": float(targets.get("targetHigh") or 0),
            "upside_pct": upside_pct,
        },
        "growth": {
            "eps_forward": growth.get("eps_forward"),
            "forward_pe": growth.get("forward_pe"),
            "revenue_growth_pct": growth.get("revenue_growth_pct", 0.0),
            "earnings_growth_pct": growth.get("earnings_growth_pct", 0.0),
        },
    }


async def fetch_all_stock_data(tickers: list[str]) -> dict:
    results = await asyncio.gather(*[fetch_single_ticker(t) for t in tickers])
    return {r["ticker"]: r for r in results}
