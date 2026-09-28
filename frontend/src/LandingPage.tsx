import { useState } from 'react'

interface LandingPageProps {
  onEnterDashboard: () => void
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="brand-landing">
            <div className="brand-mark">RN</div>
            <div>
              <div className="brand-title">ReliefNet</div>
              <div className="brand-subtitle-landing">Connected for a Safer Tomorrow</div>
            </div>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#technology">Technology</a>
            <a href="#about">About</a>
            <button className="nav-cta" onClick={onEnterDashboard}>Launch Dashboard</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                AI-Powered <span className="highlight">Disaster Relief</span> Coordination
              </h1>
              <p className="hero-description">
                Resilient communication. Faster response. Safer communities.
                <br />
                <strong>Powered by multi-agent AI, 3GPP standards, and real-time optimization</strong> for reliable coordination in disaster scenarios.
              </p>
              <div className="hero-actions">
                <button className="primary-cta" onClick={onEnterDashboard}>
                  <span>Explore Platform</span>
                  <span className="arrow">→</span>
                </button>
                <button className="secondary-cta">
                  <span className="play-icon">▶</span>
                  Watch Demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">9</div>
                  <div className="stat-label">AI Agents</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">15</div>
                  <div className="stat-label">Districts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">&lt;6min</div>
                  <div className="stat-label">Replan Time</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Synthetic Data</div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-container">
                <div className="floating-card card-1">
                  <div className="card-icon">🚨</div>
                  <div className="card-content">
                    <div className="card-title">Emergency Alert</div>
                    <div className="card-text">Konaseema - Critical</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">🤖</div>
                  <div className="card-content">
                    <div className="card-title">AI Coordination</div>
                    <div className="card-text">9 Agents Active</div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">📡</div>
                  <div className="card-content">
                    <div className="card-title">Network Status</div>
                    <div className="card-text">43% Coverage</div>
                  </div>
                </div>
                <div className="hero-backdrop">
                  <svg viewBox="0 0 400 400" className="network-viz">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ff7a00', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#7b61ff', stopOpacity: 0.8 }} />
                      </linearGradient>
                    </defs>
                    {/* Network nodes and connections */}
                    <circle cx="200" cy="200" r="80" fill="url(#grad1)" opacity="0.2" className="pulse-circle" />
                    <circle cx="120" cy="150" r="12" fill="#ff7a00" />
                    <circle cx="280" cy="150" r="12" fill="#10b981" />
                    <circle cx="200" cy="250" r="12" fill="#7b61ff" />
                    <circle cx="150" cy="280" r="12" fill="#f59e0b" />
                    <circle cx="250" cy="280" r="12" fill="#ef4444" />
                    <line x1="200" y1="200" x2="120" y2="150" stroke="#ff7a00" strokeWidth="2" opacity="0.4" strokeDasharray="5,5" className="animated-line" />
                    <line x1="200" y1="200" x2="280" y2="150" stroke="#10b981" strokeWidth="2" opacity="0.4" strokeDasharray="5,5" className="animated-line" />
                    <line x1="200" y1="200" x2="200" y2="250" stroke="#7b61ff" strokeWidth="2" opacity="0.4" strokeDasharray="5,5" className="animated-line" />
                    <line x1="200" y1="200" x2="150" y2="280" stroke="#f59e0b" strokeWidth="2" opacity="0.4" strokeDasharray="5,5" className="animated-line" />
                    <line x1="200" y1="200" x2="250" y2="280" stroke="#ef4444" strokeWidth="2" opacity="0.4" strokeDasharray="5,5" className="animated-line" />
                    <circle cx="200" cy="200" r="20" fill="#ff7a00" />
                    <text x="200" y="205" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">AI</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="landing-container">
          <div className="section-header-landing">
            <span className="section-eyebrow">Core Capabilities</span>
            <h2 className="section-title">Why ReliefNet?</h2>
            <p className="section-description">Multi-agent AI system coordinating disaster relief operations with explainable decisions</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Coordination</h3>
              <p>9 specialized agents work in sequence to analyze population, medical, shelter, food, transport, weather, and network conditions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Optimization</h3>
              <p>Dynamic resource allocation using OR-Tools optimization engine with NetworkX routing for efficient relief distribution</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Adaptive Replanning</h3>
              <p>Instant recalculation when conditions change - road blockages, weather shifts, or new emergencies trigger automatic response updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📡</div>
              <h3>Network Monitoring</h3>
              <p>3GPP-based telecommunications tracking ensures connectivity status is factored into all coordination decisions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI Copilot</h3>
              <p>Natural language interface powered by Groq LLM provides instant answers grounded in live scenario data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Audit Trail</h3>
              <p>Every decision is logged with evidence, priorities, and reasoning for full transparency and accountability</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="landing-container">
          <div className="section-header-landing">
            <span className="section-eyebrow">Agent Pipeline</span>
            <h2 className="section-title">Multi-Agent Workflow</h2>
          </div>
          <div className="workflow-diagram">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Command Agent</h4>
                <p>Orchestrates the entire pipeline</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Analysis Agents</h4>
                <p>Population, Shelter, Medical, Food</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Infrastructure Agents</h4>
                <p>Transport, Weather, Network</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Allocation Agent</h4>
                <p>Final optimization and routing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section" id="technology">
        <div className="landing-container">
          <div className="section-header-landing">
            <span className="section-eyebrow">Built With</span>
            <h2 className="section-title">Technology Stack</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-logo">🐍</div>
              <div className="tech-name">Python</div>
              <div className="tech-desc">Backend & AI</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">⚡</div>
              <div className="tech-name">FastAPI</div>
              <div className="tech-desc">REST API</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🔗</div>
              <div className="tech-name">LangGraph</div>
              <div className="tech-desc">Agent Orchestration</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🔮</div>
              <div className="tech-name">Groq</div>
              <div className="tech-desc">LLM Inference</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🎯</div>
              <div className="tech-name">OR-Tools</div>
              <div className="tech-desc">Optimization</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🕸️</div>
              <div className="tech-name">NetworkX</div>
              <div className="tech-desc">Graph Routing</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">⚛️</div>
              <div className="tech-name">React</div>
              <div className="tech-desc">Frontend UI</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">📘</div>
              <div className="tech-name">TypeScript</div>
              <div className="tech-desc">Type Safety</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <h2>Ready to Explore?</h2>
            <p>Experience the full ReliefNet disaster coordination dashboard</p>
            <button className="cta-button" onClick={onEnterDashboard}>
              Launch Dashboard →
            </button>
            <div className="cta-note">
              <span className="badge synthetic">SYNTHETIC DATA</span>
              <span className="badge simulation">DEMO SIMULATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="about">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-mark">RN</div>
              <div>
                <div className="brand-title">ReliefNet</div>
                <p>AI Disaster Logistics & Relief Allocation Network</p>
              </div>
            </div>
            <div className="footer-info">
              <p><strong>Demonstration Project</strong></p>
              <p>Multi-agent system for disaster response coordination using LangGraph, 3GPP standards, and real-time optimization.</p>
              <p className="disclaimer">⚠️ All data is synthetic and deterministic (seed=42). Not for actual emergency use.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ReliefNet Project • Powered by AI & Open Standards</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
