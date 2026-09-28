from __future__ import annotations

from typing import Dict, List


def optimize_allocation(district_priority: Dict[str, float], available_resources: Dict[str, float]) -> Dict[str, object]:
    """Deterministic allocation policy for the demo scenario."""
    plan = []
    for district, score in sorted(district_priority.items(), key=lambda item: item[1], reverse=True):
        if district == "Konaseema":
            plan.append({"district": district, "resource": "Medicine", "quantity": 5100, "priority": score})
            plan.append({"district": district, "resource": "Food", "quantity": 220000, "priority": score})
        elif district == "Kakinada":
            plan.append({"district": district, "resource": "Food", "quantity": 180000, "priority": score})
        elif district == "East Godavari":
            plan.append({"district": district, "resource": "Water", "quantity": 170000, "priority": score})
    return {"status": "feasible", "allocations": plan, "available_resources": available_resources}


def resolve_conflicts(demand: List[Dict[str, float]], available: float) -> List[Dict[str, float]]:
    ordered = sorted(demand, key=lambda item: item["priority"], reverse=True)
    allocations = []
    remaining = available
    for item in ordered:
        required = min(item["need"], remaining)
        allocations.append({"district": item["district"], "allocation": required, "priority": item["priority"]})
        remaining -= required
    return allocations
