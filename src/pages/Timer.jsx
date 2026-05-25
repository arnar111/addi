import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Mic } from 'lucide-react'

const POMODORO_MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#f97316' },
]

const DEBATE_MODES = [
  { id: 'speech5', label: 'Ræða (5 mín)', minutes: 5, color: '#ec4899', warn: 60, hint: 'Aðalræða' },
  { id: 'speech3', label: 'Ræða (3 mín)', minutes: 3, color: '#f97316', warn: 30, hint: 'Svar / Andmæli' },
  { id: 'speech2', label: 'Ræða (2 mín)', minutes: 2, color: '#8b5cf6', warn: 30, hint: 'Samantekt' },
  { id: 'prep', label: 'Undirbúningur', minutes: 10, color: '#3b82f6', warn: 60, hint: 'Keppni undirbúningur' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [timerTab, setTimerTab] = useState('pomodoro')
  const [modeId, setModeId] = useState('pomodoro')
  const [debateModeId, setDebateModeId] = useState('speech5')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [debateSessions, setDebateSessions] = useState([])
  const [warned, setWarned] = useState(false)
  const intervalRef = useRef(null)

  const isDebate = timerTab === 'debate'
  const modes = isDebate ? DEBATE_MODES : POMODORO_MODES
  const activeId = isDebate ? debateModeId : modeId
  const mode = modes.find(m => m.id === activeId) || modes[0]
  const totalSeconds = (!isDebate && modeId === 'custom') ? customMins * 60 : mode.minutes * 60
  const pct = ((totalSeconds - seconds) / totalSeconds) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  const warnThreshold = mode.warn || 60
  const isWarning = isDebate && running && seconds <= warnThreshold && seconds > 0
  const isAlmostDone = running && seconds <= 30 && seconds > 0

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            if (!isDebate && modeId === 'pomodoro') setSessions(n => n + 1)
            if (isDebate) {
              setDebateSessions(prev => [...prev, { mode: mode.label, time: new Date().toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) }])
            }
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
  }, [running, modeId, debateModeId, isDebate, mode.label])

  const selectMode = (id) => {
    setRunning(false)
    setWarned(false)
    if (isDebate) {
      setDebateModeId(id)
      const m = DEBATE_MODES.find(m => m.id === id)
      setSeconds(m.minutes * 60)
    } else {
      setModeId(id)
      const m = POMODORO_MODES.find(m => m.id === id)
      setSeconds(id === 'custom' ? customMins * 60 : m.minutes * 60)
    }
  }

  const switchTab = (tab) => {
    setRunning(false)
    setTimerTab(tab)
    setWarned(false)
    if (tab === 'debate') {
      const m = DEBATE_MODES.find(m => m.id === debateModeId) || DEBATE_MODES[0]
      setSeconds(m.minutes * 60)
    } else {
      const m = POMODORO_MODES.find(m => m.id === modeId) || POMODORO_MODES[0]
      setSeconds(modeId === 'custom' ? customMins * 60 : m.minutes * 60)
    }
  }

  const reset = () => {
    setRunning(false)
    setWarned(false)
    setSeconds(totalSeconds)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  const ringColor = isWarning ? (isAlmostDone ? 'var(--danger)' : '#f97316') : mode.color

  return (
    <div className="flex flex-col gap-6 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {isDebate ? `${debateSessions.length} ræður kláraðar` : `${sessions} Pomodoro kláraðar í dag`}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {[['pomodoro', '🍅 Pomodoro'], ['debate', '🎤 Ræðukeppni']].map(([t, l]) => (
          <button key={t} onClick={() => switchTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: timerTab === t ? (t === 'debate' ? 'rgba(236,72,153,0.12)' : 'rgba(0,212,170,0.12)') : 'var(--surface)',
              color: timerTab === t ? (t === 'debate' ? '#ec4899' : 'var(--accent)') : 'var(--muted)',
              border: `1px solid ${timerTab === t ? (t === 'debate' ? 'rgba(236,72,153,0.3)' : 'rgba(0,212,170,0.25)') : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {isDebate && (
        <div className="card py-2.5 px-3" style={{ background: 'rgba(236,72,153,0.06)', borderColor: 'rgba(236,72,153,0.2)' }}>
          <div className="text-xs font-medium" style={{ color: '#ec4899' }}>🎤 Ræðukeppni – Takk</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{mode.hint}</div>
        </div>
      )}

      {/* Mode selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {modes.map(m => (
          <button key={m.id} onClick={() => selectMode(m.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: activeId === m.id ? `${m.color}22` : 'var(--surface)',
              color: activeId === m.id ? m.color : 'var(--muted)',
              border: `1px solid ${activeId === m.id ? m.color + '44' : 'var(--border)'}`,
            }}>{m.label}</button>
        ))}
      </div>

      {!isDebate && modeId === 'custom' && (
        <div className="card flex items-center gap-3">
          <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
          <input className="input text-sm" type="number" min={1} max={120} value={customMins}
            onChange={e => { setCustomMins(Number(e.target.value)); setSeconds(Number(e.target.value) * 60); setRunning(false) }} />
        </div>
      )}

      {/* Warning banner */}
      {isWarning && (
        <div className="card py-2.5 text-center animate-pulse-soft"
             style={{ background: isAlmostDone ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)',
                      borderColor: isAlmostDone ? 'rgba(239,68,68,0.35)' : 'rgba(249,115,22,0.35)',
                      color: isAlmostDone ? 'var(--danger)' : '#f97316' }}>
          {isAlmostDone ? '⏰ 30 sekúndur eftir!' : `⚠️ ${warnThreshold / 60} mínúta eftir`}
        </div>
      )}

      {/* Clock */}
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <svg width={200} height={200} className="-rotate-90">
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6} stroke="var(--surface2)" />
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6}
              stroke={ringColor}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold tabular-nums"
                 style={{ color: isWarning ? ringColor : 'var(--text)' }}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {isDebate ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mic size={11} /> {mode.label}</span> : mode.label}
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setRunning(!running)}
            className="btn btn-primary"
            style={{ padding: '12px 32px', background: ringColor, fontSize: 16,
                     color: (mode.id === 'short' || isDebate) ? '#fff' : '#000' }}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'Hlé' : 'Hefja'}
          </button>
        </div>
      </div>

      {/* Session log */}
      {!isDebate && sessions > 0 && (
        <div className="card flex flex-col items-center gap-3">
          <div className="text-sm font-medium">Pomodoro í dag</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: sessions }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{sessions} × 25 = {sessions * 25} mínútur í einbeitni</div>
        </div>
      )}

      {isDebate && debateSessions.length > 0 && (
        <div className="card flex flex-col gap-2">
          <div className="text-sm font-medium">Ræður í þessari lotu</div>
          {debateSessions.map((s, i) => (
            <div key={i} className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>🎤 {s.mode}</span>
              <span>{s.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
