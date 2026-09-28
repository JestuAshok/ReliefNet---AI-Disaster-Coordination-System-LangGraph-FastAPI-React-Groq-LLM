from __future__ import annotations

import networkx as nx


def build_route_graph():
    graph = nx.DiGraph()
    graph.add_edge("Kakinada", "Konaseema", distance_km=60, travel_time_min=110, risk=0.74, blocked=False)
    graph.add_edge("Konaseema", "East Godavari", distance_km=65, travel_time_min=120, risk=0.78, blocked=False)
    graph.add_edge("East Godavari", "Krishna", distance_km=90, travel_time_min=145, risk=0.64, blocked=False)
    graph.add_edge("Krishna", "West Godavari", distance_km=86, travel_time_min=138, risk=0.62, blocked=False)
    graph.add_edge("Kakinada", "Visakhapatnam", distance_km=135, travel_time_min=200, risk=0.68, blocked=False)
    graph.add_edge("East Godavari", "Visakhapatnam", distance_km=118, travel_time_min=175, risk=0.70, blocked=False)
    return graph


def calculate_route(graph, source: str, target: str):
    if source not in graph or target not in graph:
        return {"status": "unavailable", "path": [], "travel_time_min": None}
    path = nx.shortest_path(graph, source, target, weight="travel_time_min")
    cost = nx.path_weight(graph, path, weight="travel_time_min")
    return {"status": "ok", "path": path, "travel_time_min": int(cost), "distance_km": sum(graph[path[i]][path[i + 1]].get("distance_km", 0) for i in range(len(path) - 1))}


def route_after_blockage(graph, source: str, target: str):
    graph = graph.copy()
    if (source, target) in graph.edges:
        graph.remove_edge(source, target)
    return calculate_route(graph, source, target)
