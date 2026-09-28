"""Grounded Groq client used by the operational copilot."""

import os
from typing import Any

import httpx


GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "llama-3.3-70b-versatile"


def _system_prompt() -> str:
    return """You are RELIEFNET Copilot, an assistant for a synthetic disaster-response
simulation. Answer only from the supplied scenario context. Never claim that the
synthetic data is live, verified, or real-world information. Be concise and practical.
When recommending action, state the priority, the reason, and any uncertainty. Do not
invent quantities, routes, standards, or facts absent from the context."""


async def generate_copilot_answer(question: str, context: dict[str, Any]) -> dict[str, Any]:
    """Return a Groq answer, or a transparent configuration/service error."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"available": False, "reason": "GROQ_API_KEY is not configured."}

    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
    payload = {
        "model": model,
        "temperature": 0.2,
        "max_tokens": 450,
        "messages": [
            {"role": "system", "content": _system_prompt()},
            {
                "role": "user",
                "content": f"Scenario context (synthetic):\n{context}\n\nQuestion: {question}",
            },
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                GROQ_CHAT_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
            )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"].strip()
        if not content:
            raise ValueError("Groq returned an empty response")
        return {"available": True, "answer": content, "model": model}
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        return {"available": False, "reason": f"Groq request unavailable: {exc}"}
