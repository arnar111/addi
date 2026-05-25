import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Mic } from 'lucide-react'

const POMODORO_MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: 'var(--accent)' },
  { id: 'short', label: 'Stutt hlé', minutes: 5, color: '#8b5cf6' },
  { id: 'long', label: 'Langt hlé', minutes: 15, color: '#3b82f6' },
  { id: 'custom', label: 'Sérsniðið', minutes: 30, color: '#f97316' },
]

const SPEECH_MODES = [
  { id: 'raeda2', label: 'Ræða 2 mín', minutes: 2, color: '#ec4899', warn: 30 },
  { id: 'raeda3', label: 'Ræða 3 mín', minutes: 3, color: '#ec4899', warn: 30 },
  { id: 'svor', label: 'Svör 1 mín', minutes: 1, color: '#f97316', warn: 15 },
  { id: 'malflutningur', label: 'Málflutningur 2 mín', minutes: 2, color: '#8b5cf6', warn: 30 },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Timer() {
  const [timerType, setTimerType] = useState('pomodoro')
  const [modeId, setModeId] = useState('pomodoro')
  const [speechModeId, setSpeechModeId] = useState('raeda3')
  const [customMins, setCustomMins] = useState(30)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [speechNote, setSpeechNote] = useState('')
  const [warnTriggered, setWarnTriggered] = useState(false)
  const intervalRef = useRef(null)

  const currentModes = timerType === 'pomodoro' ? POMODORO_MODES : SPEECH_MODES
  const currentMode = timerType === 'pomodoro'
    ? (POMODORO_MODES.find(m => m.id === modeId) || POMODORO_MODES[0])
    : (SPEECH_MODES.find(m => m.id === speechModeId) || SPEECH_MODES[0])

  const totalSeconds = timerType === 'pomodoro' && modeId === 'custom'
    ? customMins * 60
    : currentMode.minutes * 60

  const pct = ((totalSeconds - seconds) / totalSeconds) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isWarning = timerType === 'speech' && currentMode.warn && seconds <= currentMode.warn && seconds > 0

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            if (timerType === 'pomodoro' && currentMode.id === 'pomodoro') setSessions(n => n + 1)
            try { new Audio('https://www.soundjay.com/misc/bell-ringing-01.mp3').play() } catch {}
            return 0
          }
          if (timerType === 'speech' && currentMode.warn && s === currentMode.warn && !warnTriggered) {
            setWarnTriggered(true)
            try { new Audio('https://www.soundjay.com/misc/beep-07.mp3').play() } catch {}
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, currentMode, timerType, warnTriggered])

  const selectMode = (id) => {
    setRunning(false)
    setWarnTriggered(false)
    if (timerType === 'pomodoro') {
      setModeId(id)
      const m = POMODORO_MODES.find(m => m.id === id)
      setSeconds(id === 'custom' ? customMins * 60 : m.minutes * 60)
    } else {
      setSpeechModeId(id)
      const m = SPEECH_MODES.find(m => m.id === id)
      setSeconds(m.minutes * 60)
    }
  }

  const reset = () => {
    setRunning(false)
    setWarnTriggered(false)
    setSeconds(totalSeconds)
  }

  const switchType = (type) => {
    setRunning(false)
    setWarnTriggered(false)
    setTimerType(type)
    if (type === 'pomodoro') {
      const m = POMODORO_MODES.find(m => m.id === modeId) || POMODORO_MODES[0]
      setSeconds(modeId === 'custom' ? customMins * 60 : m.minutes * 60)
    } else {
      const m = SPEECH_MODES.find(m => m.id === speechModeId) || SPEECH_MODES[0]
      setSeconds(m.minutes * 60)
    }
  }

  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ
  const ringColor = isWarning ? '#ef4444' : currentMode.color

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tímari</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {timerType === 'pomodoro'
            ? `${sessions} Pomodoro lokins í dag`
            : 'Ræðukeppni æfing'}
        </p>
      </div>

      {/* Type switcher */}
      <div className="flex gap-2">
        {[
          { id: 'pomodoro', label: '🍅 Pomodoro' },
          { id: 'speech', label: '🎤 Ræðukeppni' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => switchType(id)}
            className="flex-1 btn text-sm justify-center"
            style={{
              background: timerType === id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: timerType === id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${timerType === id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{label}</button>
        ))}
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {currentModes.map(m => (
          <button key={m.id}
            onClick={() => selectMode(m.id)}
            className="btn shrink-0 text-xs"
            style={{
              background: (timerType === 'pomodoro' ? modeId : speechModeId) === m.id ? `${m.color}22` : 'var(--surface)',
              color: (timerType === 'pomodoro' ? modeId : speechModeId) === m.id ? m.color : 'var(--muted)',
              border: `1px solid ${(timerType === 'pomodoro' ? modeId : speechModeId) === m.id ? m.color + '44' : 'var(--border)'}`,
            }}>{m.label}</button>
        ))}
      </div>

      {timerType === 'pomodoro' && modeId === 'custom' && (
        <div className="card flex items-center gap-3">
          <label className="text-sm shrink-0" style={{ color: 'var(--muted)' }}>Mínútur:</label>
          <input className="input text-sm" type="number" min={1} max={120} value={customMins}
            onChange={e => { setCustomMins(Number(e.target.value)); setSeconds(Number(e.target.value) * 60); setRunning(false) }} />
        </div>
      )}

      {/* Warning banner */}
      {isWarning && (
        <div className="card flex items-center gap-2 animate-pulse-soft"
             style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <span className="text-base">⚠️</span>
          <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            {seconds}s eftir — kláraðu hugsunarnar!
          </span>
        </div>
      )}

      {/* Clock */}
      <div className="flex flex-col items-center gap-6 py-2">
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
            <div className="text-4xl font-mono font-bold tabular-nums" style={{ color: isWarning ? 'var(--danger)' : 'var(--text)' }}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{currentMode.label}</div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '10px' }}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setRunning(!running)}
            className="btn btn-primary"
            style={{ padding: '12px 32px', background: isWarning ? 'var(--danger)' : currentMode.color, fontSize: 16, color: currentMode.id === 'short' ? '#fff' : '#000' }}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'Hlé' : 'Hefja'}
          </button>
        </div>
      </div>

      {/* Speech notes */}
      {timerType === 'speech' && (
        <div className="card flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Mic size={14} style={{ color: currentMode.color }} />
            <span className="text-sm font-medium">Ræðuglósur</span>
          </div>
          <textarea className="input resize-none text-sm leading-relaxed" rows={5}
            placeholder={`Skrifaðu lykilpunkta, rök eða opening-line hér...`}
            value={speechNote} onChange={e => setSpeechNote(e.target.value)} />
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Tip: Þrír lykilpunktar, strong opener, skemmtilegt dæmi 💡
          </div>
        </div>
      )}

      {/* Pomodoro session dots */}
      {timerType === 'pomodoro' && sessions > 0 && (
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
