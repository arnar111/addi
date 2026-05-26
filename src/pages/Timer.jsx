import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#f97316' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [showCustom, setShowCustom] = useState(false)
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
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain); gain.connect(ctx.destination)
              osc.frequency.value = 880
              gain.gain.setValueAtTime(0.3, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
              osc.start(); osc.stop(ctx.currentTime + 1.5)
            } catch {}
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Addi · Tímari', { body: 'Tíminn er útrunninn! 🎉', icon: '/favicon.svg' })
            }
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
    setSeconds(id === 'custom' ? customMins * 60 : m.minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(modeId === 'custom' ? customMins * 60 : mode.minutes * 60)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col gap-6 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Tímari</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{sessions} Pomodoro lokins í dag</p>
        </div>
        {'Notification' in window && Notification.permission === 'default' && (
          <button className="btn btn-ghost text-xs py-1.5"
            onClick={() => Notification.requestPermission()}>
            🔔 Leyfa tilkynningar
          </button>
        )}
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

      {/* Session dots */}
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
    </div>
  )
}
