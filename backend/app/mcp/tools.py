from __future__ import annotations

from typing import Any, Dict

from backend.app.routing.route_graph import build_route_graph, calculate_route, route_after_blockage


def get_district_data() -> Dict[str, Any]:
    return {"districts": ["Kakinada", "Konaseema", "East Godavari", "Krishna", "West Godavari", "Visakhapatnam", "Nellore"]}


def get_weather() -> Dict[str, Any]:
    return {"weather": {"Konaseema": {"flood_probability": 0.96, "rainfall_mm_24h": 330, "wind_speed_kmph": 81}}}


def get_rainfall() -> Dict[str, Any]:
    return {"rainfall": {"Konaseema": 330, "Kakinada": 285}}


def get_population() -> Dict[str, Any]:
    return {"population": {"Konaseema": 1750000, "affected_population": 320000}}


def get_shelters() -> Dict[str, Any]:
    return {"shelters": {"Konaseema": {"capacity": 42000, "available_capacity": 7000, "status": "AT_RISK"}}}


def get_hospitals() -> Dict[str, Any]:
    return {"hospitals": {"Konaseema": {"available_beds": 180, "available_icu": 15, "status": "AT_RISK"}}}


def get_food_inventory() -> Dict[str, Any]:
    return {"food_inventory": {"W003": {"rice_kg": 360000, "ready_meals": 82000, "water_liters": 290000}}}


def get_medical_inventory() -> Dict[str, Any]:
    return {"medical_inventory": {"D002": {"medicine_units": 3900, "critical_stock": 0.82}}}


def get_transport() -> Dict[str, Any]:
    return {"transport": {"vehicles": 10, "available": 10, "medical_transport_capable": 4}}


def get_network_status() -> Dict[str, Any]:
    return {"network": {"Konaseema": {"coverage_percent": 0, "status": "OFFLINE"}}}


def get_road_status() -> Dict[str, Any]:
    return {"roads": {"R001": {"status": "OPEN"}, "R005": {"status": "BLOCKED"}}}


def calculate_route_tool(source: str, target: str, blocked: bool = False) -> Dict[str, Any]:
    graph = build_route_graph()
    if blocked:
        return route_after_blockage(graph, source, target)
    return calculate_route(graph, source, target)


def run_allocation_tool() -> Dict[str, Any]:
    return {"status": "feasible", "allocations": [{"district": "Konaseema", "resource": "Medicine", "quantity": 5100}]}


def run_replanning_tool() -> Dict[str, Any]:
    return {"status": "updated", "plan": [{"district": "Konaseema", "resource": "Food", "quantity": 180000, "route": "East Godavari -> Konaseema"}]}


def get_simulation_state() -> Dict[str, Any]:
    return {"scenario": "SCN-FLOOD-001", "status": "SIMULATION ACTIVE", "districts_affected": 5}
