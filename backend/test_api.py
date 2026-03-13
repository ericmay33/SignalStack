#!/usr/bin/env python3
"""
SignalStack API smoke test.

Starts uvicorn programmatically, sends POST /api/stocks with ["NVDA"],
prints the full JSON response, and validates all expected fields are present.
"""

import io
import json
import sys
import threading
import time

# Force UTF-8 output on Windows so Unicode chars print correctly
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

import httpx
import uvicorn

from app.config import FINNHUB_API_KEY
from app.main import app

_PORT = 8765
_BASE = f"http://127.0.0.1:{_PORT}"
_TICKER = "NVDA"


def _run_server() -> None:
    config = uvicorn.Config(app, host="127.0.0.1", port=_PORT, log_level="warning")
    server = uvicorn.Server(config)
    server.run()


def _wait_ready(timeout: float = 15.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = httpx.get(f"{_BASE}/health", timeout=1.0)
            if r.status_code == 200:
                return True
        except Exception:
            pass
        time.sleep(0.3)
    return False


def _check(condition: bool, label: str) -> bool:
    print(f"  {'✓' if condition else '✗'}  {label}")
    return condition


def main() -> None:
    # ── API key notice ────────────────────────────────────────────────
    if FINNHUB_API_KEY:
        print(f"\n  FINNHUB_API_KEY present ({FINNHUB_API_KEY[:6]}…)")
    else:
        print(
            "\n  ⚠  FINNHUB_API_KEY not set — Finnhub fields will be 0.\n"
            "     Copy backend/.env.example → backend/.env and add your key.\n"
            "     yfinance data (name, growth) will still be real."
        )

    # ── Start server ──────────────────────────────────────────────────
    print("\n── Starting SignalStack API ─────────────────────────────────────")
    t = threading.Thread(target=_run_server, daemon=True)
    t.start()

    if not _wait_ready():
        print("ERROR: server did not start within 15 s")
        sys.exit(1)
    print(f"  Server ready at {_BASE}\n")

    # ── Make request ──────────────────────────────────────────────────
    print(f'── POST /api/stocks  {{"tickers": ["{_TICKER}"]}} ─────────────────────')
    resp = httpx.post(
        f"{_BASE}/api/stocks",
        json={"tickers": [_TICKER]},
        timeout=30.0,
    )
    print(f"  HTTP {resp.status_code}\n")

    payload = resp.json()

    # ── Print response ────────────────────────────────────────────────
    print("── Full JSON response ───────────────────────────────────────────")
    print(json.dumps(payload, indent=2))

    # ── Validate fields ───────────────────────────────────────────────
    print("\n── Field validation ─────────────────────────────────────────────")
    ok = True

    ok &= _check(resp.status_code == 200, "HTTP 200")
    ok &= _check({"data", "meta"} <= payload.keys(), "top-level keys: data, meta")

    stock = payload.get("data", {}).get(_TICKER, {})
    ok &= _check(bool(stock), f"data.{_TICKER} present")

    required_root = {"ticker", "name", "price", "consensus", "price_target", "growth"}
    ok &= _check(required_root <= stock.keys(), f"stock root fields: {required_root}")

    ok &= _check(
        {"current", "change_pct", "change_dollar", "high", "low"} <= stock.get("price", {}).keys(),
        "price fields",
    )
    ok &= _check(
        {"overall", "strong_buy", "buy", "hold", "sell", "strong_sell", "total_analysts"}
        <= stock.get("consensus", {}).keys(),
        "consensus fields",
    )
    ok &= _check(
        {"low", "avg", "median", "high", "upside_pct"} <= stock.get("price_target", {}).keys(),
        "price_target fields",
    )
    ok &= _check(
        {"eps_forward", "forward_pe", "revenue_growth_pct", "earnings_growth_pct"}
        <= stock.get("growth", {}).keys(),
        "growth fields",
    )
    ok &= _check(
        {"fetched_at", "source"} <= payload.get("meta", {}).keys(),
        "meta fields",
    )

    overall = stock.get("consensus", {}).get("overall", "")
    ok &= _check(
        overall in {"Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"},
        f'consensus.overall valid label → "{overall}"',
    )

    name = stock.get("name", "")
    ok &= _check(bool(name) and name != _TICKER, f'name populated → "{name}"')

    print(f"\n{'── All checks passed ✓' if ok else '── SOME CHECKS FAILED ✗'}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
