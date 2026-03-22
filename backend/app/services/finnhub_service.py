import logging

import httpx

from app.config import FINNHUB_API_KEY

_BASE = "https://finnhub.io/api/v1"
_TIMEOUT = 10.0

logger = logging.getLogger(__name__)


async def _get(endpoint: str, params: dict) -> dict | list:
    params = {**params, "token": FINNHUB_API_KEY}
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.get(f"{_BASE}{endpoint}", params=params)
        resp.raise_for_status()
        return resp.json()


async def get_quote(ticker: str) -> dict:
    try:
        return await _get("/quote", {"symbol": ticker})  # type: ignore[return-value]
    except Exception as exc:
        logger.warning("finnhub get_quote failed for %s: %s", ticker, exc)
        return {}


async def get_recommendations(ticker: str) -> list:
    try:
        result = await _get("/stock/recommendation", {"symbol": ticker})
        return result if isinstance(result, list) else []
    except Exception as exc:
        logger.warning("finnhub get_recommendations failed for %s: %s", ticker, exc)
        return []


async def get_price_target(ticker: str) -> dict:
    try:
        return await _get("/stock/price-target", {"symbol": ticker})  # type: ignore[return-value]
    except Exception as exc:
        logger.warning("finnhub get_price_target failed for %s: %s", ticker, exc)
        return {}


async def get_profile(ticker: str) -> dict:
    try:
        return await _get("/stock/profile2", {"symbol": ticker})  # type: ignore[return-value]
    except Exception as exc:
        logger.warning("finnhub get_profile failed for %s: %s", ticker, exc)
        return {}


async def get_eps_estimate(ticker: str) -> dict:
    try:
        return await _get("/stock/eps-estimate", {"symbol": ticker, "freq": "annual"})  # type: ignore[return-value]
    except Exception as exc:
        logger.warning("finnhub get_eps_estimate failed for %s: %s", ticker, exc)
        return {}
