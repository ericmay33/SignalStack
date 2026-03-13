from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.models.schemas import StockRequest
from app.services.aggregator import fetch_all_stock_data

router = APIRouter()


@router.post("/stocks")
async def get_stocks(req: StockRequest):
    if not req.tickers:
        raise HTTPException(status_code=400, detail="Tickers list cannot be empty")
    if len(req.tickers) > 8:
        raise HTTPException(status_code=400, detail="Maximum 8 tickers allowed")
        
    tickers = [t.upper().strip() for t in req.tickers[:8]]
    data = await fetch_all_stock_data(tickers)
    return {
        "data": data,
        "meta": {
            "fetched_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "source": "finnhub+yfinance",
        },
    }
