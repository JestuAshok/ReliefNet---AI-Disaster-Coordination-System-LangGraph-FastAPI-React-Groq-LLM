# ARCHITECTURE

This project separates four layers:

- Data layer: synthetic CSV/JSON datasets in /data/synthetic
- Backend layer: FastAPI, deterministic simulation engine, routing, optimization, RAG
- Agent layer: LangGraph-inspired orchestration with command and support agents
- Frontend layer: React + TypeScript + Tailwind-style custom CSS dashboard

The flow is disaster -> agent analysis -> priority -> optimization -> route -> replanning.
