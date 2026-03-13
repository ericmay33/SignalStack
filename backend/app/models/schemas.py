from pydantic import BaseModel, field_validator


class StockRequest(BaseModel):
    tickers: list[str]

    @field_validator("tickers")
    @classmethod
    def validate_tickers(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("At least one ticker is required")
        return v


# ── Response models (used for documentation; router returns plain dicts) ──

class PriceData(BaseModel):
    current: float
    change_pct: float
    change_dollar: float
    high: float
    low: float


class ConsensusData(BaseModel):
    overall: str
    strong_buy: int
    buy: int
    hold: int
    sell: int
    strong_sell: int
    total_analysts: int


class PriceTargetData(BaseModel):
    low: float
    avg: float
    median: float
    high: float
    upside_pct: float


class GrowthData(BaseModel):
    eps_forward: float | None
    forward_pe: float | None
    revenue_growth_pct: float
    earnings_growth_pct: float


class StockData(BaseModel):
    ticker: str
    name: str
    price: PriceData
    consensus: ConsensusData
    price_target: PriceTargetData
    growth: GrowthData


class MetaData(BaseModel):
    fetched_at: str
    source: str


class StocksResponse(BaseModel):
    data: dict[str, StockData]
    meta: MetaData
