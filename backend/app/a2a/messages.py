from __future__ import annotations

from typing import Any, Dict


def build_agent_message(agent: str, district: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    return {"agent": agent, "district": district, "priority": payload.get("priority", 0), "status": "COMPLETED", "details": payload}
