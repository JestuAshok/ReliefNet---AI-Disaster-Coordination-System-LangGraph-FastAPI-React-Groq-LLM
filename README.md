# ReliefNet

**AI-Powered Disaster Relief Coordination System**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)

## Overview

ReliefNet is an intelligent disaster response coordination platform that leverages multi-agent AI systems to optimize resource allocation during emergencies. During disasters like floods, cyclones, or earthquakes, relief organizations must coordinate food, medicine, transportation, shelters, and volunteers under rapidly changing conditions. ReliefNet automates this complex coordination using autonomous AI agents that continuously analyze the situation and reallocate resources based on evolving information.

The system simulates disaster scenarios for Andhra Pradesh, India, demonstrating how AI can enhance humanitarian response through real-time decision support, predictive analytics, and optimal resource distribution.

## What It Does

### Core Capabilities

**🤖 Multi-Agent Orchestration**
- Specialized AI agents work collaboratively to assess disaster situations
- Agents include: Population, Shelter, Medical, Transport, Food, Weather, and Resource Allocation
- Each agent analyzes its domain and shares insights with the coordination network

**📊 Real-Time Situation Awareness**
- Interactive district-level visualization of affected regions
- Live tracking of resource allocation and deployment status
- Dynamic status indicators for severity, capacity, and response progress

**🎯 Intelligent Resource Allocation**
- Automated priority scoring based on population density, severity, and existing capacity
- Optimization algorithms for efficient distribution of limited resources
- Conflict resolution when multiple districts compete for the same resources

**🚚 Route Planning & Logistics**
- NetworkX-powered routing optimization considering road conditions
- Weather-aware transport planning
- Multi-modal resource delivery coordination

**⚡ Dynamic Event Response**
- Real-time simulation of evolving disaster conditions
- Automatic replanning when new events occur (flooding, road closures, supply shortages)
- Comparative analysis showing allocation changes before/after events

**💬 AI Copilot Interface**
- Natural language query system powered by Groq AI
- Ask questions like "Which districts need medical supplies most urgently?"
- Grounded responses based on live simulation data and knowledge base

## Architecture

### Technology Stack

**Backend (Python)**
- **FastAPI**: High-performance REST API with automatic documentation
- **LangGraph**: Multi-agent workflow orchestration framework
- **NetworkX**: Graph-based routing and network optimization
- **Pandas & NumPy**: Data processing and numerical computations
- **Groq API**: Large language model integration for AI Copilot

**Frontend (React + TypeScript)**
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling and development server
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent iconography

**Data & Infrastructure**
- **CSV-based Storage**: Direct file loading for districts, hospitals, shelters, warehouses, vehicles, incidents
- **JSON Scenarios**: Pre-configured disaster simulations
- **Synthetic Dataset**: Deterministic scenarios with seed: 42 for reproducibility
- **In-Memory Processing**: No database required - all data loaded into memory for fast operations
- **Docker Support**: Containerized deployment ready

### Multi-Agent Workflow

```
Command Agent (Orchestrator)
    ↓
Population Agent → Analyzes affected populations and displacement
    ↓
Shelter Agent → Assesses shelter capacity and availability
    ↓
Medical Agent → Evaluates medical needs and hospital capacity
    ↓
Food Agent → Determines food supply requirements
    ↓
Transport Agent → Plans vehicle routing and logistics
    ↓
Weather Agent → Provides environmental impact assessment
    ↓
Allocation Agent → Synthesizes inputs and optimizes resource distribution
```

## Features Implemented

### ✅ Completed Features

- [x] **Landing Page**: Professional introduction with animated cards and clear CTAs
- [x] **Interactive Dashboard**: Real-time command center with collapsible sidebar
- [x] **District Visualization**: Interactive map with 13 Andhra Pradesh districts
- [x] **Situation Map**: Visual representation of district status with severity indicators
- [x] **Simulation Engine**: Start simulations and trigger dynamic events
- [x] **Event System**: Flooding, road closures, supply shortages with immediate replanning
- [x] **Resource Allocation**: Automated distribution of food, medical supplies, and transport
- [x] **AI Copilot**: Natural language interface for operational queries
- [x] **Agent Coordination**: 7+ specialized agents working in concert
- [x] **Network Graph**: Visual representation of allocation flows and connections
- [x] **Priority Scoring**: Intelligent ranking based on multiple factors
- [x] **Comparative Analysis**: Before/after allocation comparison
- [x] **Status Tracking**: Real-time monitoring of simulation progress
- [x] **API Documentation**: Auto-generated Swagger/OpenAPI specs
- [x] **Environment Configuration**: Secure API key management

### 🎨 UI/UX Highlights

- Modern gradient design with professional color scheme
- Responsive layout for desktop and tablet viewing
- Smooth animations and transitions
- Collapsible sidebar for focused workflow
- Real-time status indicators and progress tracking
- Accessibility-friendly contrast and typography

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn package manager
- (Optional) Groq API key for AI Copilot features

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd reliefnet
```

**2. Set up the backend**
```bash
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

**3. Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

**4. Set up the frontend**
```bash
cd frontend
npm install
cd ..
```

### Running Locally

**Start the backend**
```bash
.venv\Scripts\activate
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**Start the frontend** (in a new terminal)
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

**Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Deployment with ngrok

For public access and demos:

```bash
# Install ngrok from https://ngrok.com/download

# Start backend and frontend as above, then:
ngrok http 5173 --log=stdout
```

The ngrok URL will be displayed in the terminal.

## Usage

### Quick Start Guide

1. **Launch Dashboard**: Open the application and click "Launch Dashboard" or "Explore Platform"
2. **Start Simulation**: Click "Start Simulation" to initialize the disaster scenario
3. **View District Status**: Observe the interactive map showing affected districts
4. **Trigger Events**: Use the event buttons to simulate dynamic situations:
   - Flooding in specific districts
   - Road closures disrupting logistics
   - Supply shortages at warehouses
5. **Query AI Copilot**: Ask questions about the situation in natural language
6. **Analyze Allocations**: Review resource distribution and priority rankings
7. **Monitor Network**: View the agent coordination graph and resource flows

### Example Queries for AI Copilot

- "Which districts need medical supplies most urgently?"
- "What is the current status of shelter capacity?"
- "How are food resources distributed across affected areas?"
- "Which routes are blocked by flooding?"
- "What are the top 3 priority districts right now?"

## Project Structure

```
reliefnet/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── simulation/
│   │   │   └── engine.py        # Core simulation logic
│   │   ├── agents/
│   │   │   ├── graph.py         # Multi-agent orchestration
│   │   │   └── __init__.py
│   │   ├── optimization/
│   │   │   └── allocation.py    # Resource allocation algorithms
│   │   ├── routing/
│   │   │   └── route_graph.py   # NetworkX-based routing
│   │   ├── rag/
│   │   │   └── knowledge.py     # Knowledge base and RAG
│   │   ├── ai/
│   │   │   └── groq_copilot.py  # Groq AI integration
│   │   └── database/
│   │       ├── models.py        # Data models
│   │       └── seed.py          # Synthetic data generation
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main application component
│   │   ├── LandingPage.tsx      # Landing page component
│   │   ├── main.tsx             # React entry point
│   │   ├── styles.css           # Global styles
│   │   └── landing.css          # Landing page styles
│   ├── package.json
│   └── vite.config.ts           # Vite configuration with proxy
├── data/
│   └── synthetic/               # Synthetic disaster datasets
├── docs/                        # Comprehensive documentation
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Data & Privacy

**⚠️ Important: All data is synthetic and for demonstration purposes only.**

This system uses synthetic datasets with a deterministic random seed (42) for reproducibility. The data includes:
- 13 districts of Andhra Pradesh
- Simulated population distributions
- Fictional hospital, shelter, and warehouse locations
- Synthetic disaster scenarios and weather conditions
- Randomly generated incident reports

**This system must never be used with real disaster data or for actual emergency response without proper validation, testing, and ethical review.**

## API Documentation

When the backend is running, comprehensive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Key endpoints:
- `POST /api/simulation/start` - Initialize a disaster scenario
- `POST /api/simulation/event` - Trigger dynamic events
- `GET /api/simulation/status` - Get current simulation state
- `POST /api/copilot/query` - Query the AI Copilot
- `GET /api/districts` - Retrieve district data
- `GET /api/allocations` - Get current resource allocations

## Contributing

Contributions are welcome! This project demonstrates:
- Multi-agent AI coordination patterns
- Real-time simulation architectures
- Full-stack TypeScript/Python development
- Humanitarian technology applications

## License

This project is provided for educational and demonstration purposes.

## Acknowledgments

- Inspired by real-world humanitarian logistics challenges
- Built with modern AI orchestration frameworks (LangGraph, MCP)
- Demonstrates Agent-to-Agent (A2A) communication patterns
- Synthetic data ensures ethical development and testing

## Contact & Support

For questions, issues, or collaboration opportunities, please open an issue on the repository.

---

**Built with ❤️ to demonstrate how AI can enhance disaster response and save lives.**
