import json
from pathlib import Path

from backend.app.simulation.engine import ReliefNetEngine


def test_seed_data_exists():
    data_dir = Path(__file__).resolve().parents[1] / "data" / "synthetic"
    assert (data_dir / "districts.csv").exists()
    assert (data_dir / "scenarios.json").exists()


def test_start_simulation_and_priority():
    engine = ReliefNetEngine()
    result = engine.start_simulation()
    assert result["status"] == "ok"
    assert "Konaseema" in result["priority_scores"]
    assert result["priority_scores"]["Konaseema"]["priority"] >= 80


def test_replanning_changes_plan():
    engine = ReliefNetEngine()
    engine.run_allocation()
    before = engine.simulation_state["new_plan"]
    after = engine.run_replanning()
    assert after["status"] == "ok"
    assert before != after["new_plan"]


def test_copilot_question_response():
    engine = ReliefNetEngine()
    response = engine.answer_copilot("Which district should receive medicine first?")
    assert response["answer"].startswith("Konaseema")


def test_scenario_file_contains_demo():
    scenarios = json.loads((Path(__file__).resolve().parents[1] / "data" / "synthetic" / "scenarios.json").read_text())
    assert scenarios["scenarios"][0]["id"] == "SCN-FLOOD-001"
