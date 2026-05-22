import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ChevronRight, Check } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#f97316' },
  { id: 'stummi', label: '🎙 Stummi', minutes: 0, color: '#ec4899' },
]

// Stummi (Icelandic parliamentary debate) phases
const STUMMI_PHASES = [
  { id: 'prep', label: 'Undirbúningur', minutes: 5, color: '#64748b' },
  { id: 'speech1', label: 'Aðalræða 1', minutes: 7, color: '#ec4899' },
  { id: 'speech2', label: 'Aðalræða 2', minutes: 7, color: '#8b5cf6' },
  { id: 'reply1', label: 'Svar 1', minutes: 3, color: '#ec4899' },
  { id: 'reply2', label: 'Svar 2', minutes: 3, color: '#8b5cf6' },
  { id: 'debate', label: 'Frjáls umræða', minutes: 10, color: '#f97316' },
  { id: 'close1', label: 'Lokaræða 1', minutes: 2, color: '#ec4899' },
  { id: 'close2', label: 'Lokaræða 2', minutes: 2, color: '#8b5cf6' },
]

function pad(n) { return String(n).padStart(2, '0') }

function StummiTimer() {
  const [phase, setPhase] = useState(0)
  const [seconds, setSeconds] = useState(STUMMI_PHASES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState([])
  const intervalRef = useRef(null)

  const currentPhase = STUMMI_PHASES[phase]
  const totalSeconds = currentPhase.minutes * 60
  const pct = ((totalSeconds - seconds) / totalSeconds) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setDone(prev => [...prev, phase])
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, phase])

  const goToPhase = (idx) => {
    setRunning(false)
    setPhase(idx)
    setSeconds(STUMMI_PHASES[idx].minutes * 60)
  }

  const next = () => {
    if (phase < STUMMI_PHASES.length - 1) {
      setDone(prev => [...prev, phase])
      goToPhase(phase + 1)
    }
  }

  const reset = () => {
    setRunning(false)
    setPhase(0)
    setSeconds(STUMMI_PHASES[0].minutes * 60)
    setDone([])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Phase list */}
      <div className="card flex flex-col gap-1">
        {STUMMI_PHASES.map((p, i) => (
          <button key={p.id} onClick={() => goToPhase(i)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all"
            style={{
              background: phase === i ? `${p.color}15` : 'transparent',
              border: `1px solid ${phase === i ? p.color + '44' : 'transparent'}`,
            }}>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                 style={{ borderColor: done.includes(i) ? p.color : phase === i ? p.color : 'var(--border)', background: done.includes(i) ? p.color : 'transparent' }}>
              {done.includes(i) && <Check size={10} color="#000" />}
            </div>
            <span className="flex-1" style={{ color: phase === i ? p.color : done.includes(i) ? 'var(--muted)' : 'var(--text)', textDecoration: done.includes(i) ? 'line-through' : 'none' }}>
              {p.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{p.minutes} mín</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <svg width={200} height={200} className="-rotate-90">
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6} stroke="var(--surface2)" />
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6}
              stroke={currentPhase.color}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs mb-1" style={{ color: currentPhase.color }}>{currentPhase.label}</div>
            <div className="text-4xl font-mono font-bold tabular-nums">
              {pad(mins)}:{pad(secs)}
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setRunning(!running)}
            className="btn"
            style={{ padding: '12px 28px', background: currentPhase.color, color: '#fff', fontSize: 16 }}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'Hlé' : 'Hefja'}
          </button>
          {phase < STUMMI_PHASES.length - 1 && (
            <button onClick={next} className="btn btn-ghost flex items-center gap-1" style={{ padding: '10px 14px' }}>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
        {phase + 1}/{STUMMI_PHASES.length} · {done.length} lokið
      </div>
    </div>
  )
}

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const mode = MODES.find(m => m.id === modeId) || MODES[0]
  const totalSeconds = modeId === 'custom' ? customMins * 60 : mode.minutes * 60
  const pct = totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  useEffect(() => {
    if (modeId === 'stummi') return
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            if (modeId === 'pomodoro') setSessions(n => n + 1)
            try { new Audio('https://www.soundjay.com/misc/bell-ringing-01.mp3').play() } catch {}
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeId])

  const selectMode = (id) => {
    setRunning(false)
    setModeId(id)
    const m = MODES.find(m => m.id === id)
    if (id === 'stummi' || !m) return
    setSeconds(id === 'custom' ? customMins * 60 : m.minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(modeId === 'custom' ? customMins * 60 : (mode?.minutes || 25) * 60)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col gap-6 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {modeId === 'stummi' ? 'Stummikeppni' : `${sessions} Pomodoro lokins í dag`}
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => selectMode(m.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: modeId === m.id ? `${m.color}22` : 'var(--surface)',
              color: modeId === m.id ? m.color : 'var(--muted)',
              border: `1px solid ${modeId === m.id ? m.color + '44' : 'var(--border)'}`,
            }}>{m.label}</button>
        ))}
      </div>

      {modeId === 'stummi' ? (
        <StummiTimer />
      ) : (
        <>
          {modeId === 'custom' && (
            <div className="card flex items-center gap-3">
              <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
              <input className="input text-sm" type="number" min={1} max={120} value={customMins}
                onChange={e => { setCustomMins(Number(e.target.value)); setSeconds(Number(e.target.value) * 60); setRunning(false) }} />
            </div>
          )}

          {/* Clock */}
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
              <svg width={200} height={200} className="-rotate-90">
                <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6} stroke="var(--surface2)" />
                <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6}
                  stroke={mode.color}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-mono font-bold tabular-nums">
                  {pad(mins)}:{pad(secs)}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{mode.label}</div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
                <RotateCcw size={18} />
              </button>
              <button onClick={() => setRunning(!running)}
                className="btn btn-primary"
                style={{ padding: '12px 32px', background: mode.color, fontSize: 16, color: mode.id === 'short' ? '#fff' : '#000' }}>
                {running ? <Pause size={20} /> : <Play size={20} />}
                {running ? 'Hlé' : 'Hefja'}
              </button>
            </div>
          </div>

          {sessions > 0 && (
            <div className="card flex flex-col items-center gap-3">
              <div className="text-sm font-medium">Í dag</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: sessions }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
                ))}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{sessions} × 25 = {sessions * 25} mínútur í einbeitni</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
