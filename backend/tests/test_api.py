import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_finnhub_yfinance():
    with patch("app.services.aggregator.get_quote", new_callable=AsyncMock) as mock_quote, \
         patch("app.services.aggregator.get_recommendations", new_callable=AsyncMock) as mock_recs, \
         patch("app.services.aggregator.get_price_target", new_callable=AsyncMock) as mock_target, \
         patch("app.services.aggregator.get_eps_estimate", new_callable=AsyncMock) as mock_eps, \
         patch("app.services.aggregator.get_growth_data") as mock_growth:

        mock_quote.return_value = {
            "c": 150.0, "dp": 1.5, "d": 2.25, "h": 152.0, "l": 149.0
        }
        
        mock_recs.return_value = [{
            "strongBuy": 10, "buy": 5, "hold": 2, "sell": 1, "strongSell": 0
        }]
        
        mock_target.return_value = {
            "targetLow": 130.0, "targetMean": 160.0, "targetMedian": 165.0, "targetHigh": 180.0
        }
        
        mock_eps.return_value = {"eps": 4.5}
        
        mock_growth.return_value = {
            "name": "Test Company",
            "eps_forward": 5.0,
            "forward_pe": 30.0,
            "revenue_growth_pct": 15.0,
            "earnings_growth_pct": 20.0
        }
        
        yield {
            "quote": mock_quote,
            "recs": mock_recs,
            "target": mock_target,
            "eps": mock_eps,
            "growth": mock_growth
        }

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_stocks_success(mock_finnhub_yfinance):
    response = client.post("/api/stocks", json={"tickers": ["AAPL"]})
    assert response.status_code == 200
    
    data = response.json()
    assert "data" in data
    assert "meta" in data
    
    aapl_data = data["data"].get("AAPL")
    assert aapl_data is not None
    assert aapl_data["ticker"] == "AAPL"
    assert aapl_data["name"] == "Test Company"
    assert aapl_data["price"]["current"] == 150.0
    assert aapl_data["consensus"]["overall"] == "Buy" # Score calculation Check
    assert aapl_data["price_target"]["avg"] == 160.0
    assert aapl_data["growth"]["forward_pe"] == 30.0

def test_get_stocks_empty_tickers():
    response = client.post("/api/stocks", json={"tickers": []})
    # FastAPI returns 422 for Pydantic validation errors
    assert response.status_code == 422
    assert "At least one ticker is required" in response.json()["detail"][0]["msg"]

def test_get_stocks_too_many_tickers(mock_finnhub_yfinance):
    tickers = [f"TICKER{i}" for i in range(10)]
    response = client.post("/api/stocks", json={"tickers": tickers})
    # We will update the stocks router to limit to 8 tickers directly or throw 400
    assert response.status_code == 400
    assert response.json()["detail"] == "Maximum 8 tickers allowed"
