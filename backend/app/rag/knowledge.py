from __future__ import annotations

from typing import Dict, List


def get_demo_3gpp_documents() -> List[Dict[str, object]]:
    return [
        {
            "document": "3GPP TS 22.179",
            "title": "Mission Critical Push to Talk (MCPTT)",
            "release": "Rel-15",
            "section": "5.1",
            "page": "15",
            "relevance_score": 0.95,
            "summary": "Emergency communications require prioritization and resilience for mission-critical voice and group communication.",
        },
        {
            "document": "3GPP TS 23.271",
            "title": "Location Services (LCS)",
            "release": "Rel-16",
            "section": "6.2",
            "page": "42",
            "relevance_score": 0.88,
            "summary": "Public safety applications require resilient location and emergency communications continuity.",
        },
        {
            "document": "3GPP TS 23.501",
            "title": "System Architecture for 5G",
            "release": "Rel-16",
            "section": "4.3",
            "page": "90",
            "relevance_score": 0.82,
            "summary": "5G network slicing and service continuity support emergency and public safety use cases.",
        },
    ]


def search_3gpp(query: str) -> Dict[str, object]:
    q = query.lower()
    docs = get_demo_3gpp_documents()
    filtered = [doc for doc in docs if any(term in q for term in ["mission", "emergency", "network", "public", "slice", "location", "resilience"]) and any(term in doc["summary"].lower() for term in q.split())]
    return {"query": query, "results": filtered if filtered else docs}
