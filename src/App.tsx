import { useEffect, useMemo, useState } from 'react'
import './App.css'

type SectionKey =
  | 'overview'
  | 'training'
  | 'mission-control'
  | 'digital-twin'
  | 'moon'
  | 'mars'
  | 'ai'
  | 'reports'
  | 'library'
  | 'settings'

type AlertLevel = 'info' | 'warning' | 'critical'

type Scenario = {
  id: string
  title: string
  objective: string
  systems: string[]
  decisionOptions: string[]
  correctDecision: string
  feedback: string
}

type Mission = {
  id: string
  title: string
  destination: string
  status: string
  objectives: string[]
  resources: string[]
  stages: string[]
  report: string
}

type SystemCard = {
  name: string
  status: string
  value: string
  type: string
}

type Article = {
  id: string
  title: string
  category: string
  summary: string
  details: string
}

type EventItem = {
  id: string
  time: string
  category: string
  label: string
  detail: string
}

type AlertItem = {
  id: string
  level: AlertLevel
  time: string
  title: string
  description: string
  response: string
  acknowledged: boolean
}

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
  source: 'local' | 'external'
}

const navItems: { key: SectionKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'training', label: 'Astronaut Training' },
  { key: 'mission-control', label: 'Mission Control' },
  { key: 'digital-twin', label: 'Planetary Digital Twin' },
  { key: 'moon', label: 'Moon Operations' },
  { key: 'mars', label: 'Mars Operations' },
  { key: 'ai', label: 'ASTRA AI' },
  { key: 'reports', label: 'Mission Reports' },
  { key: 'library', label: 'Science Library' },
  { key: 'settings', label: 'Settings' },
]

const scenarios: Scenario[] = [
  {
    id: 'spacecraft',
    title: 'Spacecraft familiarisation',
    objective: 'Verify command sequencing and power flow before ascent simulation.',
    systems: ['Power bus', 'Thermal control', 'Guidance computer'],
    decisionOptions: [
      'Power up the bus in the recommended sequence and confirm all subsystem flags are green.',
      'Immediately start live operations without checking guidance readiness.',
    ],
    correctDecision:
      'Power up the bus in the recommended sequence and confirm all subsystem flags are green.',
    feedback:
      'Correct. A staged power-up reduces transients and verifies safe command flow before active flight operations.',
  },
  {
    id: 'spacesuit',
    title: 'Spacesuit systems familiarisation',
    objective: 'Review suit telemetry and emergency procedure thresholds.',
    systems: ['Oxygen loop', 'Thermal regulation', 'CO₂ scrubber'],
    decisionOptions: [
      'Monitor core suit pressures and abort if CO₂ resistance or O₂ pressure drifts out of nominal band.',
      'Ignore thermal drift until a visible warning appears on the visor HUD.',
    ],
    correctDecision:
      'Monitor core suit pressures and abort if CO₂ resistance or O₂ pressure drifts out of nominal band.',
    feedback:
      'Correct. Early trend monitoring catches life-support anomalies before they become irreversible pressure emergencies.',
  },
  {
    id: 'spacewalk',
    title: 'Spacewalk preparation',
    objective: 'Assess EVA readiness and risk mitigation actions.',
    systems: ['Suit integrity', 'Airlock pressure', 'Communication relay'],
    decisionOptions: [
      'Run a full EVA checklist, verify tethering, and confirm suit integrity before opening the airlock.',
      'Open the hatch early to save time when the thermal loop reads just above nominal.',
    ],
    correctDecision:
      'Run a full EVA checklist, verify tethering, and confirm suit integrity before opening the airlock.',
    feedback:
      'Correct. EVA readiness depends on redundancy checks, tether discipline, and cross-system confirmation rather than speed alone.',
  },
  {
    id: 'lunar',
    title: 'Lunar surface exploration',
    objective: 'Coordinate rover travel and hazard avoidance during low-light terrain traverse.',
    systems: ['Rover terrain sensors', 'Navigation map', 'Solar charging'],
    decisionOptions: [
      'Select a waypoint avoiding crater shadows and schedule a recharge window before dusk.',
      'Travel directly across a dark crater edge to maximise route distance before sunset.',
    ],
    correctDecision:
      'Select a waypoint avoiding crater shadows and schedule a recharge window before dusk.',
    feedback:
      'Correct. Energy and terrain risk are tightly coupled on the lunar surface, especially when local illumination varies sharply.',
  },
  {
    id: 'mars',
    title: 'Mars surface exploration',
    objective: 'Balance mobility with dust risk, thermal load, and autonomy limits.',
    systems: ['Dust mitigation', 'Thermal control', 'Autonomy stack'],
    decisionOptions: [
      'Reduce rover speed in dusty zones and use a conservative thermal envelope while rechecking autonomy confidence.',
      'Accelerate through the dusty corridor to reach the science target before dust levels are expected to rise.',
    ],
    correctDecision:
      'Reduce rover speed in dusty zones and use a conservative thermal envelope while rechecking autonomy confidence.',
    feedback:
      'Correct. Dust and thermal variability can degrade navigation and power margins faster than nominal mission assumptions suggest.',
  },
  {
    id: 'rover',
    title: 'Rover operation',
    objective: 'Manage waypoint execution and fault tolerance during long surface traversal.',
    systems: ['Wheel torque', 'Telecom link', 'Battery reserve'],
    decisionOptions: [
      'Pause before a steep slope, confirm traction margin, and re-establish communications health before continuing.',
      'Proceed with the route because the telemetry trend is stable enough for a short segment.',
    ],
    correctDecision:
      'Pause before a steep slope, confirm traction margin, and re-establish communications health before continuing.',
    feedback:
      'Correct. Terrain safety checks protect the vehicle from energy-intensive wheel slip and prevent radio blind spots during key maneuvers.',
  },
  {
    id: 'oxygen',
    title: 'Oxygen-system emergency simulation',
    objective: 'Prioritize life-support stability under low-oxygen stressor conditions.',
    systems: ['Oxygen reserves', 'CO₂ scrubber', 'Crew cabin pressure'],
    decisionOptions: [
      'Isolate the affected tank, reduce non-essential load, and preserve reserve margin while the crew adapts to safe activity limits.',
      'Keep all loads active and rely on the reserve tank to recover without a procedural isolation step.',
    ],
    correctDecision:
      'Isolate the affected tank, reduce non-essential load, and preserve reserve margin while the crew adapts to safe activity limits.',
    feedback:
      'Correct. In a life-support anomaly, controlled isolation and load shedding preserve crew survivability and keep the mission in a recoverable state.',
  },
  {
    id: 'power',
    title: 'Power-system failure simulation',
    objective: 'Prevent cascading electrical faults during a power bus disturbance.',
    systems: ['Battery bus', 'Solar array', 'Load prioritisation'],
    decisionOptions: [
      'Prioritise critical systems, shed non-essential loads, and confirm battery balancing before re-energising secondary systems.',
      'Restore all loads immediately so the crew remains comfortable and operations continue at full pace.',
    ],
    correctDecision:
      'Prioritise critical systems, shed non-essential loads, and confirm battery balancing before re-energising secondary systems.',
    feedback:
      'Correct. Re-energising noncritical loads too early can deepen the bus disturbance and reduce reserves needed for recovery.',
  },
  {
    id: 'communications',
    title: 'Communication-loss simulation',
    objective: 'Keep the mission coherent when relay coverage drops.',
    systems: ['Deep-space relay', 'Local radios', 'Navigation lock'],
    decisionOptions: [
      'Shift to local autonomy, maintain safe operations, and re-establish the relay path with a staged recovery plan.',
      'Continue at standard mission tempo until direct contact returns, under the assumption the relay will reconnect automatically.',
    ],
    correctDecision:
      'Shift to local autonomy, maintain safe operations, and re-establish the relay path with a staged recovery plan.',
    feedback:
      'Correct. Communication loss is operationally significant even when the spacecraft remains stable, because planning and diagnostics must be local until relay recovery is confirmed.',
  },
  {
    id: 'habitat',
    title: 'Habitat emergency-response simulation',
    objective: 'Contain a habitat anomaly while preserving life-support and crew safety.',
    systems: ['Thermal loop', 'Air handling', 'Crew limiters'],
    decisionOptions: [
      'Contain the affected module, isolate the thermal loop, and direct crew to safe areas while stabilising shelter conditions.',
      'Keep all habitat sections online to minimise disruption even if the thermal loop shows signs of contamination.',
    ],
    correctDecision:
      'Contain the affected module, isolate the thermal loop, and direct crew to safe areas while stabilising shelter conditions.',
    feedback:
      'Correct. Emergency containment works by restricting the hazard and stabilising essential systems, not by forcing continuous operation across a compromised module.',
  },
]

const missions: Mission[] = [
  {
    id: 'lunar-habitat',
    title: 'Lunar habitat inspection',
    destination: 'Moon',
    status: 'Active',
    objectives: ['Inspect habitat thermal envelope', 'Verify life-support redundancy', 'Assess dust mitigation performance'],
    resources: ['Habitat crew', 'Surface drone', 'Power reserve'],
    stages: ['Initial scan', 'Systems diagnosis', 'Crew briefing', 'Closure review'],
    report: 'The habitat inspection confirmed thermal envelope stability with minor dust accumulation around the panel array. Follow-up maintenance remains scheduled for the next cycle.',
  },
  {
    id: 'lunar-rover',
    title: 'Lunar rover exploration',
    destination: 'Moon',
    status: 'Ready',
    objectives: ['Map crater rims', 'Assess regolith depth', 'Test route autonomy'],
    resources: ['Rover', 'Navigation map', 'Telemetry relay'],
    stages: ['Route setup', 'Autonomy check', 'Field traverse', 'Data review'],
    report: 'Rover autonomy completed a safe traverse with minimal wheel slip and strong signal continuity. Recommended next stage upgrades include dust-robust path planning.',
  },
  {
    id: 'mars-habitat',
    title: 'Mars habitat monitoring',
    destination: 'Mars',
    status: 'Scanning',
    objectives: ['Measure habitat environmental drift', 'Review power allocation', 'Check water loop stability'],
    resources: ['Habitat sensors', 'Crew module', 'Local AI telemetry'],
    stages: ['Baseline capture', 'Trend analysis', 'Crew update', 'Scenario review'],
    report: 'The habitat environment remains within nominal ranges. Water loop efficiency is slightly reduced during high-dust periods and should be rebalanced during the next maintenance cycle.',
  },
  {
    id: 'mars-geology',
    title: 'Mars geological exploration',
    destination: 'Mars',
    status: 'Queued',
    objectives: ['Survey layered terrain', 'Inspect mineral composition', 'Map evidence of paleo-water'],
    resources: ['Rover', 'Sample drill', 'Spectral analysis'],
    stages: ['Recon route', 'Sampling', 'Analysis', 'Mission summary'],
    report: 'The layered terrain survey produced strong mineral indicators and improved the proposed route for a follow-on basin traverse.',
  },
  {
    id: 'life-support',
    title: 'Life-support system testing',
    destination: 'Deep space',
    status: 'Monitoring',
    objectives: ['Validate O₂ reserve performance', 'Check CO₂ filter cycles', 'Confirm thermal redundancy'],
    resources: ['Closed-loop life support', 'Monitoring sensor network', 'Crew consoles'],
    stages: ['System diagnosis', 'Cycle validation', 'Reservoir review', 'Certification'],
    report: 'Life-support resilience remained above threshold during the test cycle and all critical redundancies were validated without major excursion events.',
  },
  {
    id: 'communications',
    title: 'Planetary communication testing',
    destination: 'Moon / Mars',
    status: 'In review',
    objectives: ['Measure signal integrity', 'Test relay continuity', 'Assess low-bandwidth resilience'],
    resources: ['Relay array', 'Ground station', 'Signal simulation'],
    stages: ['Baseline transmission', 'Relay handoff', 'Noise analysis', 'Readiness report'],
    report: 'The relay infrastructure remained stable across the simulated communications window. Low-bandwidth fallback modes were consistent with acceptable mission safety thresholds.',
  },
]

const initialTelemetryHistory = [
  { ts: '08:00', oxygen: 96, pressure: 101.6, temperature: 21.4, battery: 92, solar: 68, water: 88, signal: 91, roverBattery: 88, habitat: 81 },
  { ts: '08:05', oxygen: 95, pressure: 101.5, temperature: 21.8, battery: 91, solar: 70, water: 87, signal: 92, roverBattery: 87, habitat: 82 },
  { ts: '08:10', oxygen: 94, pressure: 101.4, temperature: 22.1, battery: 89, solar: 72, water: 86, signal: 90, roverBattery: 85, habitat: 83 },
  { ts: '08:15', oxygen: 93, pressure: 101.3, temperature: 22.3, battery: 88, solar: 74, water: 85, signal: 89, roverBattery: 84, habitat: 83 },
  { ts: '08:20', oxygen: 92, pressure: 101.2, temperature: 22.6, battery: 87, solar: 75, water: 84, signal: 88, roverBattery: 83, habitat: 82 },
  { ts: '08:25', oxygen: 91, pressure: 101.1, temperature: 22.9, battery: 86, solar: 76, water: 82, signal: 87, roverBattery: 82, habitat: 81 },
  { ts: '08:30', oxygen: 90, pressure: 101.0, temperature: 23.1, battery: 85, solar: 77, water: 81, signal: 86, roverBattery: 80, habitat: 80 },
]

const initialAlerts: AlertItem[] = [
  {
    id: 'a1',
    level: 'info',
    time: '08:14',
    title: 'Thermal loop nominal',
    description: 'The habitat thermal envelope is within expected ranges for the current phase.',
    response: 'Maintain current operating setpoint and continue routine observation.',
    acknowledged: false,
  },
  {
    id: 'a2',
    level: 'warning',
    time: '08:19',
    title: 'Dust accumulation on solar array',
    description: 'Solar generation efficiency has declined by 4% during the current dust cycle.',
    response: 'Deploy dust-mitigation routine and rebalance charging state between arrays.',
    acknowledged: false,
  },
  {
    id: 'a3',
    level: 'critical',
    time: '08:27',
    title: 'Simulated oxygen reserve drift',
    description: 'This is a clearly labelled simulation, not live habitat telemetry. Reserve trend is approaching caution threshold.',
    response: 'Reduce non-essential load, verify reserve loop, and prepare contingency response checklist.',
    acknowledged: false,
  },
]

const initialEvents: EventItem[] = [
  { id: 'e1', time: '08:00', category: 'system', label: 'Power bus synchronised', detail: 'Power bus synchronised to the habitat array.' },
  { id: 'e2', time: '08:04', category: 'training', label: 'Simulation briefing', detail: 'Crew completed the EVA readiness briefing.' },
  { id: 'e3', time: '08:12', category: 'alert', label: 'Dust advisory', detail: 'Array efficiency dipped due to simulated dust accumulation.' },
  { id: 'e4', time: '08:18', category: 'mission', label: 'Mission phase update', detail: 'Mission moved to habitat inspection readiness.' },
  { id: 'e5', time: '08:25', category: 'training', label: 'O₂ response exercise', detail: 'Team completed oxygen-system emergency simulation review.' },
]

const scienceArticles: Article[] = [
  {
    id: 'moon-geology',
    title: 'Moon geology',
    category: 'Moon',
    summary: 'Formation history, mare plains, highland terrain, and crater processes.',
    details: 'The Moon preserves a long geologic record in its heavily cratered highlands and basaltic maria. Regolith depth, impact history, and thermal cycling shape surface operations and scientific interpretation.',
  },
  {
    id: 'mars-geology',
    title: 'Mars geology',
    category: 'Mars',
    summary: 'Ancient river valleys, polar deposits, and mineral evidence for past water.',
    details: 'Mars shows extensive evidence of fluvial, aeolian, and volcanic processes. Water-bearing minerals and sedimentary layers provide clues about the planet’s long-term climate evolution.',
  },
  {
    id: 'life-support',
    title: 'Life-support systems',
    category: 'Systems',
    summary: 'Closed-loop oxygen, water recovery, and environmental regulation.',
    details: 'Life-support architecture balances oxygen generation, carbon-dioxide scrubbing, thermal control, and water reclamation. A safe habitat must keep these loops independent and continuously monitored.',
  },
  {
    id: 'solar-power',
    title: 'Solar power',
    category: 'Power',
    summary: 'Arrays, batteries, and charge management for planetary operations.',
    details: 'Photovoltaic systems must be sized for seasonal variability and dust accumulation. Battery storage and power budgeting are central to autonomous mission reliability.',
  },
  {
    id: 'rovers',
    title: 'Planetary rovers',
    category: 'Mobility',
    summary: 'Mobility planning, terrain hazards, communications, and autonomous traverses.',
    details: 'Rovers combine localized autonomy with careful route planning to manage wheel slip, terrain uncertainty, and communication coverage constraints during exploration tasks.',
  },
  {
    id: 'communications',
    title: 'Space communications',
    category: 'Communications',
    summary: 'High-gain links, relay handoff, and low-bandwidth fallback modes.',
    details: 'Deep-space missions rely on direct-to-Earth links, relay assets, and robust signal-handling strategies to maintain mission continuity when latency or link quality varies.',
  },
]

const systemCards: SystemCard[] = [
  { name: 'Life-support system', status: 'Nominal', value: '98.4%', type: 'life' },
  { name: 'Oxygen storage', status: 'Stable', value: '91.2%', type: 'oxygen' },
  { name: 'Water storage', status: 'Nominal', value: '84.1%', type: 'water' },
  { name: 'Power generation', status: 'Lowered', value: '72.8%', type: 'power' },
  { name: 'Battery storage', status: 'Nominal', value: '88.6%', type: 'battery' },
  { name: 'Temperature regulation', status: 'Stable', value: '21.7°C', type: 'thermal' },
  { name: 'Communications equipment', status: 'Green', value: '92.3%', type: 'comms' },
  { name: 'Environmental monitoring', status: 'Tracking', value: '87.9%', type: 'monitor' },
]

const digitalTwinFaults: Record<string, boolean> = {
  'Life-support system': false,
  'Oxygen storage': false,
  'Water storage': false,
  'Power generation': false,
  'Battery storage': false,
  'Temperature regulation': false,
  'Communications equipment': false,
  'Environmental monitoring': false,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const formatPercent = (value: number) => `${Math.round(value)}%`

const buildLocalAssistant = (question: string) => {
  const lower = question.toLowerCase()

  if (lower.includes('oxygen') || lower.includes('life-support')) {
    return 'Life-support systems are designed to maintain oxygen, carbon-dioxide removal, and thermal balance. In this simulation, watch for reserve trends, scrubber efficiency and non-essential load shedding before a system approaches a critical threshold.'
  }

  if (lower.includes('telemetry') || lower.includes('reading')) {
    return 'Telemetry should be assessed as a trend, not a single instant. Oxygen, temperature and power are linked: a falling reserve or higher thermal load often signals a rising operational risk even when the system remains otherwise stable.'
  }

  if (lower.includes('mars') || lower.includes('moon')) {
    return 'The Moon and Mars present different operational envelopes. The Moon offers sharper thermal swings and slow communications, while Mars introduces dust, lower atmospheric pressure, and more complex seasonal energy management.'
  }

  if (lower.includes('rover')) {
    return 'Rover safety depends on terrain slope, traction margin, power reserve and route autonomy. A conservative speed profile and dust-aware planning are usually better than a full-speed route when conditions degrade.'
  }

  if (lower.includes('training')) {
    return 'The most effective astronaut training blends procedural correctness, system awareness and decision-making under stress. The simulations here are educational and intentionally simplified to show operational principles rather than emulate a live mission.'
  }

  if (lower.includes('alert') || lower.includes('warning')) {
    return 'Warnings should be treated as operational prompts, not panic events. Confirm the system state, identify the most likely root cause and decide whether the correct response is to monitor, isolate or shed non-essential load.'
  }

  return 'Project Astra combines simulated training, mission control and remote habitat monitoring into one educational environment. For a deeper answer, ask about telemetry trends, habitat systems, rover operations or mission readiness.'
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview')
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id)
  const [trainingResults, setTrainingResults] = useState<Record<string, string>>({})
  const [missionId, setMissionId] = useState(missions[0].id)
  const [selectedPlanet, setSelectedPlanet] = useState<'Moon' | 'Mars'>('Moon')
  const [selectedSystem, setSelectedSystem] = useState(systemCards[0].name)
  const [eventFilter, setEventFilter] = useState('all')
  const [libraryQuery, setLibraryQuery] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState(scienceArticles[0].id)
  const [alertState, setAlertState] = useState(initialAlerts)
  const [eventState, setEventState] = useState(initialEvents)
  const [telemetryHistory, setTelemetryHistory] = useState(initialTelemetryHistory)
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'ASTRA AI is currently operating in local fallback mode. Ask about training, telemetry, habitat systems, rover operations or mission readiness and I’ll give a grounded operational explanation.',
      source: 'local',
    },
  ])
  const [aiPrompt, setAiPrompt] = useState('')
  const [systemFaultState, setSystemFaultState] = useState(digitalTwinFaults)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTelemetryHistory((previous) => {
        const last = previous[previous.length - 1]
        const oxygen = clamp(last.oxygen + (Math.random() > 0.5 ? -0.6 : 0.3), 88, 98)
        const pressure = clamp(last.pressure + (Math.random() > 0.5 ? -0.08 : 0.05), 100.7, 101.9)
        const temperature = clamp(last.temperature + (Math.random() > 0.5 ? 0.2 : -0.15), 20.5, 24.5)
        const battery = clamp(last.battery + (Math.random() > 0.6 ? -0.8 : 0.4), 72, 96)
        const solar = clamp(last.solar + (Math.random() > 0.55 ? -0.9 : 0.7), 64, 90)
        const water = clamp(last.water + (Math.random() > 0.5 ? -0.5 : 0.4), 76, 94)
        const signal = clamp(last.signal + (Math.random() > 0.5 ? -1 : 0.8), 78, 98)
        const roverBattery = clamp(last.roverBattery + (Math.random() > 0.5 ? -0.7 : 0.5), 68, 94)
        const habitat = clamp(last.habitat + (Math.random() > 0.55 ? -0.8 : 0.5), 72, 94)

        const nextPoint = {
          ts: `08:${String(previous.length + 28).padStart(2, '0')}`,
          oxygen,
          pressure,
          temperature,
          battery,
          solar,
          water,
          signal,
          roverBattery,
          habitat,
        }

        return [...previous.slice(-11), nextPoint]
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === missionId) ?? missions[0],
    [missionId],
  )

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0],
    [selectedScenarioId],
  )

  const selectedArticle = useMemo(
    () => scienceArticles.find((article) => article.id === selectedArticleId) ?? scienceArticles[0],
    [selectedArticleId],
  )

  const latestTelemetry = telemetryHistory[telemetryHistory.length - 1]

  const filteredEvents = useMemo(
    () =>
      eventState.filter((event) => {
        if (eventFilter === 'all') {
          return true
        }

        return event.category === eventFilter
      }),
    [eventFilter, eventState],
  )

  const libraryArticles = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()

    if (!query) {
      return scienceArticles
    }

    return scienceArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query),
    )
  }, [libraryQuery])

  const trainingScore = useMemo(() => {
    const completed = Object.keys(trainingResults).length
    const score = completed === 0 ? 82 : Math.min(97, 82 + completed * 2)
    return Math.round(score)
  }, [trainingResults])

  const missionProgress = 68

  const acknowledgeAlert = (id: string) => {
    setAlertState((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert,
      ),
    )
  }

  const triggerScenarioDecision = (decision: string) => {
    const correct = decision === selectedScenario.correctDecision
    setTrainingResults((current) => ({
      ...current,
      [selectedScenario.id]: correct ? 'Pass' : 'Review',
    }))

    setEventState((current) => [
      {
        id: `event-${Date.now()}`,
        time: 'Now',
        category: 'training',
        label: `${selectedScenario.title} review`,
        detail: correct ? 'Decision aligned with recommended procedures.' : 'Decision requires operator review before repeating the drill.',
      },
      ...current,
    ])
  }

  const addAiMessage = () => {
    const trimmed = aiPrompt.trim()
    if (!trimmed) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      source: 'external',
    }

    const response = buildLocalAssistant(trimmed)
    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      source: 'local',
    }

    setAiMessages((current) => [...current, userMessage, assistantMessage])
    setAiPrompt('')
  }

  const triggerDigitalTwinFault = () => {
    const nextFault = !systemFaultState[selectedSystem]
    setSystemFaultState((current) => ({
      ...current,
      [selectedSystem]: nextFault,
    }))

    setEventState((current) => [
      {
        id: `fault-${Date.now()}`,
        time: 'Now',
        category: 'system',
        label: `${selectedSystem} status simulation`,
        detail: nextFault ? 'Simulated fault applied to the selected subsystem.' : 'Fault cleared and system reset to nominal state.',
      },
      ...current,
    ])
  }

  const resetDigitalTwin = () => {
    setSystemFaultState(digitalTwinFaults)
    setEventState((current) => [
      {
        id: `reset-${Date.now()}`,
        time: 'Now',
        category: 'mission',
        label: 'Digital twin reset',
        detail: 'Digital twin state reset to normal configuration for a fresh simulation cycle.',
      },
      ...current,
    ])
  }

  const renderSparkChart = (values: number[], color: string, fill = false) => {
    const width = 220
    const height = 80
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const points = values
      .map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * width
        const y = height - ((value - min) / range) * (height - 16) - 8
        return `${x},${y}`
      })
      .join(' ')

    const areaPoints = `${points} ${width},${height} 0,${height}`

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" aria-label="Telemetry chart">
        <defs>
          <linearGradient id={`fill-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill ? <polygon points={areaPoints} fill={`url(#fill-${color.replace('#','')})`} /> : null}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
    )
  }

  const renderOverview = () => (
    <div className="panel-stack">
      <section className="hero-panel panel">
        <div>
          <p className="eyebrow">Project ASTRA</p>
          <h1>AI-powered space mission training and mission operations platform</h1>
          <p className="hero-copy">
            A professional training, simulation and operations environment for mission readiness, habitat systems and planetary exploration planning.
          </p>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={() => setActiveSection('training')}>
              Open training
            </button>
            <button type="button" className="secondary-button" onClick={() => setActiveSection('mission-control')}>
              Mission control
            </button>
          </div>
        </div>
        <div className="mission-summary-card glass-card">
          <span className="status-pill live">Active mission</span>
          <h3>{activeMission.title}</h3>
          <ul>
            <li>
              <span>Destination</span>
              <strong>{activeMission.destination}</strong>
            </li>
            <li>
              <span>Mission phase</span>
              <strong>Habitat inspection</strong>
            </li>
            <li>
              <span>Progress</span>
              <strong>{missionProgress}%</strong>
            </li>
            <li>
              <span>Training score</span>
              <strong>{trainingScore}%</strong>
            </li>
          </ul>
        </div>
      </section>

      <section className="stats-grid">
        <div className="glass-card stat-card">
          <span className="label">Mission progress</span>
          <strong>{missionProgress}%</strong>
          <small>Simulation cycle underway</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Training progress</span>
          <strong>{Math.min(92, trainingScore)}%</strong>
          <small>Readiness rising</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Planetary system</span>
          <strong>{selectedPlanet}</strong>
          <small>Surface assessment</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Latest alerts</span>
          <strong>{alertState.length}</strong>
          <small>Tracked across the current run</small>
        </div>
      </section>

      <section className="content-grid two-col">
        <div className="panel">
          <div className="section-heading">
            <h2>Active mission</h2>
            <button type="button" className="text-link" onClick={() => setActiveSection('reports')}>
              Open reports
            </button>
          </div>
          <div className="list-block">
            {missions.slice(0, 3).map((mission) => (
              <button
                type="button"
                key={mission.id}
                className={`mission-list-item ${mission.id === activeMission.id ? 'selected' : ''}`}
                onClick={() => setMissionId(mission.id)}
              >
                <div>
                  <strong>{mission.title}</strong>
                  <span>{mission.destination}</span>
                </div>
                <span className="small-badge">{mission.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <h2>Recent activities</h2>
            <button type="button" className="text-link" onClick={() => setActiveSection('mission-control')}>
              Event log
            </button>
          </div>
          <ul className="activity-list">
            {eventState.slice(0, 5).map((event) => (
              <li key={event.id}>
                <span className="dot" />
                <div>
                  <strong>{event.label}</strong>
                  <small>{event.detail}</small>
                </div>
                <time>{event.time}</time>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )

  const renderTraining = () => (
    <div className="panel-stack">
      <section className="training-header panel">
        <div>
          <p className="eyebrow">Astronaut Training Centre</p>
          <h2>Mission readiness simulation</h2>
        </div>
        <div className="readiness-meter">
          <span>Mission readiness</span>
          <strong>{trainingScore}%</strong>
        </div>
      </section>

      <section className="content-grid training-grid">
        <div className="panel scenario-list-panel">
          <div className="section-heading">
            <h3>Training simulations</h3>
            <span>{scenarios.length} scenarios</span>
          </div>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button
                type="button"
                key={scenario.id}
                className={`scenario-item ${selectedScenario.id === scenario.id ? 'selected' : ''}`}
                onClick={() => setSelectedScenarioId(scenario.id)}
              >
                <strong>{scenario.title}</strong>
                <small>{scenario.objective}</small>
                <span className={`result-pill ${trainingResults[scenario.id] === 'Pass' ? 'pass' : trainingResults[scenario.id] ? 'review' : ''}`}>
                  {trainingResults[scenario.id] ?? 'Pending'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel scenario-panel">
          <p className="eyebrow">Current scenario</p>
          <h3>{selectedScenario.title}</h3>
          <p className="scenario-objective">{selectedScenario.objective}</p>

          <div className="system-tags">
            {selectedScenario.systems.map((system) => (
              <span key={system}>{system}</span>
            ))}
          </div>

          <div className="decision-box">
            <h4>Operational decision</h4>
            {selectedScenario.decisionOptions.map((option) => (
              <button
                type="button"
                key={option}
                className="decision-button"
                onClick={() => triggerScenarioDecision(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {trainingResults[selectedScenario.id] ? (
            <div className="feedback-panel">
              <strong>{trainingResults[selectedScenario.id] === 'Pass' ? 'Decision confirmed' : 'Review recommended'}</strong>
              <p>{selectedScenario.feedback}</p>
            </div>
          ) : (
            <div className="feedback-panel neutral">
              <strong>Awaiting evaluation</strong>
              <p>Select the best safety decision to evaluate this exercise.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )

  const renderMissionControl = () => (
    <div className="panel-stack">
      <section className="stats-grid mission-overview">
        <div className="glass-card stat-card">
          <span className="label">Mission</span>
          <strong>{activeMission.title}</strong>
          <small>{activeMission.destination}</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Mission phase</span>
          <strong>Surface assessment</strong>
          <small>Habitat check</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Elapsed time</span>
          <strong>08h 42m</strong>
          <small>Simulated operations</small>
        </div>
        <div className="glass-card stat-card">
          <span className="label">Astronaut status</span>
          <strong>Nominal</strong>
          <small>3 crew systems live</small>
        </div>
      </section>

      <section className="content-grid two-col">
        <div className="panel">
          <div className="section-heading">
            <h3>Telemetry</h3>
            <span>Simulated data</span>
          </div>

          <div className="telemetry-grid">
            {[
              { label: 'Oxygen', value: latestTelemetry.oxygen, unit: '%', color: '#7de2ff', values: telemetryHistory.map((point) => point.oxygen) },
              { label: 'Cabin pressure', value: latestTelemetry.pressure, unit: 'kPa', color: '#8be9b7', values: telemetryHistory.map((point) => point.pressure) },
              { label: 'Temperature', value: latestTelemetry.temperature, unit: '°C', color: '#ffd166', values: telemetryHistory.map((point) => point.temperature) },
              { label: 'Battery', value: latestTelemetry.battery, unit: '%', color: '#a78bfa', values: telemetryHistory.map((point) => point.battery) },
              { label: 'Solar power', value: latestTelemetry.solar, unit: 'kW', color: '#34d399', values: telemetryHistory.map((point) => point.solar) },
              { label: 'Water reserves', value: latestTelemetry.water, unit: '%', color: '#60a5fa', values: telemetryHistory.map((point) => point.water) },
              { label: 'Signal', value: latestTelemetry.signal, unit: '%', color: '#f9a8d4', values: telemetryHistory.map((point) => point.signal) },
              { label: 'Rover battery', value: latestTelemetry.roverBattery, unit: '%', color: '#fbbf24', values: telemetryHistory.map((point) => point.roverBattery) },
            ].map((segment) => (
              <div key={segment.label} className="telemetry-card">
                <div className="telemetry-info">
                  <span>{segment.label}</span>
                  <strong>{segment.value}{segment.unit}</strong>
                </div>
                {renderSparkChart(segment.values, segment.color, true)}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <h3>Alert management</h3>
            <span>{alertState.filter((alert) => !alert.acknowledged).length} active</span>
          </div>
          <div className="alert-list">
            {alertState.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.level}`}>
                <div className="alert-header">
                  <div>
                    <strong>{alert.title}</strong>
                    <span>{alert.time}</span>
                  </div>
                  <span className={`level-badge ${alert.level}`}>{alert.level}</span>
                </div>
                <p>{alert.description}</p>
                <small>{alert.response}</small>
                {!alert.acknowledged ? (
                  <button type="button" className="secondary-button small" onClick={() => acknowledgeAlert(alert.id)}>
                    Acknowledge
                  </button>
                ) : (
                  <span className="acknowledged-tag">Acknowledged</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel event-panel">
        <div className="section-heading">
          <h3>Mission event log</h3>
          <div className="filter-group">
            {['all', 'system', 'training', 'alert', 'mission'].map((filter) => (
              <button
                type="button"
                key={filter}
                className={eventFilter === filter ? 'chip active' : 'chip'}
                onClick={() => setEventFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="event-log">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-row">
              <span className="event-time">{event.time}</span>
              <span className="event-category">{event.category}</span>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderDigitalTwin = () => (
    <div className="panel-stack">
      <section className="panel twin-header">
        <div>
          <p className="eyebrow">Planetary Digital Twin</p>
          <h2>Interactive environment</h2>
        </div>
        <div className="planet-toggle">
          {(['Moon', 'Mars'] as const).map((planet) => (
            <button
              key={planet}
              type="button"
              className={selectedPlanet === planet ? 'chip active' : 'chip'}
              onClick={() => setSelectedPlanet(planet)}
            >
              {planet}
            </button>
          ))}
        </div>
      </section>

      <section className="content-grid twin-grid">
        <div className="panel twin-visual-panel">
          <div className={`planet-scene ${selectedPlanet.toLowerCase()}`}>
            <div className="planet-surface" />
            <div className="planet-habitat" />
            <div className="planet-panel" />
            <div className="planet-antenna" />
            <div className="planet-rover" />
            <div className="planet-astronaut" />
            <div className="landing-zone" />
          </div>
        </div>

        <div className="panel twin-controls-panel">
          <div className="section-heading">
            <h3>Habitat systems</h3>
            <span>{systemCards.length} components</span>
          </div>
          <div className="system-list">
            {systemCards.map((system) => (
              <button
                type="button"
                key={system.name}
                className={`system-item ${selectedSystem === system.name ? 'selected' : ''}`}
                onClick={() => setSelectedSystem(system.name)}
              >
                <div>
                  <strong>{system.name}</strong>
                  <span>{system.status}</span>
                </div>
                <em>{system.value}</em>
              </button>
            ))}
          </div>

          <div className="selected-system">
            <h4>{selectedSystem}</h4>
            <p>
              {systemFaultState[selectedSystem] ? 'Fault simulated: system behaviour diverges from nominal operating parameters.' : 'Nominal state: system remains within school-safe operational thresholds.'}
            </p>
            <div className="button-row narrow">
              <button type="button" className="primary-button small" onClick={triggerDigitalTwinFault}>
                {systemFaultState[selectedSystem] ? 'Clear simulated fault' : 'Trigger simulated fault'}
              </button>
              <button type="button" className="secondary-button small" onClick={resetDigitalTwin}>
                Reset simulation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const renderOperations = (planet: 'Moon' | 'Mars') => (
    <div className="panel-stack">
      <section className="panel operations-panel">
        <div className="section-heading">
          <h2>{planet} operations</h2>
          <span>Exploration planning</span>
        </div>

        <div className="operations-grid">
          <div className="glass-card operation-card">
            <strong>Terrain profile</strong>
            <p>{planet === 'Moon' ? 'Basaltic plains with crater ridges and low-angle slope variation.' : 'Layered volcanic terrain with dust corridors and mineral-rich ridgelines.'}</p>
          </div>
          <div className="glass-card operation-card">
            <strong>Research habitat</strong>
            <p>{planet === 'Moon' ? 'Surface habitat supports power and dust mitigation with compact logistics modules.' : 'Habitat cycle monitors environmental drift and long-range energy resilience.'}</p>
          </div>
          <div className="glass-card operation-card">
            <strong>Equipment</strong>
            <p>{planet === 'Moon' ? 'Lunar rover, thermal protectors and low-light navigation aids.' : 'Mars rover, dust shields and high-gain relay coverage.'}</p>
          </div>
        </div>
      </section>
    </div>
  )

  const renderAi = () => (
    <div className="panel-stack">
      <section className="panel ai-panel">
        <div className="section-heading">
          <h2>ASTRA AI</h2>
          <span className="status-pill local">Local fallback model</span>
        </div>

        <div className="example-questions">
          {['Explain oxygen system drift', 'Summarise mission status', 'What should I check during a power fault?', 'How do I assess rover terrain risk?'].map((question) => (
            <button key={question} type="button" className="chip" onClick={() => setAiPrompt(question)}>
              {question}
            </button>
          ))}
        </div>

        <div className="chat-panel">
          {aiMessages.map((message) => (
            <div key={message.id} className={`chat-bubble ${message.role}`}>
              <strong>{message.role === 'assistant' ? 'ASTRA AI' : 'You'}</strong>
              <p>{message.content}</p>
            </div>
          ))}
        </div>

        <div className="ai-input-row">
          <input
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            placeholder="Ask about training, telemetry, habitat systems or mission procedures..."
            aria-label="AI prompt input"
          />
          <button type="button" className="primary-button" onClick={addAiMessage}>
            Send
          </button>
        </div>
      </section>
    </div>
  )

  const renderReports = () => (
    <div className="panel-stack">
      <section className="content-grid report-grid">
        <div className="panel">
          <div className="section-heading">
            <h2>Mission reports</h2>
            <span>{missions.length} records</span>
          </div>
          <div className="list-block">
            {missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                className={`mission-list-item ${mission.id === activeMission.id ? 'selected' : ''}`}
                onClick={() => setMissionId(mission.id)}
              >
                <div>
                  <strong>{mission.title}</strong>
                  <span>{mission.destination}</span>
                </div>
                <span className="small-badge">{mission.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel report-detail-panel">
          <p className="eyebrow">Mission summary</p>
          <h3>{activeMission.title}</h3>
          <ul className="report-objectives">
            {activeMission.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>

          <div className="report-callout">
            <strong>Completion report</strong>
            <p>{activeMission.report}</p>
          </div>
        </div>
      </section>
    </div>
  )

  const renderLibrary = () => (
    <div className="panel-stack">
      <section className="panel library-panel">
        <div className="section-heading">
          <h2>Science library</h2>
          <span>Evidence-based knowledge</span>
        </div>

        <input
          value={libraryQuery}
          onChange={(event) => setLibraryQuery(event.target.value)}
          className="library-search"
          placeholder="Search Moon geology, habitat systems, rover operations..."
          aria-label="Science library search"
        />

        <div className="library-content">
          <div className="library-list">
            {libraryArticles.length === 0 ? (
              <div className="empty-state">No articles match the current filter.</div>
            ) : (
              libraryArticles.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  className={`library-item ${selectedArticle.id === article.id ? 'selected' : ''}`}
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  <strong>{article.title}</strong>
                  <span>{article.category}</span>
                  <small>{article.summary}</small>
                </button>
              ))
            )}
          </div>

          <div className="article-detail">
            <p className="eyebrow">Article</p>
            <h3>{selectedArticle.title}</h3>
            <span className="article-category">{selectedArticle.category}</span>
            <p>{selectedArticle.details}</p>
          </div>
        </div>
      </section>
    </div>
  )

  const renderSettings = () => (
    <div className="panel-stack">
      <section className="panel settings-panel">
        <div className="section-heading">
          <h2>Settings</h2>
          <span>User configuration</span>
        </div>

        <div className="settings-list">
          <label className="toggle-row">
            <span>Auto-refresh telemetry</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="toggle-row">
            <span>Mission alerts</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="toggle-row">
            <span>Offline simulation mode</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="toggle-row">
            <span>AI fallback mode</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>
      </section>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'training':
        return renderTraining()
      case 'mission-control':
        return renderMissionControl()
      case 'digital-twin':
        return renderDigitalTwin()
      case 'moon':
        return renderOperations('Moon')
      case 'mars':
        return renderOperations('Mars')
      case 'ai':
        return renderAi()
      case 'reports':
        return renderReports()
      case 'library':
        return renderLibrary()
      case 'settings':
        return renderSettings()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">A</div>
          <div>
            <strong>PROJECT ASTRA</strong>
            <span>Mission operations</span>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeSection === item.key ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveSection(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
