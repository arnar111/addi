import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)', group: 'focus' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6', group: 'focus' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6', group: 'focus' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#f97316', group: 'focus' },
  { id: 'takk_speech', label: '⚡ Ræða', minutes: 2, color: '#ec4899', group: 'takk' },
  { id: 'takk_reply', label: '💬 Svör', minutes: 1.5, color: '#f97316', group: 'takk' },
  { id: 'takk_argument', label: '🔥 Málfl.', minutes: 3, color: '#ef4444', group: 'takk' },
]

const TAKK_SEQUENCE = [
  { id: 'takk_speech', label: 'Aðalræða', seconds: 120 },
  { id: 'takk_reply', label: 'Svör', seconds: 90 },
  { id: 'takk_argument', label: 'Málflutningur', seconds: 180 },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [showDebate, setShowDebate] = useState(false)
  const [debateStep, setDebateStep] = useState(0)
  const [debateRunning, setDebateRunning] = useState(false)
  const [debateSecs, setDebateSecs] = useState(TAKK_SEQUENCE[0].seconds)
  const intervalRef = useRef(null)
  const debateRef = useRef(null)

  const mode = MODES.find(m => m.id === modeId) || MODES[0]
  const totalSeconds = modeId === 'custom' ? customMins * 60 : mode.minutes * 60
  const pct = ((totalSeconds - seconds) / totalSeconds) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  useEffect(() => {
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

  useEffect(() => {
    if (debateRunning) {
      debateRef.current = setInterval(() => {
        setDebateSecs(s => {
          if (s <= 1) {
            setDebateRunning(false)
            try { new Audio('https://www.soundjay.com/misc/bell-ringing-01.mp3').play() } catch {}
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(debateRef.current)
    }
    return () => clearInterval(debateRef.current)
  }, [debateRunning])

  const selectMode = (id) => {
    setRunning(false)
    setModeId(id)
    const m = MODES.find(m => m.id === id)
    setSeconds(id === 'custom' ? customMins * 60 : Math.round(m.minutes * 60))
  }

  const reset = () => {
    setRunning(false)
    setSeconds(modeId === 'custom' ? customMins * 60 : Math.round(mode.minutes * 60))
  }

  const nextDebateStep = () => {
    const next = debateStep + 1
    if (next >= TAKK_SEQUENCE.length) {
      setDebateStep(0)
      setDebateSecs(TAKK_SEQUENCE[0].seconds)
    } else {
      setDebateStep(next)
      setDebateSecs(TAKK_SEQUENCE[next].seconds)
    }
    setDebateRunning(false)
  }

  const resetDebate = () => {
    setDebateRunning(false)
    setDebateStep(0)
    setDebateSecs(TAKK_SEQUENCE[0].seconds)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  const curDebateStep = TAKK_SEQUENCE[debateStep]
  const debatePct = ((curDebateStep.seconds - debateSecs) / curDebateStep.seconds) * 100
  const debateDashOffset = circ - (debatePct / 100) * circ
  const debateMins = Math.floor(debateSecs / 60)
  const debateSecsRem = debateSecs % 60

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{sessions} Pomodoro lokins í dag</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => setShowDebate(false)}
          className="flex-1 btn text-sm justify-center"
          style={{
            background: !showDebate ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
            color: !showDebate ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${!showDebate ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
          }}>
          ⏱ Pomodoro
        </button>
        <button onClick={() => setShowDebate(true)}
          className="flex-1 btn text-sm justify-center"
          style={{
            background: showDebate ? 'rgba(236,72,153,0.12)' : 'var(--surface)',
            color: showDebate ? '#ec4899' : 'var(--muted)',
            border: `1px solid ${showDebate ? 'rgba(236,72,153,0.3)' : 'var(--border)'}`,
          }}>
          🎤 Takk! Umræður
        </button>
      </div>

      {!showDebate ? (
        <>
          {/* Mode selector */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {MODES.filter(m => m.group === 'focus').map(m => (
              <button key={m.id} onClick={() => selectMode(m.id)}
                className="btn shrink-0 text-sm"
                style={{
                  background: modeId === m.id ? `${m.color}22` : 'var(--surface)',
                  color: modeId === m.id ? m.color : 'var(--muted)',
                  border: `1px solid ${modeId === m.id ? m.color + '44' : 'var(--border)'}`,
                }}>{m.label}</button>
            ))}
          </div>

          {modeId === 'custom' && (
            <div className="card flex items-center gap-3">
              <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
              <input className="input text-sm" type="number" min={1} max={120} value={customMins}
                onChange={e => { setCustomMins(Number(e.target.value)); setSeconds(Number(e.target.value) * 60); setRunning(false) }} />
            </div>
          )}

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
                style={{ padding: '12px 32px', background: mode.color, fontSize: 16, color: ['short','long','takk_reply','takk_argument'].includes(modeId) ? '#fff' : '#000' }}>
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
      ) : (
        <>
          {/* Takk! Debate Timer */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(239,68,68,0.04))', borderColor: 'rgba(236,72,153,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold">🎤 Takk! Umræðutímari</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Stig {debateStep + 1}/{TAKK_SEQUENCE.length}: {curDebateStep.label}</div>
              </div>
              <button onClick={resetDebate} className="btn btn-ghost py-1.5 px-3 text-xs">
                <RotateCcw size={13} /> Byrja aftur
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 mb-5">
              {TAKK_SEQUENCE.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="h-1.5 rounded-full w-full" style={{
                    background: i < debateStep ? '#ec4899' : i === debateStep ? 'rgba(236,72,153,0.4)' : 'var(--surface2)'
                  }} />
                  <span style={{ fontSize: 9, color: i === debateStep ? '#ec4899' : 'var(--muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <svg width={160} height={160} className="-rotate-90">
                  <circle cx={80} cy={80} r={65} fill="none" strokeWidth={5} stroke="var(--surface2)" />
                  <circle cx={80} cy={80} r={65} fill="none" strokeWidth={5}
                    stroke="#ec4899"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 65}
                    strokeDashoffset={(2 * Math.PI * 65) - (debatePct / 100) * (2 * Math.PI * 65)}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-mono font-bold tabular-nums">
                    {pad(debateMins)}:{pad(debateSecsRem)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#ec4899' }}>{curDebateStep.label}</div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button onClick={() => setDebateRunning(!debateRunning)}
                  className="btn"
                  style={{ padding: '10px 28px', background: '#ec4899', color: '#fff', fontSize: 15 }}>
                  {debateRunning ? <Pause size={18} /> : <Play size={18} />}
                  {debateRunning ? 'Hlé' : 'Hefja'}
                </button>
                {debateStep < TAKK_SEQUENCE.length - 1 && (
                  <button onClick={nextDebateStep} className="btn btn-ghost text-sm">
                    Næst <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Tímasetningar</div>
            <div className="flex flex-col gap-2">
              {TAKK_SEQUENCE.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span style={{ color: i === debateStep ? '#ec4899' : 'var(--text)' }}>
                    {i + 1}. {s.label}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
                    {Math.floor(s.seconds / 60)}:{pad(s.seconds % 60)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
