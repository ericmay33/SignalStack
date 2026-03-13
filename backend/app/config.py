import os
import warnings
from dotenv import load_dotenv

# Load .env relative to this file's location (backend/.env)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

FINNHUB_API_KEY: str = os.getenv("FINNHUB_API_KEY", "")

if not FINNHUB_API_KEY:
    warnings.warn(
        "FINNHUB_API_KEY is not set. "
        "Copy backend/.env.example to backend/.env and add your key.",
        stacklevel=1,
    )
