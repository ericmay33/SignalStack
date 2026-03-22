import logging

import yfinance as yf

logger = logging.getLogger(__name__)

_DEFAULTS: dict = {
    "name": "",
    "eps_forward": None,
    "forward_pe": None,
    "revenue_growth_pct": 0.0,
    "earnings_growth_pct": 0.0,
}


def get_growth_data(ticker: str) -> dict:
    """Blocking call — must be run in a ThreadPoolExecutor."""
    try:
        t = yf.Ticker(ticker)
        info = t.info
        return {
            "name": info.get("shortName") or ticker,
            "eps_forward": info.get("forwardEps"),
            "forward_pe": info.get("forwardPE"),
            "revenue_growth_pct": round((info.get("revenueGrowth") or 0) * 100, 1),
            "earnings_growth_pct": round((info.get("earningsGrowth") or 0) * 100, 1),
            "targetLowPrice": info.get("targetLowPrice"),
            "targetMeanPrice": info.get("targetMeanPrice"),
            "targetHighPrice": info.get("targetHighPrice"),
        }
    except Exception as exc:
        logger.warning("yfinance get_growth_data failed for %s: %s", ticker, exc)
        return {**_DEFAULTS, "name": ticker}
