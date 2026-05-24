import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6' },
  { id: 'raeda', label: 'Ræða', minutes: 5, color: '#f97316' },
  { id: 'svör', label: 'Svör', minutes: 3, color: '#ec4899' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#64748b' },
]

const DEBATE_ROUNDS = [
  { label: 'Ræða (frummælandi)', minutes: 5, color: '#f97316' },
  { label: 'Ræða (andmælandi)', minutes: 5, color: '#ec4899' },
  { label: 'Svör', minutes: 3, color: '#8b5cf6' },
  { label: 'Málflutningur', minutes: 2, color: '#3b82f6' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [tab, setTab] = useState('focus')
  const intervalRef = useRef(null)

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

  const selectMode = (id, customMin = null) => {
    setRunning(false)
    setModeId(id)
    if (id === 'custom') {
      const m = customMin ?? customMins
      setSeconds(m * 60)
    } else {
      const m = MODES.find(m => m.id === id)
      setSeconds(m.minutes * 60)
    }
  }

  const reset = () => {
    setRunning(false)
    setSeconds(modeId === 'custom' ? customMins * 60 : mode.minutes * 60)
  }

  const startDebateRound = (round) => {
    setTab('focus')
    selectMode('custom', round.minutes)
    setModeId('custom')
    setSeconds(round.minutes * 60)
    setRunning(false)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{sessions} Pomodoro lokins í dag</p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        {[['focus', 'Einbeiting'], ['debate', '⚖️ Ræðukeppni']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'focus' && (
        <>
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
                style={{ padding: '12px 32px', background: mode.color, fontSize: 16, color: mode.id === 'short' || mode.id === 'raeda' ? '#fff' : '#000' }}>
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

      {tab === 'debate' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#f97316' }}>⚖️ Ræðukeppni tímarar</div>
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
              Smelltu á hring til að stilla tímarann og fara yfir í Einbeitingarflipa
            </p>
            <div className="flex flex-col gap-2">
              {DEBATE_ROUNDS.map((round, i) => (
                <button key={i} onClick={() => startDebateRound(round)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                       style={{ background: `${round.color}22`, color: round.color }}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{round.label}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{round.minutes} mínútur</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
                </button>
              ))}
            </div>
          </div>

          <div className="card flex flex-col gap-2">
            <div className="text-sm font-semibold">📊 Stigagjöf</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Ræða', '× 2'],
                ['Svör', '× 2'],
                ['Málflutningur', '× 3'],
                ['Skemmtanastuðull', '× 5'],
              ].map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl flex justify-between" style={{ background: 'var(--surface2)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span className="font-semibold" style={{ color: 'var(--accent)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
