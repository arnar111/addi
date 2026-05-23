import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)', group: 'focus' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6', group: 'focus' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6', group: 'focus' },
  { id: 'opening', label: 'Opnunarræða', minutes: 5, color: '#f97316', group: 'debate' },
  { id: 'rebuttal', label: 'Svör', minutes: 3, color: '#ef4444', group: 'debate' },
  { id: 'closing', label: 'Lokun', minutes: 2, color: '#eab308', group: 'debate' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#64748b', group: 'other' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [group, setGroup] = useState('focus')
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

  const focusModes = MODES.filter(m => m.group === 'focus')
  const debateModes = MODES.filter(m => m.group === 'debate')

  const groupTabs = [
    { id: 'focus', label: '🎯 Einbeiting' },
    { id: 'debate', label: '🎤 Ræðumót' },
    { id: 'other', label: '⏱ Sérsniðið' },
  ]

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {group === 'debate' ? 'Ræðukeppni · Tímasetning' : `${sessions} Pomodoro lokins í dag`}
        </p>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2">
        {groupTabs.map(t => (
          <button key={t.id}
            onClick={() => {
              setGroup(t.id)
              const first = MODES.find(m => m.group === t.id)
              if (first) selectMode(first.id)
            }}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: group === t.id ? `${mode.color}18` : 'var(--surface)',
              color: group === t.id ? mode.color : 'var(--muted)',
              border: `1px solid ${group === t.id ? mode.color + '44' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {/* Mode selector */}
      {group !== 'other' && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(group === 'focus' ? focusModes : debateModes).map(m => (
            <button key={m.id} onClick={() => selectMode(m.id)}
              className="btn shrink-0 text-sm"
              style={{
                background: modeId === m.id ? `${m.color}22` : 'var(--surface)',
                color: modeId === m.id ? m.color : 'var(--muted)',
                border: `1px solid ${modeId === m.id ? m.color + '44' : 'var(--border)'}`,
              }}>
              {m.label} <span style={{ color: 'var(--muted)', fontSize: 11 }}>{m.minutes}m</span>
            </button>
          ))}
        </div>
      )}

      {group === 'other' && (
        <div className="card flex items-center gap-3">
          <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
          <input className="input text-sm" type="number" min={1} max={180} value={customMins}
            onChange={e => {
              const v = Number(e.target.value)
              setCustomMins(v)
              setSeconds(v * 60)
              setRunning(false)
            }} />
        </div>
      )}

      {/* Debate info card */}
      {group === 'debate' && (
        <div className="card-sm" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <div className="text-xs font-medium mb-1" style={{ color: '#f97316' }}>Ræðuformið</div>
          <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <div>🎤 Opnun: 5m</div>
            <div>💬 Svör: 3m</div>
            <div>🔒 Lokun: 2m</div>
          </div>
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
            <div className="text-4xl font-mono font-bold tabular-nums"
                 style={{ color: seconds < 30 && running ? 'var(--danger)' : 'var(--text)' }}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div className="text-xs mt-1" style={{ color: mode.color }}>{mode.label}</div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setRunning(!running)}
            className="btn btn-primary"
            style={{ padding: '12px 32px', background: mode.color, fontSize: 16,
                     color: ['#eab308', 'var(--accent)'].includes(mode.color) ? '#000' : '#fff' }}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'Hlé' : 'Hefja'}
          </button>
        </div>
      </div>

      {/* Session dots — focus mode only */}
      {group === 'focus' && sessions > 0 && (
        <div className="card flex flex-col items-center gap-3">
          <div className="text-sm font-medium">Pomodoro í dag</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: sessions }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {sessions} × 25 = {sessions * 25} mínútur í einbeitni
          </div>
        </div>
      )}
    </div>
  )
}
