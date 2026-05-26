import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Mic, Brain } from 'lucide-react'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)', group: 'focus' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6', group: 'focus' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6', group: 'focus' },
  { id: 'speech', label: 'Ræða', minutes: 5, color: '#f97316', group: 'debate' },
  { id: 'rebuttal', label: 'Andmæli', minutes: 3, color: '#ec4899', group: 'debate' },
  { id: 'prep', label: 'Undirbúningur', minutes: 5, color: '#eab308', group: 'debate' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#64748b', group: 'focus' },
]

function pad(n) { return String(n).padStart(2, '0') }

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch {}
}

function warningBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 440
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  } catch {}
}

export default function Timer() {
  const [modeId, setModeId] = useState('pomodoro')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [tab, setTab] = useState('focus')
  const [warned60, setWarned60] = useState(false)
  const [warned30, setWarned30] = useState(false)
  const intervalRef = useRef(null)

  const mode = MODES.find(m => m.id === modeId) || MODES[0]
  const totalSeconds = modeId === 'custom' ? customMins * 60 : mode.minutes * 60
  const pct = ((totalSeconds - seconds) / totalSeconds) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  const isDebate = mode.group === 'debate'
  const isWarning = seconds <= 60 && seconds > 0 && running
  const isCritical = seconds <= 30 && seconds > 0 && running

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            if (modeId === 'pomodoro') setSessions(n => n + 1)
            beep()
            setWarned60(false)
            setWarned30(false)
            return 0
          }
          const next = s - 1
          if (next === 60 && !warned60) {
            setWarned60(true)
            warningBeep()
          }
          if (next === 30 && !warned30) {
            setWarned30(true)
            warningBeep()
          }
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeId, warned60, warned30])

  const selectMode = (id) => {
    setRunning(false)
    setModeId(id)
    setWarned60(false)
    setWarned30(false)
    const m = MODES.find(m => m.id === id)
    setSeconds(id === 'custom' ? customMins * 60 : m.minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setWarned60(false)
    setWarned30(false)
    setSeconds(modeId === 'custom' ? customMins * 60 : mode.minutes * 60)
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  const activeColor = isCritical ? '#ef4444' : isWarning ? '#f97316' : mode.color
  const focusModes = MODES.filter(m => m.group === 'focus')
  const debateModes = MODES.filter(m => m.group === 'debate')

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {sessions > 0 ? `${sessions} Pomodoro lokuð í dag` : 'Einbeittu þér'}
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {[['focus', <Brain size={14} />, 'Einbeiting'], ['debate', <Mic size={14} />, 'Ræðukeppni']].map(([t, icon, l]) => (
          <button key={t} onClick={() => {
            setTab(t)
            const defaultMode = t === 'focus' ? 'pomodoro' : 'speech'
            selectMode(defaultMode)
          }}
            className="btn text-sm flex-1 justify-center gap-1.5"
            style={{
              background: tab === t ? (t === 'debate' ? 'rgba(249,115,22,0.12)' : 'rgba(0,212,170,0.12)') : 'var(--surface)',
              color: tab === t ? (t === 'debate' ? '#f97316' : 'var(--accent)') : 'var(--muted)',
              border: `1px solid ${tab === t ? (t === 'debate' ? 'rgba(249,115,22,0.3)' : 'rgba(0,212,170,0.25)') : 'var(--border)'}`,
            }}>
            {icon} {l}
          </button>
        ))}
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {(tab === 'focus' ? focusModes : debateModes).map(m => (
          <button key={m.id} onClick={() => selectMode(m.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: modeId === m.id ? `${m.color}22` : 'var(--surface)',
              color: modeId === m.id ? m.color : 'var(--muted)',
              border: `1px solid ${modeId === m.id ? m.color + '44' : 'var(--border)'}`,
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {modeId === 'custom' && (
        <div className="card flex items-center gap-3">
          <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
          <input className="input text-sm" type="number" min={1} max={120} value={customMins}
            onChange={e => {
              setCustomMins(Number(e.target.value))
              setSeconds(Number(e.target.value) * 60)
              setRunning(false)
            }} />
        </div>
      )}

      {/* Debate tip */}
      {isDebate && (
        <div className="card-sm flex items-start gap-2"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <Mic size={14} style={{ color: '#f97316', marginTop: 1, shrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {modeId === 'speech' && 'Ræðutími: 5 mín. Varúðarmerki við 1 mín og 30 sek eftir.'}
            {modeId === 'rebuttal' && 'Andmælastími: 3 mín. Gott að nota fyrstu mínútuna í undirbúning.'}
            {modeId === 'prep' && 'Undirbúningstími: 5 mín. Skrifaðu helstu töluliðina niður.'}
          </p>
        </div>
      )}

      {/* Clock */}
      <div className="flex flex-col items-center gap-6 py-2">
        <div className="relative">
          <svg width={200} height={200} className="-rotate-90">
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6}
              stroke="var(--surface2)" />
            <circle cx={100} cy={100} r={r} fill="none" strokeWidth={6}
              stroke={activeColor}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold tabular-nums"
              style={{ color: isCritical ? '#ef4444' : isWarning ? '#f97316' : 'var(--text)' }}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {isCritical ? '⚠️ Lokast fljótt' : isWarning ? '1 mín eftir' : mode.label}
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setRunning(!running)}
            className="btn"
            style={{
              padding: '12px 36px',
              background: isCritical ? '#ef4444' : activeColor,
              color: mode.id === 'short' || isCritical ? '#fff' : '#000',
              fontSize: 16,
            }}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'Hlé' : 'Hefja'}
          </button>
        </div>
      </div>

      {/* Session dots (focus mode) */}
      {tab === 'focus' && sessions > 0 && (
        <div className="card flex flex-col items-center gap-3">
          <div className="text-sm font-medium">Í dag</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: Math.min(sessions, 12) }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {sessions} × 25 = {sessions * 25} mínútur í einbeitni
          </div>
        </div>
      )}

      {/* Debate tips */}
      {tab === 'debate' && (
        <div className="card flex flex-col gap-3">
          <div className="text-sm font-semibold">Ráðleggingar</div>
          <div className="flex flex-col gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <div className="flex gap-2">
              <span style={{ color: '#f97316' }}>▸</span>
              <span>Byrjaðu alltaf á að skilgreina hugtakið í ræðunni þinni</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: '#f97316' }}>▸</span>
              <span>Notaðu 3-5 helstu töluliði – gæði yfir magn</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: '#f97316' }}>▸</span>
              <span>Andmælastími: svaraðu sterkustu rökum andstæðings fyrst</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: '#f97316' }}>▸</span>
              <span>Enda alltaf á skýrri niðurstöðu sem tengist þingmálinu</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
