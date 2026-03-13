import yfinance as yf


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
        }
    except Exception:
        return {
            "name": ticker,
            "eps_forward": None,
            "forward_pe": None,
            "revenue_growth_pct": 0.0,
            "earnings_growth_pct": 0.0,
        }
