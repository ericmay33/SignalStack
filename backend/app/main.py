from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FINNHUB_API_KEY
from app.routers import stocks

app = FastAPI(title="SignalStack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://signal-stack-dashboard.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/health")
async def api_health():
    return {"status": "ok", "finnhub_key_set": bool(FINNHUB_API_KEY)}
