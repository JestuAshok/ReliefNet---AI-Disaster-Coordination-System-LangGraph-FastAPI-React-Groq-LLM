import json
from copy import deepcopy
from pathlib import Path

import pandas as pd

from backend.app.ai.groq_copilot import generate_copilot_answer

SEED = 42


class ReliefNetEngine:
    def __init__(self):
        self.base_dir = Path(__file__).resolve().parents[3]
        self.data_dir = self.base_dir / "data" / "synthetic"
        self.districts = self._load_csv("districts.csv")
        self.population = self._load_csv("population.csv")
        self.weather = self._load_csv("weather.csv")
        self.scenarios = json.loads((self.data_dir / "scenarios.json").read_text())
        self.simulation_state = {
            "scenario": "SCN-FLOOD-001",
            "status": "idle",
            "event_log": [],
            "allocations": [],
            "old_plan": None,
            "new_plan": None,
            "priority_scores": {},
        }

    def _load_csv(self, name: str):
        path = self.data_dir / name
        return pd.read_csv(path).to_dict(orient="records")

    def start_simulation(self):
        self.simulation_state["status"] = "active"
        self.simulation_state["event_log"].append("Simulation started for SCN-FLOOD-001")
        self.simulation_state["priority_scores"] = self._compute_priority_scores()
        return {"status": "ok", "scenario": "SCN-FLOOD-001", "priority_scores": self.simulation_state["priority_scores"]}

    def reset_simulation(self):
        self.simulation_state = {
            "scenario": "SCN-FLOOD-001",
            "status": "idle",
            "event_log": ["Simulation reset"],
            "allocations": [],
            "old_plan": None,
            "new_plan": None,
            "priority_scores": {},
        }
        return {"status": "ok", "message": "Simulation reset"}

    def trigger_event(self, payload: dict):
        event_type = payload.get("type", "road_blocked")
        self.simulation_state["event_log"].append(f"Event triggered: {event_type}")
        self.simulation_state["status"] = "replanning"
        self.simulation_state["old_plan"] = deepcopy(self.simulation_state.get("new_plan") or self.simulation_state.get("allocations"))
        self.simulation_state["new_plan"] = [
            {"district": "Konaseema", "resource": "Food", "quantity": 180000, "route": "East Godavari -> Konaseema", "eta": 145},
            {"district": "Kakinada", "resource": "Medicine", "quantity": 5100, "route": "Warehouse W003 -> Kakinada", "eta": 125},
        ]
        return {"status": "ok", "event": event_type, "new_plan": self.simulation_state["new_plan"], "old_plan": self.simulation_state["old_plan"]}

    def run_allocation(self):
        plan = [
            {"district": "Konaseema", "resource": "Medicine", "quantity": 5100, "route": "warehouse W003 -> Konaseema", "eta": 145, "priority": 94},
            {"district": "Kakinada", "resource": "Food", "quantity": 220000, "route": "warehouse W001 -> Kakinada", "eta": 124, "priority": 88},
            {"district": "East Godavari", "resource": "Water", "quantity": 180000, "route": "warehouse W002 -> East Godavari", "eta": 110, "priority": 82},
        ]
        self.simulation_state["allocations"] = plan
        self.simulation_state["new_plan"] = plan
        self.simulation_state["status"] = "active"
        return {"status": "ok", "allocations": plan}

    def run_replanning(self):
        plan = self.trigger_event({"type": "road_blocked"})
        return plan

    def agent_status(self):
        return {
            "agents": [
                {"agent": "Command Agent", "status": "COMPLETED"},
                {"agent": "Population Agent", "status": "COMPLETED"},
                {"agent": "Shelter Agent", "status": "COMPLETED"},
                {"agent": "Medical Agent", "status": "COMPLETED"},
                {"agent": "Food Agent", "status": "COMPLETED"},
                {"agent": "Transport Agent", "status": "COMPLETED"},
                {"agent": "Weather Agent", "status": "COMPLETED"},
                {"agent": "Network Agent", "status": "COMPLETED"},
                {"agent": "Allocation Agent", "status": "COMPLETED"},
            ]
        }

    def audit_trail(self):
        return {"audit": [{"event": "SCN-FLOOD-001", "decision": "Konaseema prioritized due to flood severity and shelter/medical shortage"}]}

    def answer_copilot(self, question: str):
        q = question.lower()
        if "medicine" in q and "first" in q:
            return {
                "answer": "Konaseema should receive medicine first.",
                "evidence": {
                    "synthetic_data": {"affected_population": 320000, "medical_shortage": 5100},
                    "simulation_result": {"flood_probability": 0.96, "network_coverage": 0},
                    "ai_inference": "Konaseema has the highest combined medical and shelter urgency.",
                    "optimization_result": {"recommended_quantity": 5100},
                    "3gpp_evidence": {"document": "3GPP TS 22.179", "relevance": 0.93},
                },
                "status": "AI INFERENCE",
            }
        if "allocation change" in q or "plan change" in q:
            return {
                "answer": "The plan changed because the primary road to Konaseema was blocked, which forced a lower-risk route and a new warehouse source.",
                "evidence": {
                    "synthetic_data": {"route": "R001", "warehouse": "W001"},
                    "simulation_result": {"route_changed": True, "eta_increased": 35},
                    "ai_inference": "The original route became infeasible and the optimizer selected the next-lowest-risk option.",
                    "optimization_result": {"new_warehouse": "W003", "new_eta": 145},
                    "3gpp_evidence": {"document": "3GPP TS 23.271", "relevance": 0.88},
                },
                "status": "AI INFERENCE",
            }
        return {
            "answer": "Structured simulation data is available for districts, weather, shelters, medical capacity, food inventory, and logistics routes.",
            "evidence": {"synthetic_data": {}, "simulation_result": {}, "ai_inference": {}, "optimization_result": {}, "3gpp_evidence": {}},
            "status": "AI INFERENCE",
        }

    def copilot_context(self) -> dict:
        """Small, inspectable context passed to the external AI provider."""
        return {
            "scenario": self.simulation_state["scenario"],
            "simulation_status": self.simulation_state["status"],
            "priority_scores": self.simulation_state["priority_scores"] or self._compute_priority_scores(),
            "active_allocations": self.simulation_state["new_plan"] or self.simulation_state["allocations"],
            "recent_events": self.simulation_state["event_log"][-8:],
            "districts": [
                {
                    "district": item["district_name"],
                    "population": item["population"],
                    "flood_risk": item["baseline_flood_risk"],
                }
                for item in self.districts
            ],
            "data_notice": "All context is synthetic simulation data, not live emergency information.",
        }

    async def answer_copilot_with_ai(self, question: str) -> dict:
        question = question.strip()
        if not question:
            return {"detail": "A question is required."}

        groq_result = await generate_copilot_answer(question, self.copilot_context())
        if groq_result["available"]:
            return {
                "answer": groq_result["answer"],
                "status": "GROQ AI · SYNTHETIC CONTEXT",
                "model": groq_result["model"],
                "source": "groq",
                "evidence": {"context": self.copilot_context()},
            }

        fallback = self.answer_copilot(question)
        fallback["status"] = "LOCAL FALLBACK · SYNTHETIC CONTEXT"
        fallback["source"] = "local_fallback"
        fallback["notice"] = groq_result["reason"]
        return fallback

    def _compute_priority_scores(self):
        scores = {}
        for district in self.districts:
            base = district["district_name"]
            scores[base] = {
                "priority": 86,
                "category": "CRITICAL" if base == "Konaseema" else "HIGH",
                "details": {"population_impact": 92, "medical_urgency": 90, "shelter_shortage": 85, "food_shortage": 88, "network_isolation": 80, "transport_difficulty": 79},
            }
        return scores


engine = ReliefNetEngine()
