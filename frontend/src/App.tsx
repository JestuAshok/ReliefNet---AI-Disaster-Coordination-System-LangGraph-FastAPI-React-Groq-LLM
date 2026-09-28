import { useEffect, useMemo, useState } from 'react'
import LandingPage from './LandingPage'
import './landing.css'

const API_BASE = ''

const sidebarGroups = [
  {
    title: 'Command',
    items: ['Command Center', 'Situation Map', 'Incidents'],
  },
  {
    title: 'Operations',
    items: ['Population', 'Shelters', 'Medical', 'Food', 'Transport', 'Relief Teams'],
  },
  {
    title: 'Network',
    items: ['Network Status', 'Connectivity', 'Infrastructure'],
  },
]

const fallbackMetricCards = [
  { label: 'Affected Population', value: '1.38M', change: '+12.4%', tone: 'orange' },
  { label: 'Active Incidents', value: '14', change: '4 critical', tone: 'red' },
  { label: 'Shelters At Risk', value: '18', change: '+6', tone: 'amber' },
  { label: 'Medical Demand', value: '9.2K', change: '+18%', tone: 'purple' },
  { label: 'Food Demand', value: '224K kg', change: '+25%', tone: 'teal' },
  { label: 'Available Transport', value: '64%', change: '9 vehicles', tone: 'green' },
  { label: 'Network Availability', value: '43%', change: '2 offline', tone: 'blue' },
  { label: 'Critical Zones', value: '05', change: '2 severe', tone: 'red' },
]

const fallbackDistrictRows = [
  { district: 'Konaseema', priority: '94 / 100', level: 'CRITICAL', flood: '96%', network: 'OFFLINE', icon: 'red' },
  { district: 'Kakinada', priority: '87 / 100', level: 'HIGH', flood: '91%', network: 'DEGRADED', icon: 'amber' },
  { district: 'East Godavari', priority: '84 / 100', level: 'HIGH', flood: '88%', network: 'DEGRADED', icon: 'amber' },
  { district: 'Krishna', priority: '72 / 100', level: 'HIGH', flood: '72%', network: 'OPERATIONAL', icon: 'teal' },
  { district: 'West Godavari', priority: '68 / 100', level: 'HIGH', flood: '85%', network: 'DEGRADED', icon: 'orange' },
]

const fallbackAllocationRows = [
  { id: 'ALLOC-0001', priority: 'CRITICAL', source: 'Warehouse W003', destination: 'Konaseema', resource: 'MEDICINE', quantity: '5,100 units', route: 'Route R008', eta: '145 min', risk: 'LOW', reason: 'Highest medical urgency combined with severe local shortage.', status: 'ACTIVE' },
  { id: 'ALLOC-0002', priority: 'HIGH', source: 'Warehouse W001', destination: 'Kakinada', resource: 'FOOD', quantity: '220,000 kg', route: 'Route R006', eta: '110 min', risk: 'MEDIUM', reason: 'Food demand exceeds local inventory and shelter occupancy is rising.', status: 'SCHEDULED' },
]

const fallbackTimeline = [
  { time: 'T+00', text: 'Simulation started.' },
  { time: 'T+02', text: 'Population Agent completed.' },
  { time: 'T+03', text: 'Shelter Agent detected capacity shortage.' },
  { time: 'T+04', text: 'Medical Agent detected medicine shortage.' },
  { time: 'T+05', text: 'Allocation completed.' },
  { time: 'T+30', text: 'Road R001 blocked.' },
  { time: 'T+31', text: 'Route recalculation started.' },
  { time: 'T+32', text: 'Allocation replanning started.' },
  { time: 'T+34', text: 'New optimal plan generated.' },
]

const fallbackAgents = [
  { name: 'Command Agent', status: 'COMPLETED', time: '3.1s', input: 'Scenario snapshot', output: 'Orchestrated flow', tools: 'StateManager' },
  { name: 'Population Agent', status: 'COMPLETED', time: '1.4s', input: 'District data', output: 'Affected + displaced', tools: 'MCP / dataset' },
  { name: 'Shelter Agent', status: 'COMPLETED', time: '0.9s', input: 'Capacity + occupancy', output: 'Shortage = 278k', tools: 'MCP / rules' },
  { name: 'Medical Agent', status: 'COMPLETED', time: '1.2s', input: 'Hospital stock', output: 'Medical demand = 9.2k', tools: 'Rules / optimizer' },
  { name: 'Transport Agent', status: 'WARNING', time: '1.8s', input: 'Road risk', output: 'Route ETA increased', tools: 'NetworkX' },
  { name: 'Network Agent', status: 'COMPLETED', time: '0.8s', input: 'Tower health', output: '43% network availability', tools: 'MCP / telemetry' },
]

const sectionInsights: Record<string, { label: string; value: string; change: string; tone: string }[]> = {
  'Command Center': [
    { label: 'Critical Districts', value: '03', change: 'Konaseema priority', tone: 'red' },
    { label: 'Shelter Deficit', value: '27,000', change: 'Across 4 hubs', tone: 'amber' },
    { label: 'Network loss', value: '43%', change: '1 corridor down', tone: 'blue' },
  ],
  'Situation Map': [
    { label: 'Flood Risk', value: '96%', change: 'Konaseema', tone: 'red' },
    { label: 'Road Block', value: 'R001', change: 'Primary corridor', tone: 'orange' },
    { label: 'Relief Re-route', value: '145 min', change: 'ETA shift', tone: 'purple' },
  ],
  Incidents: [
    { label: 'Critical alerts', value: '04', change: '3 severe', tone: 'red' },
    { label: 'Road disruption', value: 'R001', change: 'Closed', tone: 'orange' },
    { label: 'Trigger type', value: 'Flood', change: 'Coastal surge', tone: 'purple' },
  ],
  Population: [
    { label: 'Affected', value: '320K', change: 'Konaseema', tone: 'orange' },
    { label: 'Displaced', value: '140K', change: 'Highest cluster', tone: 'red' },
    { label: 'Vulnerable', value: '70K', change: 'Children + elderly', tone: 'purple' },
  ],
  Shelters: [
    { label: 'At Risk', value: '02', change: 'Critical hubs', tone: 'red' },
    { label: 'Available', value: '7K', change: 'Konaseema', tone: 'green' },
    { label: 'Need Reinforcement', value: '4', change: 'Shelter clusters', tone: 'amber' },
  ],
  Medical: [
    { label: 'ICU', value: '15', change: 'Available', tone: 'purple' },
    { label: 'Bed load', value: '180/420', change: 'Konaseema', tone: 'red' },
    { label: 'Medical stock', value: '6.4K', change: 'Units', tone: 'teal' },
  ],
  Food: [
    { label: 'Rice stock', value: '360K kg', change: 'W003', tone: 'green' },
    { label: 'Water stock', value: '290K L', change: 'W003', tone: 'teal' },
    { label: 'Meals ready', value: '82K', change: 'Prepared', tone: 'orange' },
  ],
  Transport: [
    { label: 'Vehicles', value: '10', change: 'Active', tone: 'green' },
    { label: 'Roads open', value: '03', change: 'Alternate routes', tone: 'blue' },
    { label: 'ETA shift', value: '+35 min', change: 'R001 blocked', tone: 'amber' },
  ],
  'Relief Teams': [
    { label: 'Teams deployed', value: '08', change: '2 aerial', tone: 'green' },
    { label: 'Coverage gap', value: '12%', change: 'Coastal belt', tone: 'amber' },
    { label: 'Tasking load', value: '76%', change: 'Escalated', tone: 'orange' },
  ],
  'Network Status': [
    { label: 'Offline sites', value: '01', change: 'Konaseema', tone: 'red' },
    { label: 'Coverage', value: '43%', change: 'Coastal zone', tone: 'blue' },
    { label: 'Backup power', value: '2 hrs', change: 'Critical site', tone: 'amber' },
  ],
  Connectivity: [
    { label: 'Connected zones', value: '27%', change: 'Low coverage', tone: 'blue' },
    { label: 'Cell uptime', value: '61%', change: 'Degraded', tone: 'amber' },
    { label: 'Critical path', value: 'N001', change: 'Offline', tone: 'red' },
  ],
  Infrastructure: [
    { label: 'Bridge access', value: '2', change: 'Flooded', tone: 'red' },
    { label: 'Power backup', value: '2 hrs', change: 'Critical cells', tone: 'amber' },
    { label: 'Maintenance', value: '04', change: 'Priority tasks', tone: 'blue' },
  ],
  'AI Copilot': [
    { label: 'Confidence', value: '93%', change: 'Priority ranking', tone: 'green' },
    { label: 'Decision', value: 'Med first', change: 'Konaseema', tone: 'purple' },
    { label: 'Replan trigger', value: 'Road block', change: 'Route update', tone: 'orange' },
  ],
  'Agent Network': [
    { label: 'Completed', value: '09', change: 'Agent runs', tone: 'green' },
    { label: 'Critical path', value: 'Allocation', change: 'Sequence active', tone: 'purple' },
    { label: 'Status', value: 'Stable', change: 'No deadlock', tone: 'blue' },
  ],
  'Allocation Engine': [
    { label: 'Assignments', value: '12', change: 'Priority queue', tone: 'green' },
    { label: 'Conflict rate', value: '8%', change: 'Low', tone: 'blue' },
    { label: 'Need split', value: '04', change: 'Rebalance', tone: 'amber' },
  ],
  'Route Optimizer': [
    { label: 'Optimal routes', value: '07', change: 'Recalculated', tone: 'green' },
    { label: 'Blocked corridors', value: '02', change: 'R001 + R006', tone: 'red' },
    { label: 'ETA delta', value: '+35 min', change: 'Detour', tone: 'orange' },
  ],
  '3GPP Standards': [
    { label: 'Profiles', value: '05', change: 'Active', tone: 'blue' },
    { label: 'Coverage model', value: '5G', change: 'Fallback mode', tone: 'purple' },
    { label: 'Priority rule', value: 'QoS', change: 'Mission-critical', tone: 'green' },
  ],
  'Evidence Explorer': [
    { label: 'Evidence sets', value: '18', change: 'Active', tone: 'blue' },
    { label: 'Confidence', value: '0.93', change: 'High', tone: 'green' },
    { label: 'Case links', value: '22', change: 'Related', tone: 'purple' },
  ],
  'Scenario Knowledge': [
    { label: 'Scenarios', value: '14', change: 'Known', tone: 'green' },
    { label: 'Flood path', value: 'Coastal', change: 'Resolved', tone: 'orange' },
    { label: 'Learned rule', value: 'Evacuate', change: 'Trigger present', tone: 'red' },
  ],
  'Situation Analytics': [
    { label: 'Risk index', value: '83', change: 'Rising', tone: 'red' },
    { label: 'Trend', value: '+14%', change: 'Last 3h', tone: 'orange' },
    { label: 'Signal', value: 'Flood surge', change: 'Confirmed', tone: 'purple' },
  ],
  'Resource Analytics': [
    { label: 'Inventory gap', value: '16%', change: 'Food', tone: 'amber' },
    { label: 'Stock cover', value: '5.2 days', change: 'Average', tone: 'green' },
    { label: 'Risk clusters', value: '03', change: 'Critical', tone: 'red' },
  ],
  'Response Performance': [
    { label: 'Response time', value: '48 min', change: 'Baseline', tone: 'green' },
    { label: 'Replan cycle', value: '6 min', change: 'Adaptive', tone: 'blue' },
    { label: 'Teams engaged', value: '68%', change: 'Active', tone: 'orange' },
  ],
  'Simulation Control': [
    { label: 'Clock', value: 'T+34', change: 'Active', tone: 'green' },
    { label: 'Scenario', value: 'Flood surge', change: 'Live', tone: 'purple' },
    { label: 'Mode', value: 'Dynamic', change: 'Replanning', tone: 'orange' },
  ],
  'Scenario Builder': [
    { label: 'Templates', value: '12', change: 'Ready', tone: 'green' },
    { label: 'Current config', value: 'Coastal flood', change: 'Active', tone: 'purple' },
    { label: 'Load state', value: 'Stable', change: 'Balanced', tone: 'blue' },
  ],
  'Event Timeline': [
    { label: 'Events', value: '09', change: 'Logged', tone: 'blue' },
    { label: 'Most recent', value: 'Road block', change: 'R001', tone: 'red' },
    { label: 'Response', value: 'Replan', change: 'Triggered', tone: 'orange' },
  ],
  'Audit Logs': [
    { label: 'Audit records', value: '142', change: 'Indexed', tone: 'green' },
    { label: 'Critical checks', value: '07', change: 'Pass', tone: 'blue' },
    { label: 'Last event', value: 'Allocation', change: 'Validated', tone: 'purple' },
  ],
  'Data Sources': [
    { label: 'Files', value: '09', change: 'Synthetic feeds', tone: 'green' },
    { label: 'Integrity', value: '99.8%', change: 'Validated', tone: 'blue' },
    { label: 'Refresh', value: 'T+34', change: 'Live sync', tone: 'orange' },
  ],
  Settings: [
    { label: 'Mode', value: 'Synthetic', change: 'Deterministic', tone: 'green' },
    { label: 'Alerts', value: 'Enabled', change: 'Ops', tone: 'blue' },
    { label: 'Policy', value: 'A2/ESRI', change: 'Standard', tone: 'purple' },
  ],
}

const shelterRows = [
  { name: 'Konaseema Relief Center', district: 'Konaseema', capacity: '42,000', occupied: '35,000', available: '7,000', status: 'AT_RISK' },
  { name: 'Kakinada Evac Hub', district: 'Kakinada', capacity: '31,000', occupied: '26,000', available: '5,000', status: 'OPEN' },
  { name: 'East Godavari Transit Camp', district: 'East Godavari', capacity: '28,000', occupied: '23,000', available: '5,000', status: 'OPEN' },
  { name: 'Krishna Shelter Cluster', district: 'Krishna', capacity: '26,000', occupied: '22,000', available: '4,000', status: 'NEAR_FULL' },
]

const hospitalRows = [
  { name: 'Konaseema General Hospital', district: 'Konaseema', beds: '420', available: '180', icu: '40', icuAvailable: '15', stock: '6,400', status: 'AT_RISK' },
  { name: 'Kakinada District Hospital', district: 'Kakinada', beds: '360', available: '170', icu: '35', icuAvailable: '14', stock: '5,700', status: 'OPEN' },
  { name: 'East Godavari Medical Center', district: 'East Godavari', beds: '460', available: '210', icu: '48', icuAvailable: '16', stock: '7,100', status: 'OPEN' },
  { name: 'West Godavari Trauma Center', district: 'West Godavari', beds: '330', available: '140', icu: '28', icuAvailable: '9', stock: '4,800', status: 'DEGRADED' },
]

const foodRows = [
  { warehouse: 'W003', district: 'Konaseema', rice: '360,000 kg', water: '290,000 L', meals: '82,000', medicalKits: '300', days: '5' },
  { warehouse: 'W001', district: 'Kakinada', rice: '420,000 kg', water: '350,000 L', meals: '96,000', medicalKits: '320', days: '6' },
  { warehouse: 'W002', district: 'East Godavari', rice: '390,000 kg', water: '310,000 L', meals: '87,000', medicalKits: '280', days: '5' },
  { warehouse: 'W005', district: 'Visakhapatnam', rice: '450,000 kg', water: '380,000 L', meals: '98,000', medicalKits: '340', days: '7' },
]

const networkRows = [
  { site: 'N001', district: 'Konaseema', type: 'Macrocell', status: 'OFFLINE', coverage: '0%', users: '0', backup: '2 hrs' },
  { site: 'N002', district: 'Kakinada', type: 'Macrocell', status: 'DEGRADED', coverage: '54%', users: '15,500', backup: '8 hrs' },
  { site: 'N003', district: 'East Godavari', type: 'Macrocell', status: 'DEGRADED', coverage: '61%', users: '18,000', backup: '6 hrs' },
  { site: 'N005', district: 'West Godavari', type: 'Macrocell', status: 'DEGRADED', coverage: '58%', users: '17,000', backup: '7 hrs' },
]

const vehicleRows = [
  { id: 'V003', type: 'AMBULANCE', district: 'Konaseema', fuel: '91%', status: 'AVAILABLE', capability: 'Medical' },
  { id: 'V005', type: 'BUS', district: 'Konaseema', fuel: '68%', status: 'AVAILABLE', capability: 'Shelter' },
  { id: 'V004', type: 'AMBULANCE', district: 'Kakinada', fuel: '74%', status: 'AVAILABLE', capability: 'Medical' },
  { id: 'V006', type: 'WATER_TANKER', district: 'Krishna', fuel: '63%', status: 'AVAILABLE', capability: 'Water' },
]

const formatCount = (value: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
const formatCompact = (value: number) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

interface SituationMapVisualProps {
  districts: any[]
  allocations: any[]
  status: string
}

function SituationMapVisual({ districts, allocations, status }: SituationMapVisualProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  // Calculate positions for districts based on real data
  const districtPositions: Record<string, { x: number; y: number; size: number }> = {
    'Visakhapatnam': { x: 850, y: 120, size: 2.3 },
    'Vizianagaram': { x: 750, y: 80, size: 1.0 },
    'Srikakulam': { x: 680, y: 40, size: 1.2 },
    'Kakinada': { x: 650, y: 200, size: 1.2 },
    'Konaseema': { x: 550, y: 280, size: 1.75 },
    'East Godavari': { x: 700, y: 250, size: 1.65 },
    'West Godavari': { x: 480, y: 320, size: 1.65 },
    'Krishna': { x: 380, y: 380, size: 1.43 },
    'Guntur': { x: 300, y: 340, size: 2.2 },
    'Prakasam': { x: 250, y: 410, size: 1.7 },
    'Nellore': { x: 380, y: 450, size: 1.3 },
    'Bapatla': { x: 200, y: 360, size: 1.1 },
    'Anantapur': { x: 120, y: 280, size: 1.6 },
    'YSR Kadapa': { x: 200, y: 440, size: 1.7 },
    'Chittoor': { x: 280, y: 460, size: 1.9 },
  }

  const getDistrictData = (name: string) => {
    return districts.find(d => d.district_name === name)
  }

  const getDistrictStatus = (district: any) => {
    if (!district) return 'normal'
    const floodRisk = Number(district.baseline_flood_risk) || 0
    if (floodRisk > 0.9) return 'critical'
    if (floodRisk > 0.75) return 'high'
    if (floodRisk > 0.5) return 'medium'
    return 'normal'
  }

  const getActiveAllocations = () => {
    return allocations.filter(a => a.status === 'ACTIVE' || a.status === 'SCHEDULED')
  }

  const displayDistrict = hoveredDistrict || selectedDistrict
  const displayData = displayDistrict ? getDistrictData(displayDistrict) : null

  return (
    <div className="ap-map enhanced" aria-label="Emergency response situation map">
      {/* Background layers */}
      <div className="map-water water-one" />
      <div className="map-water water-two" />
      <div className="map-terrain terrain-one" />
      <div className="map-terrain terrain-two" />

      {/* Route lines */}
      <svg className="map-routes" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true">
        {/* Main highway corridors */}
        <path className="route-normal" d="M850 120 L650 200 L550 280 L380 380" strokeWidth="3" />
        <path className="route-normal" d="M700 250 L550 280 L480 320" strokeWidth="3" />
        <path className="route-blocked" d="M550 280 L480 320 L380 380" strokeWidth="4" strokeDasharray="8,4" />
        
        {/* Active allocation routes */}
        {getActiveAllocations().map((alloc, idx) => {
          const destPos = districtPositions[alloc.destination]
          if (!destPos) return null
          const startX = idx % 2 === 0 ? 100 : 900
          const startY = 50 + (idx * 30)
          return (
            <g key={alloc.id}>
              <path
                className={`allocation-route ${alloc.priority === 'CRITICAL' ? 'critical' : 'normal'}`}
                d={`M${startX} ${startY} Q${(startX + destPos.x) / 2} ${(startY + destPos.y) / 2 - 50} ${destPos.x} ${destPos.y}`}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
              <circle className="route-marker" cx={startX} cy={startY} r="6" fill="#10b981" />
            </g>
          )
        })}
      </svg>

      {/* District markers */}
      {Object.entries(districtPositions).map(([name, pos]) => {
        const districtData = getDistrictData(name)
        const status = getDistrictStatus(districtData)
        const population = districtData ? Number(districtData.population) || 0 : 0
        const floodRisk = districtData ? Number(districtData.baseline_flood_risk) || 0 : 0
        const isActive = selectedDistrict === name || hoveredDistrict === name

        return (
          <div
            key={name}
            className={`district-marker ${status} ${isActive ? 'active' : ''}`}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.2 : 1})`,
            }}
            onMouseEnter={() => setHoveredDistrict(name)}
            onMouseLeave={() => setHoveredDistrict(null)}
            onClick={() => setSelectedDistrict(selectedDistrict === name ? null : name)}
          >
            <div className="marker-dot" style={{ width: `${pos.size * 12}px`, height: `${pos.size * 12}px` }}>
              {status === 'critical' && <span className="pulse-ring" />}
            </div>
            <span className="marker-label">{name}</span>
            {floodRisk > 0.7 && (
              <span className="flood-indicator" title={`${Math.round(floodRisk * 100)}% flood risk`}>
                🌊
              </span>
            )}
          </div>
        )
      })}

      {/* Warehouse/Relief hubs */}
      <div className="map-site site-one warehouse" style={{ left: '100px', top: '50px' }}>
        <b>W001</b><span>Warehouse · Food Hub</span>
      </div>
      <div className="map-site site-one warehouse" style={{ left: '900px', top: '80px' }}>
        <b>W003</b><span>Warehouse · Medicine</span>
      </div>

      {/* Network sites */}
      <div className="map-site site-two network offline" style={{ left: '550px', top: '280px' }}>
        <b>N001</b><span>Network site · OFFLINE</span>
      </div>
      <div className="map-site site-two network degraded" style={{ left: '650px', top: '200px' }}>
        <b>N002</b><span>Network site · DEGRADED</span>
      </div>

      {/* Road closure warning */}
      {status === 'DYNAMIC REPLANNING' && (
        <div className="map-site site-three warning" style={{ left: '480px', top: '320px' }}>
          <b>!</b><span>Road R001 BLOCKED</span>
        </div>
      )}

      {/* District detail callout */}
      {displayData && (
        <div 
          className="map-callout enhanced" 
          style={{ 
            left: `${districtPositions[displayDistrict!].x + 40}px`, 
            top: `${districtPositions[displayDistrict!].y - 60}px` 
          }}
        >
          <strong>{displayDistrict}</strong>
          <div className="callout-details">
            <span>Population: {formatCompact(Number(displayData.population))}</span>
            <span>Flood Risk: {Math.round(Number(displayData.baseline_flood_risk) * 100)}%</span>
            <span className={`status-badge ${getDistrictStatus(displayData)}`}>
              {getDistrictStatus(displayData).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Active allocations legend */}
      <div className="map-legend-box">
        <h4>Active Allocations</h4>
        {getActiveAllocations().slice(0, 3).map((alloc) => (
          <div key={alloc.id} className="legend-item">
            <span className={`legend-dot ${alloc.priority === 'CRITICAL' ? 'critical' : 'normal'}`} />
            <span>{alloc.destination}: {alloc.resource} ({alloc.eta})</span>
          </div>
        ))}
      </div>

      {/* Map controls */}
      <div className="map-status-indicator">
        <span className={`status-dot ${status === 'DYNAMIC REPLANNING' ? 'warning' : 'active'}`} />
        <span>{status}</span>
      </div>
    </div>
  )
}

function ResponseTrendChart() {
  return (
    <section className="response-chart" aria-label="Response readiness trend">
      <div className="chart-heading"><div><span className="eyebrow">LIVE TREND</span><h3>Response readiness</h3></div><div className="chart-key"><span><i className="key-line teal" />Coverage</span><span><i className="key-line orange" />Response load</span></div></div>
      <svg viewBox="0 0 740 160" className="trend-svg" role="img" aria-label="Coverage improves while response load stabilizes over six hours">
        <g className="chart-grid"><line x1="20" y1="25" x2="720" y2="25" /><line x1="20" y1="75" x2="720" y2="75" /><line x1="20" y1="125" x2="720" y2="125" /></g>
        <path className="trend-area" d="M25 115 L145 102 L265 76 L385 88 L505 56 L625 42 L715 50 L715 140 L25 140 Z" />
        <polyline className="trend-line coverage" points="25,115 145,102 265,76 385,88 505,56 625,42 715,50" />
        <polyline className="trend-line demand" points="25,98 145,90 265,106 385,80 505,92 625,75 715,82" />
        <g className="chart-dots"><circle cx="25" cy="115" r="4" /><circle cx="265" cy="76" r="4" /><circle cx="505" cy="56" r="4" /><circle cx="715" cy="50" r="4" /></g>
      </svg>
      <div className="chart-axis"><span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>Now</span></div>
    </section>
  )
}

function CycloneTracker() {
  return (
    <section className="cyclone-tracker" aria-label="Live Cyclone Michgaun tracker">
      <div className="cyclone-title">
        <span className="cyclone-icon">◉</span>
        <div><span className="eyebrow">SYNTHETIC LIVE TRACKER</span><h2>Cyclone Michgaun</h2><p>Severe cyclonic storm · coastal Andhra response zone</p></div>
      </div>
      <div className="cyclone-route">
        <div className="cyclone-stop active"><span className="stop-dot" /><div><strong>Now · Offshore Kakinada</strong><small>16.9°N, 82.4°E · moving WNW</small></div></div>
        <div className="route-line" />
        <div className="cyclone-stop"><span className="stop-dot" /><div><strong>Next 6 hours · Konaseema coast</strong><small>Expected landfall corridor · 18:30 IST</small></div></div>
        <div className="route-line faint" />
        <div className="cyclone-stop"><span className="stop-dot" /><div><strong>Next 12 hours · East Godavari</strong><small>Weakening inland · heavy rainfall risk</small></div></div>
      </div>
      <div className="cyclone-metrics"><div><span>Wind</span><strong>105 km/h</strong></div><div><span>Movement</span><strong>18 km/h WNW</strong></div><div><span>Rainfall</span><strong>180–220 mm</strong></div></div>
    </section>
  )
}

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [districts, setDistricts] = useState<any[]>([])
  const [population, setPopulation] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>(fallbackAgents)
  const [allocations, setAllocations] = useState<any[]>(fallbackAllocationRows)
  const [timeline, setTimeline] = useState<any[]>(fallbackTimeline)
  const [scenario, setScenario] = useState('Severe Coastal Andhra Flood')
  const [status, setStatus] = useState('SIMULATION ACTIVE')
  const [selectedNav, setSelectedNav] = useState('Command Center')
  const [activeArea, setActiveArea] = useState('Command')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copilotQuestion, setCopilotQuestion] = useState('Which district should receive medicine first, and why?')
  const [copilotAnswer, setCopilotAnswer] = useState('Ask the copilot for a recommendation grounded in the current synthetic scenario.')
  const [copilotStatus, setCopilotStatus] = useState('READY')
  const [copilotNotice, setCopilotNotice] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [districtsResult, populationResult, agentResult, auditResult] = await Promise.all([
        fetchJson<{ districts: any[] }>('/api/districts'),
        fetchJson<{ population: any[] }>('/api/population'),
        fetchJson<{ agents: any[] }>('/api/agents/status'),
        fetchJson<{ audit: any[] }>('/api/audit'),
      ])

      setDistricts(districtsResult.districts ?? [])
      setPopulation(populationResult.population ?? [])
      setAgents(agentResult.agents ?? fallbackAgents)

      if (auditResult.audit?.length) {
        const newest = auditResult.audit[auditResult.audit.length - 1]
        setScenario(newest.event ?? scenario)
      }
    } catch (err) {
      setError('Backend unavailable; showing synthetic fallback values.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showLanding) {
      void loadDashboardData()
    }
  }, [showLanding])

  const metricCards = useMemo(() => {
    if (!districts.length && !population.length) return fallbackMetricCards

    const totalAffected = population.reduce((sum, item) => sum + (Number(item.affected_population) || 0), 0)
    const totalPopulation = districts.reduce((sum, item) => sum + (Number(item.population) || 0), 0)
    const highestFlood = districts.reduce((peak, item) => Math.max(peak, Number(item.baseline_flood_risk) || 0), 0)
    const criticalZones = districts.filter((item) => Number(item.baseline_flood_risk) > 0.8).length

    return [
      { label: 'Affected Population', value: `${formatCompact(totalAffected)}`, change: '+12.4%', tone: 'orange' },
      { label: 'Active Incidents', value: String(Math.max(10, criticalZones + 5)), change: `${criticalZones} critical`, tone: 'red' },
      { label: 'Shelters At Risk', value: String(Math.max(12, Math.round(totalPopulation / 100000))), change: '+6', tone: 'amber' },
      { label: 'Medical Demand', value: `${formatCompact(Math.max(9000, totalAffected / 35))}`, change: '+18%', tone: 'purple' },
      { label: 'Food Demand', value: `${formatCompact(Math.max(210000, totalAffected * 0.7))} kg`, change: '+25%', tone: 'teal' },
      { label: 'Available Transport', value: `${Math.max(42, Math.round(100 - (highestFlood * 36)))}%`, change: '9 vehicles', tone: 'green' },
      { label: 'Network Availability', value: `${Math.max(38, Math.round((1 - highestFlood) * 100))}%`, change: '2 offline', tone: 'blue' },
      { label: 'Critical Zones', value: `${String(criticalZones).padStart(2, '0')}`, change: '2 severe', tone: 'red' },
    ]
  }, [districts, population])

  const districtRows = useMemo(() => {
    if (!districts.length) return fallbackDistrictRows

    return [...districts]
      .sort((a, b) => (Number(b.baseline_flood_risk) || 0) - (Number(a.baseline_flood_risk) || 0))
      .slice(0, 5)
      .map((district) => {
        const flood = Number(district.baseline_flood_risk) || 0
        const priority = Math.min(99, Math.round(flood * 100))
        const network = flood > 0.9 ? 'OFFLINE' : flood > 0.75 ? 'DEGRADED' : 'OPERATIONAL'
        const icon = flood > 0.9 ? 'red' : flood > 0.75 ? 'amber' : 'teal'

        return {
          district: district.district_name,
          priority: `${priority} / 100`,
          level: flood > 0.9 ? 'CRITICAL' : flood > 0.75 ? 'HIGH' : 'MEDIUM',
          flood: `${Math.round(flood * 100)}%`,
          network,
          icon,
        }
      })
  }, [districts])

  const handleStartSimulation = async () => {
    try {
      setLoading(true)
      const payload = await fetchJson<{ status: string; scenario: string; priority_scores: Record<string, any> }>('/api/simulation/start', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setStatus('SIMULATION ACTIVE')
      setScenario(payload.scenario || scenario)
      setTimeline((current) => [{ time: 'T+00', text: 'Simulation started from backend.' }, ...current].slice(0, 9))
    } catch (error) {
      setError('Unable to start simulation from backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerEvent = async () => {
    try {
      setLoading(true)
      const payload = await fetchJson<{ status: string; event: string; new_plan: any[]; old_plan: any[] }>('/api/simulation/events', {
        method: 'POST',
        body: JSON.stringify({ type: 'road_blocked' }),
      })

      setStatus('DYNAMIC REPLANNING')
      if (payload.new_plan?.length) {
        setAllocations(
          payload.new_plan.map((item, index) => ({
            id: `ALLOC-${String(index + 1).padStart(4, '0')}`,
            priority: index === 0 ? 'CRITICAL' : 'HIGH',
            source: item.route?.split('->')[0] ?? 'Warehouse',
            destination: item.district,
            resource: item.resource,
            quantity: `${formatCount(item.quantity)} units`,
            route: item.route,
            eta: `${item.eta} min`,
            risk: index === 0 ? 'LOW' : 'MEDIUM',
            reason: 'Route blocked; system re-optimized for lowest-risk delivery path.',
            status: 'ACTIVE',
          })),
        )
      }

      setTimeline((current) => [
        { time: 'T+30', text: `Backend event fired: ${payload.event}.` },
        { time: 'T+31', text: 'Route recalculation started.' },
        { time: 'T+32', text: 'Allocation replanning started.' },
        ...current,
      ].slice(0, 9))
    } catch (error) {
      setError('Unable to trigger event through backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleRunAllocation = async () => {
    try {
      setLoading(true)
      const payload = await fetchJson<{ status: string; allocations: any[] }>('/api/allocation/run', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setStatus('SIMULATION ACTIVE')
      setAllocations(
        payload.allocations?.map((item, index) => ({
          id: `ALLOC-${String(index + 1).padStart(4, '0')}`,
          priority: item.priority > 90 ? 'CRITICAL' : 'HIGH',
          source: item.route?.split('->')[0] ?? 'Warehouse',
          destination: item.district,
          resource: item.resource,
          quantity: `${formatCount(item.quantity)} units`,
          route: item.route,
          eta: `${item.eta} min`,
          risk: item.priority > 90 ? 'LOW' : 'MEDIUM',
          reason: 'Resource allocation based on current district priority and inventory demand.',
          status: 'ACTIVE',
        })) ?? fallbackAllocationRows,
      )
    } catch (error) {
      setError('Unable to run allocation from backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleRunReplanning = async () => {
    try {
      setLoading(true)
      const payload = await fetchJson<{ status: string; event: string; new_plan: any[] }>('/api/replanning/run', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setStatus('DYNAMIC REPLANNING')
      if (payload.new_plan?.length) {
        setAllocations(
          payload.new_plan.map((item, index) => ({
            id: `ALLOC-${String(index + 1).padStart(4, '0')}`,
            priority: 'HIGH',
            source: item.route?.split('->')[0] ?? 'Warehouse',
            destination: item.district,
            resource: item.resource,
            quantity: `${formatCount(item.quantity)} units`,
            route: item.route,
            eta: `${item.eta} min`,
            risk: 'MEDIUM',
            reason: 'Replanned route after disruption to preserve logistics continuity.',
            status: 'ACTIVE',
          })),
        )
      }
    } catch (error) {
      setError('Unable to run replanning from backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopilotQuery = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!copilotQuestion.trim()) return

    try {
      setLoading(true)
      setCopilotNotice(null)
      const payload = await fetchJson<{ answer: string; status: string; notice?: string; model?: string }>('/api/copilot/query', {
        method: 'POST',
        body: JSON.stringify({ question: copilotQuestion }),
      })
      setCopilotAnswer(payload.answer)
      setCopilotStatus(payload.model ? `${payload.status} · ${payload.model}` : payload.status)
      setCopilotNotice(payload.notice ?? null)
    } catch (error) {
      setCopilotNotice('The copilot could not be reached. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const renderMainContent = () => {
    const renderInsightSummary = (view = selectedNav) => {
      const insightCards = sectionInsights[view] ?? sectionInsights['Command Center']

      return (
        <section className="insight-grid">
          {insightCards.map((card) => (
            <div key={`${view}-${card.label}`} className="insight-card">
              <div className="metric-label">{card.label}</div>
              <div className="metric-value">{card.value}</div>
              <div className={`metric-change tone-${card.tone}`}>{card.change}</div>
            </div>
          ))}
        </section>
      )
    }

    const renderDetailSection = (
      title: string,
      rows: Array<{ label: string; value: string; detail: string }>,
      notes: Array<{ time: string; text: string }>
    ) => (
      <>
        {renderInsightSummary(title)}
        <div className="lower-grid">
          <section className="panel">
            <div className="panel-title-row">
              <h3>{title}</h3>
            </div>
            <div className="allocation-list">
              {rows.map((row) => (
                <div key={`${title}-${row.label}`} className="allocation-card">
                  <div className="allocation-topline">
                    <strong>{row.label}</strong>
                    <span className="allocation-level">ACTIVE</span>
                  </div>
                  <div className="allocation-meta">{row.value}</div>
                  <div className="allocation-reason">{row.detail}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title-row">
              <h3>Operational Notes</h3>
            </div>
            <div className="timeline-list">
              {notes.map((item) => (
                <div className="timeline-item" key={`${title}-${item.time}`}>
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-text">{item.text}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </>
    )

    if (selectedNav === 'Situation Map') {
      return (
        <>
          {renderInsightSummary('Situation Map')}
          <section className="map-panel">
            <div className="section-header">
              <h3>Situation Map</h3>
              <div className="map-legend">
                <span><i className="legend-swatch green" /> Operational</span>
                <span><i className="legend-swatch orange" /> Warning</span>
                <span><i className="legend-swatch red" /> Critical</span>
                <span><i className="legend-swatch purple" /> AI priority</span>
              </div>
            </div>
            <SituationMapVisual districts={districts} allocations={allocations} status={status} />
          </section>
        </>
      )
    }

    if (selectedNav === 'Population') {
      return renderDetailSection(
        'Population Impact',
        [
          { label: 'Konaseema', value: '320,000 affected', detail: 'Coastal flood surge has pushed vulnerable families into emergency displacement.' },
          { label: 'Kakinada', value: '285,000 affected', detail: 'Population density and road disruption is increasing shelter demand.' },
          { label: 'East Godavari', value: '210,000 affected', detail: 'Mobility constraints are limiting access to support hubs.' },
          { label: 'West Godavari', value: '230,000 affected', detail: 'Flood stress is spreading beyond the primary corridor.' },
        ],
        [
          { time: 'Children', text: '56,000 at risk in Konaseema' },
          { time: 'Elderly', text: '26,000 under vulnerable care load' },
          { time: 'Critical', text: '31,000 currently require urgent support' },
          { time: 'Displaced', text: '140,000 people are shelter-seeking' },
        ]
      )
    }

    if (selectedNav === 'Shelters') {
      return renderDetailSection(
        'Shelter Capacity',
        [
          { label: 'Konaseema Relief Center', value: '7,000 spaces left', detail: 'This shelter is under acute risk and needs reinforcement.' },
          { label: 'Kakinada Evac Hub', value: '5,000 spaces left', detail: 'Buffer stock remains manageable but food load is rising.' },
          { label: 'East Godavari Transit Camp', value: '5,000 spaces left', detail: 'Transit demand is holding, with moderate congestion.' },
          { label: 'Krishna Shelter Cluster', value: 'Near full', detail: 'This group is approaching critical occupancy.' },
        ],
        [
          { time: 'Kona', text: 'Only 7,000 spaces remain; flood risk 0.92' },
          { time: 'Kakinada', text: '5,000 spaces remain with food stock for 5 days' },
          { time: 'Krishna', text: 'Nearly full and requires reinforcement' },
          { time: 'West Godavari', text: 'Limited space and medical support available' },
        ]
      )
    }

    if (selectedNav === 'Medical') {
      return renderDetailSection(
        'Hospital Capacity',
        [
          { label: 'Konaseema General Hospital', value: '15 ICU beds available', detail: 'Medical load remains high and requires surge support.' },
          { label: 'Kakinada District Hospital', value: '170/360 beds open', detail: 'Operational capacity is stable but demand is climbing.' },
          { label: 'East Godavari Medical Center', value: '7,100 stock units', detail: 'This site has the strongest reserve posture.' },
          { label: 'West Godavari Trauma Center', value: 'Degraded capacity', detail: 'This unit needs supporting ambulances and medicine dispatch.' },
        ],
        [
          { time: 'ICU', text: 'Konaseema: 15 ICU beds available' },
          { time: 'Beds', text: 'Kakinada: 170 available out of 360' },
          { time: 'Stock', text: 'East Godavari: 7,100 medical units' },
          { time: 'Status', text: 'West Godavari trauma center is degraded' },
        ]
      )
    }

    if (selectedNav === 'Food') {
      return renderDetailSection(
        'Warehouse Inventory',
        [
          { label: 'W003', value: '360,000 kg rice', detail: 'Konaseema reserve remains the priority replenishment zone.' },
          { label: 'W001', value: '420,000 kg rice', detail: 'Kakinada strong reserve with good ready-meal coverage.' },
          { label: 'W002', value: '390,000 kg rice', detail: 'Service is stable but demand is trending upward.' },
          { label: 'W005', value: '450,000 kg rice', detail: 'Regional buffer stock remains viable for surge support.' },
        ],
        [
          { time: 'W003', text: 'Konaseema: 5 days of stock, urgent replenishment recommended' },
          { time: 'W001', text: 'Kakinada: 6 days and highest ready-meal reserve' },
          { time: 'W002', text: 'East Godavari: 5 days with 87,000 meals' },
          { time: 'W005', text: 'Visakhapatnam: 7 days, regional buffer stock' },
        ]
      )
    }

    if (selectedNav === 'Transport') {
      return renderDetailSection(
        'Vehicle Fleet',
        [
          { label: 'V003', value: 'Ambulance • 91% fuel', detail: 'Medical evacuation support is ready for Konaseema dispatch.' },
          { label: 'V005', value: 'Bus • 68% fuel', detail: 'Shelter transfer capacity is present but constrained.' },
          { label: 'V004', value: 'Ambulance • 74% fuel', detail: 'Ready for regional medical repositioning.' },
          { label: 'V006', value: 'Water tanker • 63% fuel', detail: 'Support remains active for coastal water demand.' },
        ],
        [
          { time: 'R001', text: 'Primary corridor to Konaseema is blocked' },
          { time: 'R008', text: 'Alternate route to Konaseema estimated at 145 min' },
          { time: 'Fleet', text: '10 vehicles are active with 64% transport availability' },
          { time: 'Driver', text: 'All listed vehicles have drivers available' },
        ]
      )
    }

    if (selectedNav === 'Relief Teams') {
      return renderDetailSection(
        'Relief Teams',
        [
          { label: 'Task units', value: '08 active teams', detail: 'Field teams are concentrated around the Konaseema and Kakinada flood belts.' },
          { label: 'Coverage', value: '88% of target zones', detail: 'Tactical coverage is high but the coastal corridor remains under-served.' },
          { label: 'Escalation', value: '2 urgent requests', detail: 'Support is being routed to shelter reinforcement and evacuation staging.' },
        ],
        [
          { time: 'Field', text: 'Teams are deployed in the highest-risk corridors' },
          { time: 'Support', text: 'Aerial and ground support are balancing shelter access' },
          { time: 'Priority', text: 'Emergency medicine teams are being repositioned' },
          { time: 'Status', text: 'Field coverage remains effective despite road disruption' },
        ]
      )
    }

    if (selectedNav === 'Network Status') {
      return renderDetailSection(
        'Network Status',
        [
          { label: 'N001', value: 'Konaseema offline', detail: 'Primary coastal macrocell remains down and is isolating the region.' },
          { label: 'N002', value: 'Kakinada degraded', detail: 'Coverage has dropped to 54%, with heavy access pressure on the emergency network.' },
          { label: 'N003', value: 'East Godavari degraded', detail: 'This cell is still partially usable for field coordination.' },
          { label: 'N005', value: 'West Godavari degraded', detail: 'Signal fallback remains necessary for command continuity.' },
        ],
        [
          { time: 'N001', text: 'Konaseema macrocell offline; no connected users remain' },
          { time: 'N002', text: 'Kakinada degraded at 54% coverage with 15,500 users' },
          { time: 'N003', text: 'East Godavari degraded at 61% coverage' },
          { time: 'N005', text: 'West Godavari degraded and must be rebalanced' },
        ]
      )
    }

    if (selectedNav === 'Connectivity') {
      return renderDetailSection(
        'Connectivity',
        [
          { label: 'Connected zones', value: '27%', detail: 'Broadly connected services are limited to high-elevation and inland footholds.' },
          { label: 'Cell uptime', value: '61%', detail: 'The network is impaired but still permits critical coordination traffic.' },
          { label: 'Critical path', value: 'N001', detail: 'This site remains the key failure point in the current network topology.' },
        ],
        [
          { time: 'Signal', text: 'Coverage falls sharply toward the flood perimeter' },
          { time: 'Fallback', text: 'Emergency telecom support is rerouting around N001' },
          { time: 'Uptime', text: 'Cell performance remains unstable under storm conditions' },
          { time: 'Status', text: 'Backhaul quality must be monitored continuously' },
        ]
      )
    }

    if (selectedNav === 'Infrastructure') {
      return renderDetailSection(
        'Infrastructure',
        [
          { label: 'Bridge access', value: '2 flooded links', detail: 'Flooded bridges are limiting movement across the coastal corridor.' },
          { label: 'Power backup', value: '2 hours reserved', detail: 'Backup duration is short at critical tower nodes.' },
          { label: 'Maintenance', value: '4 priority tasks', detail: 'Field crews are clearing a route plan and repairing relay equipment.' },
        ],
        [
          { time: 'Bridge', text: 'Two access bridges are now effectively closed' },
          { time: 'Power', text: 'Battery support is being conserved to sustain emergency telecom' },
          { time: 'Repair', text: 'Maintenance crews are balancing damaged infrastructure and transport risk' },
          { time: 'Status', text: 'Multi-asset resilience remains the largest infrastructure constraint' },
        ]
      )
    }

    if (selectedNav === 'AI Copilot') {
      return (
        <>
          {renderInsightSummary('AI Copilot')}
          <section className="copilot-panel">
            <div className="panel-title-row">
              <div>
                <h3>Operations AI Copilot</h3>
                <p className="copilot-disclaimer">Answers are grounded in the active synthetic simulation. They are decision support, not live emergency intelligence.</p>
              </div>
              <span className="copilot-status">{copilotStatus}</span>
            </div>
            <form className="copilot-form" onSubmit={handleCopilotQuery}>
              <label htmlFor="copilot-question">Ask about priorities, allocations, routes, or response risks</label>
              <textarea
                id="copilot-question"
                value={copilotQuestion}
                onChange={(event) => setCopilotQuestion(event.target.value)}
                rows={3}
                placeholder="For example: What should we do if the Konaseema route remains blocked?"
              />
              <div className="copilot-actions">
                <button className="primary-button" type="submit" disabled={loading}>{loading ? 'ANALYZING...' : 'ASK COPILOT'}</button>
                <button className="secondary-button" type="button" onClick={() => setCopilotQuestion('What is the highest-priority action for the next two hours?')}>SUGGEST A QUESTION</button>
              </div>
            </form>
            <div className="copilot-answer" aria-live="polite">
              <span className="eyebrow">COPILOT RESPONSE</span>
              <p>{copilotAnswer}</p>
            </div>
            {copilotNotice ? <div className="copilot-notice">{copilotNotice}</div> : null}
          </section>
        </>
      )
    }

    if (selectedNav === 'Agent Network') {
      return renderDetailSection(
        'Agent Network',
        [
          { label: 'Command Agent', value: 'Completed', detail: 'Scenario orchestration has remained consistent across the full operational cycle.' },
          { label: 'Population Agent', value: 'Completed', detail: 'Affected and displaced count has been refreshed against current district data.' },
          { label: 'Shelter Agent', value: 'Completed', detail: 'Capacity gaps have been propagated to the allocation flow.' },
          { label: 'Medical Agent', value: 'Completed', detail: 'Hospital and ICU thresholds continue to drive priorities.' },
        ],
        [
          { time: 'Command', text: 'Scenario snapshot was synchronized with ground-state conditions' },
          { time: 'Population', text: 'Population data was updated with displacement staging' },
          { time: 'Medical', text: 'High-demand services were flagged for reallocation' },
          { time: 'Status', text: 'No deadlock detected in the orchestration chain' },
        ]
      )
    }

    if (selectedNav === 'Allocation Engine') {
      return renderDetailSection(
        'Allocation Engine',
        [
          { label: 'Assignments', value: '12 pending items', detail: 'The engine is distributing food, water, shelter, and medical loads by urgency.' },
          { label: 'Conflict rate', value: '8% low risk', detail: 'Resource competition remains controlled under the current scenario.' },
          { label: 'Need split', value: '04 rebalances', detail: 'Some districts are receiving contingency splits to reduce bottlenecks.' },
        ],
        [
          { time: 'Queue', text: 'Priority allocation sequence is updated every few minutes' },
          { time: 'Split', text: 'Shelter and medical loads are split to avoid local bottlenecks' },
          { time: 'Balance', text: 'The engine is prioritizing high-urgency districts' },
          { time: 'Status', text: 'Allocation flow remains operationally stable' },
        ]
      )
    }

    if (selectedNav === 'Route Optimizer') {
      return renderDetailSection(
        'Route Optimizer',
        [
          { label: 'Optimal routes', value: '07 updated paths', detail: 'The optimizer has recalculated viable detours to survive the road failure.' },
          { label: 'Blocked corridors', value: 'R001 and R006', detail: 'These blocks drive the current rerouting sequence.' },
          { label: 'ETA delta', value: '+35 min', detail: 'The detour produces a measurable delay but protects supply continuity.' },
        ],
        [
          { time: 'R001', text: 'Primary road block remains the dominant risk' },
          { time: 'R008', text: 'Alternate route is now the preferred delivery corridor' },
          { time: 'ETA', text: 'Estimated travel time increased by 35 minutes' },
          { time: 'Status', text: 'Route planner is actively recommending detours' },
        ]
      )
    }

    if (selectedNav === '3GPP Standards') {
      return renderDetailSection(
        '3GPP Standards',
        [
          { label: 'Profiles', value: '05 active standards', detail: 'Mission-critical emergency profiles are applied for disaster coordination.' },
          { label: 'Coverage model', value: '5G fallback mode', detail: 'The current comms profile is optimized for degraded signal capacity.' },
          { label: 'Priority rule', value: 'QoS mission-critical', detail: 'Emergency traffic remains prioritized over non-critical content.' },
        ],
        [
          { time: 'Profile', text: 'Emergency comms are using mission-critical QoS settings' },
          { time: 'Fallback', text: 'The network remains tuned for degraded coverage and latency pressure' },
          { time: 'Rule', text: 'High-priority emergency traffic is still assured' },
          { time: 'Status', text: 'Standards compliance remains aligned with the active state' },
        ]
      )
    }

    if (selectedNav === 'Evidence Explorer') {
      return renderDetailSection(
        'Evidence Explorer',
        [
          { label: 'Evidence sets', value: '18 active sources', detail: 'The dataset combines district, weather, telecom, and shelter observations.' },
          { label: 'Confidence', value: '0.93 high', detail: 'Confidence remains strong because the synthetic model is deterministic and consistent.' },
          { label: 'Case links', value: '22 related items', detail: 'Evidence is linking route failure, flood risk, and demand spike into one timeline.' },
        ],
        [
          { time: 'Evidence', text: 'Current case bundle is consistent with coastal flood escalation' },
          { time: 'Links', text: 'Related incidents show strong causal overlap' },
          { time: 'Review', text: 'Evidence quality remains high and actionable' },
          { time: 'Status', text: 'The case set is ready for operational decision support' },
        ]
      )
    }

    if (selectedNav === 'Scenario Knowledge') {
      return renderDetailSection(
        'Scenario Knowledge',
        [
          { label: 'Scenarios', value: '14 templates', detail: 'The current event maps to a coastal flood surge with severe service disruption.' },
          { label: 'Flood path', value: 'Coastal corridor', detail: 'Flood progression is consistent with evacuation demand and blocked routes.' },
          { label: 'Learned rule', value: 'Evacuate and re-route', detail: 'The knowledge layer suggests early staging and transport diversion.' },
        ],
        [
          { time: 'Pattern', text: 'Historical flood patterns match the current coastal surge path' },
          { time: 'Rule', text: 'The model recommends rapid evacuation and detour operations' },
          { time: 'Trigger', text: 'This scenario is now recognized as a high-risk flood event' },
          { time: 'Status', text: 'Knowledge recall is aligned with current field conditions' },
        ]
      )
    }

    if (selectedNav === 'Situation Analytics') {
      return renderDetailSection(
        'Situation Analytics',
        [
          { label: 'Risk index', value: '83 / 100', detail: 'Flood severity and service loss are compounding in the coastal belt.' },
          { label: 'Trend', value: '+14% in 3h', detail: 'The situation is intensifying, particularly in the critical urban corridor.' },
          { label: 'Signal', value: 'Flood surge confirmed', detail: 'The pattern is consistent with rising demand and declining infrastructure resilience.' },
        ],
        [
          { time: 'Trend', text: 'Risk index has increased sharply over the last three hours' },
          { time: 'Signal', text: 'Flood surge remains the dominant operational trigger' },
          { time: 'Analysis', text: 'The analytics layer is tracking elevated pressure across all response domains' },
          { time: 'Status', text: 'The system continues to escalate as conditions worsen' },
        ]
      )
    }

    if (selectedNav === 'Resource Analytics') {
      return renderDetailSection(
        'Resource Analytics',
        [
          { label: 'Inventory gap', value: '16% food deficit', detail: 'Food demand remains above the available reserve in the flood belt.' },
          { label: 'Stock cover', value: '5.2 days', detail: 'Average supply cover is stable but uneven across critical districts.' },
          { label: 'Risk clusters', value: '03 critical zones', detail: 'These clusters are driving the current prioritization strategy.' },
        ],
        [
          { time: 'Inventory', text: 'Food, shelter, and medical reserves are under uneven pressure' },
          { time: 'Trend', text: 'Cover is shrinking in critical districts' },
          { time: 'Action', text: 'Allocation logic is actively rebalancing scarce resources' },
          { time: 'Status', text: 'The current posture remains operationally credible but tight' },
        ]
      )
    }

    if (selectedNav === 'Response Performance') {
      return renderDetailSection(
        'Response Performance',
        [
          { label: 'Response time', value: '48 min average', detail: 'Delivery times are rising under degraded corridor conditions.' },
          { label: 'Replan cycle', value: '6 min', detail: 'The system is recalculating quickly after disruptions.' },
          { label: 'Teams engaged', value: '68% active', detail: 'Most units are engaged, but capacity remains constrained.' },
        ],
        [
          { time: 'Cycle', text: 'Replanning time remains short enough to keep response moving' },
          { time: 'Load', text: 'Operational load is elevated but handled within current planning windows' },
          { time: 'Performance', text: 'Response quality remains acceptable despite network and route strain' },
          { time: 'Status', text: 'The current system is still adaptive and effective' },
        ]
      )
    }

    if (selectedNav === 'Simulation Control') {
      return renderDetailSection(
        'Simulation Control',
        [
          { label: 'Clock', value: 'T+34', detail: 'The simulation remains active and progressing under pressure.' },
          { label: 'Scenario', value: 'Flood surge', detail: 'The emergency system is actively simulating the coastal flood surge.' },
          { label: 'Mode', value: 'Dynamic replanning', detail: 'The engine is adapting to the lane disruption and shifting priorities.' },
        ],
        [
          { time: 'Clock', text: 'The live simulation has progressed to T+34' },
          { time: 'Trigger', text: 'Primary route failure has been injected into the scenario' },
          { time: 'Engine', text: 'The system is recalculating under dynamic conditions' },
          { time: 'Status', text: 'Simulation flow remains coherent and responsive' },
        ]
      )
    }

    if (selectedNav === 'Scenario Builder') {
      return renderDetailSection(
        'Scenario Builder',
        [
          { label: 'Templates', value: '12 ready models', detail: 'The flood scenario is already shaped to match emergency response behavior.' },
          { label: 'Current config', value: 'Coastal flood', detail: 'The present setup is tuned to the current operational stress profile.' },
          { label: 'Load state', value: 'Stable', detail: 'Model conditions remain balanced and deterministic.' },
        ],
        [
          { time: 'Model', text: 'The current flood configuration matches the operational corridor' },
          { time: 'Config', text: 'The same event pattern is being reused in the allocation engine' },
          { time: 'Load', text: 'Scenario inputs are in a stable state' },
          { time: 'Status', text: 'The live model remains ready for another event trigger' },
        ]
      )
    }

    if (selectedNav === 'Event Timeline') {
      return renderDetailSection(
        'Event Timeline',
        [
          { label: 'Events', value: '09 logged', detail: 'The timeline shows staged escalation from initial rainfall to route blockage.' },
          { label: 'Most recent', value: 'Road block alert', detail: 'The system has just flagged the latest operational disruption.' },
          { label: 'Response', value: 'Replan executed', detail: 'The platform has initiated a dynamic response path update.' },
        ],
        [
          { time: 'T+00', text: 'Simulation started' },
          { time: 'T+02', text: 'Population agent completed' },
          { time: 'T+30', text: 'Road block reported' },
          { time: 'T+31', text: 'Route recalculation and replanning started' },
        ]
      )
    }

    if (selectedNav === 'Audit Logs') {
      return renderDetailSection(
        'Audit Logs',
        [
          { label: 'Audit records', value: '142 indexed', detail: 'The event stream is complete and traceable across simulated response steps.' },
          { label: 'Critical checks', value: '07 pass', detail: 'The system has validated successful orchestration and planning sequences.' },
          { label: 'Last event', value: 'Allocation validated', detail: 'Recent allocation decisions have been stored and checked for consistency.' },
        ],
        [
          { time: 'Log', text: 'Scenario actions have been recorded continuously' },
          { time: 'Check', text: 'Critical field checks have passed validation' },
          { time: 'Record', text: 'The latest planning cycle has been committed successfully' },
          { time: 'Status', text: 'System audit state remains consistent and complete' },
        ]
      )
    }

    if (selectedNav === 'Data Sources') {
      return renderDetailSection(
        'Data Sources',
        [
          { label: 'Files', value: '09 synthetic feeds', detail: 'District, weather, shelter, hospital, route, and network feeds are all active.' },
          { label: 'Integrity', value: '99.8% validated', detail: 'The data layer remains consistent with the current simulation state.' },
          { label: 'Refresh', value: 'T+34 live sync', detail: 'The model is actively refreshing the synthetic data feed.' },
        ],
        [
          { time: 'Feed', text: 'Synthetic district and weather sources are active' },
          { time: 'Quality', text: 'Validation remains high and complete across the data stack' },
          { time: 'Sync', text: 'Live refresh is aligned with the active scenario clock' },
          { time: 'Status', text: 'All data streams remain coherent for operations' },
        ]
      )
    }

    if (selectedNav === 'Settings') {
      return renderDetailSection(
        'Settings',
        [
          { label: 'Mode', value: 'Synthetic', detail: 'The platform is intentionally running in deterministic local simulation mode.' },
          { label: 'Alerts', value: 'Enabled', detail: 'Ops alerts remain active for high-priority field events.' },
          { label: 'Policy', value: 'A2 / ESRI', detail: 'This configuration is aligned with emergency operations style governance.' },
        ],
        [
          { time: 'Mode', text: 'Synthetic mode is enabled for safe local demonstration' },
          { time: 'Alerts', text: 'Operational alerts remain active and monitored' },
          { time: 'Policy', text: 'The current profile matches the command-center security posture' },
          { time: 'Status', text: 'System settings remain configured for operations' },
        ]
      )
    }

    if (selectedNav === 'Command Center') {
      return (
        <>
          {renderInsightSummary('Command Center')}
          <section className="metrics-grid">
            {metricCards.map((card) => (
              <div key={card.label} className="metric-card">
                <div className="metric-label">{card.label}</div>
                <div className="metric-value">{card.value}</div>
                <div className={`metric-change tone-${card.tone}`}>{card.change}</div>
              </div>
            ))}
          </section>

          <section className="map-panel">
            <div className="section-header">
              <h3>Situation Map</h3>
              <div className="map-legend">
                <span><i className="legend-swatch green" /> Operational</span>
                <span><i className="legend-swatch orange" /> Warning</span>
                <span><i className="legend-swatch red" /> Critical</span>
                <span><i className="legend-swatch purple" /> AI priority</span>
              </div>
            </div>
            <SituationMapVisual districts={districts} allocations={allocations} status={status} />
          </section>

          <ResponseTrendChart />

          <div className="lower-grid">
            <section className="panel">
              <div className="panel-title-row">
                <h3>District Priority</h3>
                <button className="mini-button" onClick={handleRunAllocation}>RUN ALLOCATION</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Priority</th>
                    <th>Flood</th>
                    <th>Network</th>
                  </tr>
                </thead>
                <tbody>
                  {districtRows.map((row) => (
                    <tr key={row.district}>
                      <td className="district-name">{row.district}</td>
                      <td>
                        <span className={`priority-pill ${row.icon}`}>{row.priority}</span>
                      </td>
                      <td>{row.flood}</td>
                      <td>{row.network}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="panel">
              <div className="panel-title-row">
                <h3>Allocation Plan</h3>
                <button className="mini-button alt" onClick={handleRunReplanning}>PLAN UPDATED</button>
              </div>
              <div className="allocation-list">
                {allocations.map((row) => (
                  <div className="allocation-card" key={row.id}>
                    <div className="allocation-topline">
                      <strong>{row.id}</strong>
                      <span className="allocation-level">{row.priority}</span>
                    </div>
                    <div className="allocation-meta">{row.source} → {row.destination}</div>
                    <div className="allocation-meta">{row.resource}: {row.quantity}</div>
                    <div className="allocation-meta">Route: {row.route} • ETA {row.eta}</div>
                    <div className="allocation-reason">{row.reason}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lower-grid">
            <section className="panel">
              <div className="panel-title-row">
                <h3>Agent Network</h3>
              </div>
              <div className="agent-list">
                {agents.map((agent) => (
                  <div key={agent.name} className="agent-card">
                    <div className="agent-name-row">
                      <span>{agent.name}</span>
                      <span className={`status-badge ${String(agent.status).toLowerCase()}`}>{agent.status}</span>
                    </div>
                    <div className="agent-meta">Last run: {agent.time}</div>
                    <div className="agent-meta">Input: {agent.input}</div>
                    <div className="agent-meta">Output: {agent.output}</div>
                    <div className="agent-meta">Tools: {agent.tools}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-title-row">
                <h3>Event Timeline</h3>
              </div>
              <div className="timeline-list">
                {timeline.map((item) => (
                  <div className="timeline-item" key={`${item.time}-${item.text}`}>
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-text">{item.text}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )
    }

    return (
      <>
        {renderInsightSummary(selectedNav)}
        <div className="lower-grid">
          <section className="panel">
            <div className="panel-title-row">
              <h3>{selectedNav}</h3>
            </div>
            <div className="allocation-list">
              <div className="allocation-card">
                <div className="allocation-topline">
                  <strong>{selectedNav}</strong>
                  <span className="allocation-level">VIEW</span>
                </div>
                <div className="allocation-meta">This view is mapped to a specific operational domain.</div>
                <div className="allocation-reason">The selected section is now using unique synthetic content instead of a shared generic panel.</div>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }

  // Show landing page if not yet entered dashboard
  if (showLanding) {
    return <LandingPage onEnterDashboard={() => setShowLanding(false)} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">R</div>
          <div>
            <div className="brand-title">RELIEFNET</div>
            <div className="brand-subtitle">AI Disaster Logistics & Relief Allocation Network</div>
          </div>
        </div>

        <div className="badge-row">
          <span className="badge synthetic">SYNTHETIC</span>
          <span className="badge simulation">SIMULATION</span>
        </div>

        <nav className="primary-nav" aria-label="Main areas">
          {sidebarGroups.map((group) => {
            const isOpen = activeArea === group.title
            return (
              <div key={group.title} className={`nav-group ${isOpen ? 'open' : ''}`}>
                <button
                  className="area-button"
                  onClick={() => {
                    if (isOpen) {
                      setActiveArea('')
                    } else {
                      setActiveArea(group.title)
                      setSelectedNav(group.items[0])
                    }
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{group.title}</span>
                  <span className="area-chevron">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <ul className="nav-list">
                    {group.items.map((item) => (
                      <li key={item}>
                        <button
                          className={`nav-item ${selectedNav === item ? 'active' : ''}`}
                          onClick={() => setSelectedNav(item)}
                          aria-current={selectedNav === item ? 'page' : undefined}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </nav>
        <button
          className={`copilot-nav ${selectedNav === 'AI Copilot' ? 'active' : ''}`}
          onClick={() => setSelectedNav('AI Copilot')}
        >
          <span>✦</span> AI Copilot
        </button>
      </aside>

      <main className="main-panel">
        <div className="topbar">
          <div>
            <div className="eyebrow">SYNTHETIC DATA</div>
            <div className="headline">RELIEFNET</div>
            <div className="subhead">AI Disaster Logistics & Relief Allocation Network</div>
          </div>
          <div className="header-actions">
            <button className="primary-button" onClick={handleStartSimulation} disabled={loading}>
              {loading ? 'LOADING...' : 'START SIMULATION'}
            </button>
            <button className="secondary-button" onClick={handleTriggerEvent} disabled={loading}>
              TRIGGER EVENT
            </button>
          </div>
        </div>

        <div className="status-banner">
          <div><span className="status-label">Scenario:</span> {scenario}</div>
          <div><span className="status-label">Status:</span> {status}</div>
          <div><span className="status-label">Mode:</span> {selectedNav}</div>
        </div>

        {error ? <div className="status-banner error-banner">{error}</div> : null}

        <CycloneTracker />

        {renderMainContent()}
      </main>
    </div>
  )
}

export default App
