# AGENT DESIGN

The application uses a LangGraph-style command chain:

Command Agent -> Population Agent -> Shelter Agent -> Medical Agent -> Food Agent -> Transport Agent -> Weather Agent -> Network Agent -> Allocation Agent

Supporting agents:

- Route Agent
- Conflict Resolution Agent
- Monitoring Agent

Each agent emits structured A2A messages and maintains status transitions.
