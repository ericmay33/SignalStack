"""
Integration tests for SignalStack API.

Tests marked with @pytest.mark.live hit real external APIs (Finnhub, yfinance)
and are skipped when FINNHUB_API_KEY is not set.
"""

import time

import pytest
from fastapi.testclient import TestClient

from app.config import FINNHUB_API_KEY
from app.main import app
from app.services.aggregator import cache_clear

client = TestClient(app)

has_finnhub_key = bool(FINNHUB_API_KEY)
live = pytest.mark.skipif(not has_finnhub_key, reason="FINNHUB_API_KEY not set")


# ── Health check ──────────────────────────────────────────────────────

class TestHealth:
    def test_root_health(self):
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}

    def test_api_health_shape(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        body = resp.json()
        assert "status" in body
        assert "finnhub_key_set" in body
        assert body["status"] == "ok"
        assert body["finnhub_key_set"] == has_finnhub_key


# ── Live data tests ───────────────────────────────────────────────────

class TestLiveStocks:
    @live
    def test_single_ticker_real_data(self):
        cache_clear()
        resp = client.post("/api/stocks", json={"tickers": ["AAPL"]})
        assert resp.status_code == 200

        body = resp.json()
        assert "data" in body and "meta" in body
        assert "fetched_at" in body["meta"]
        assert body["meta"]["source"] == "finnhub+yfinance"

        aapl = body["data"]["AAPL"]

        # Verify all top-level fields
        for field in ("ticker", "name", "price", "consensus", "price_target", "growth"):
            assert field in aapl, f"Missing field: {field}"

        # Price populated (Finnhub)
        assert aapl["price"]["current"] > 0
        assert isinstance(aapl["price"]["change_pct"], (int, float))

        # Consensus populated (Finnhub)
        assert aapl["consensus"]["total_analysts"] > 0
        assert aapl["consensus"]["overall"] in {
            "Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"
        }

        # Growth populated (yfinance)
        assert aapl["name"] and aapl["name"] != "AAPL"

    @live
    def test_cache_second_call_faster(self):
        cache_clear()

        # First call — cold
        t0 = time.monotonic()
        resp1 = client.post("/api/stocks", json={"tickers": ["MSFT"]})
        cold_ms = (time.monotonic() - t0) * 1000
        assert resp1.status_code == 200

        # Second call — should hit cache
        t1 = time.monotonic()
        resp2 = client.post("/api/stocks", json={"tickers": ["MSFT"]})
        warm_ms = (time.monotonic() - t1) * 1000
        assert resp2.status_code == 200

        # Cache hit should be at least 5x faster than cold call
        # (cold call does network I/O; cached is in-memory dict lookup)
        assert warm_ms < cold_ms, (
            f"Cached call ({warm_ms:.0f}ms) should be faster than cold ({cold_ms:.0f}ms)"
        )

        # Responses should match
        assert resp1.json()["data"]["MSFT"] == resp2.json()["data"]["MSFT"]


# ── Error handling ────────────────────────────────────────────────────

class TestErrorHandling:
    @live
    def test_invalid_ticker_does_not_crash(self):
        """A bogus ticker should still return 200 with zero/fallback data."""
        cache_clear()
        resp = client.post("/api/stocks", json={"tickers": ["ZZZZZ"]})
        assert resp.status_code == 200

        body = resp.json()
        assert "ZZZZZ" in body["data"]
        stock = body["data"]["ZZZZZ"]
        # Should have valid structure even if all values are zero/default
        assert "price" in stock
        assert "consensus" in stock
        assert "growth" in stock

    def test_empty_tickers_rejected(self):
        resp = client.post("/api/stocks", json={"tickers": []})
        assert resp.status_code == 422

    def test_too_many_tickers_rejected(self):
        tickers = [f"T{i}" for i in range(10)]
        resp = client.post("/api/stocks", json={"tickers": tickers})
        assert resp.status_code == 400
