from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.simulation.engine import engine

# Load environment variables from .env file
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path, override=True)

app = FastAPI(title="RELIEFNET", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    import os
    has_key = bool(os.getenv("GROQ_API_KEY"))
    return {"status": "ok", "app": "RELIEFNET", "groq_configured": has_key}


@app.get("/api/districts")
def get_districts() -> dict:
    return {"districts": engine.districts}


@app.get("/api/weather")
def get_weather() -> dict:
    return {"weather": engine.weather}


@app.get("/api/population")
def get_population() -> dict:
    return {"population": engine.population}


@app.post("/api/simulation/start")
def start_simulation() -> dict:
    return engine.start_simulation()


@app.post("/api/simulation/reset")
def reset_simulation() -> dict:
    return engine.reset_simulation()


@app.post("/api/simulation/events")
def trigger_event(payload: dict) -> dict:
    return engine.trigger_event(payload)


@app.post("/api/allocation/run")
def run_allocation() -> dict:
    return engine.run_allocation()


@app.post("/api/replanning/run")
def run_replanning() -> dict:
    return engine.run_replanning()


@app.get("/api/agents/status")
def agent_status() -> dict:
    return engine.agent_status()


@app.get("/api/audit")
def audit_trail() -> dict:
    return engine.audit_trail()


@app.get("/api/test-env")
def test_env() -> dict:
    import os
    return {
        "groq_api_key_exists": bool(os.getenv("GROQ_API_KEY")),
        "groq_api_key_length": len(os.getenv("GROQ_API_KEY", "")),
        "groq_model": os.getenv("GROQ_MODEL", "not set"),
        "all_env_keys": [k for k in os.environ.keys() if "GROQ" in k]
    }


@app.post("/api/copilot/query")
async def copilot_query(payload: dict) -> dict:
    return await engine.answer_copilot_with_ai(payload.get("question", ""))
