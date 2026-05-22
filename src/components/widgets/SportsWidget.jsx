import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Plus, X, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T17:00:00Z')

function daysUntil(target) {
  return Math.max(0, Math.ceil((target - new Date()) / 86400000))
}

const PINNED_TEAMS = [
  { flag: '🇮🇸', code: 'ISL' },
  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
  { flag: '🇧🇷', code: 'BRA' },
  { flag: '🇦🇷', code: 'ARG' },
]

export default function SportsWidget() {
  const days = daysUntil(WC_START)
  const [scores, setScores] = useLocalStorage('addi_scores', [])
  const [showForm, setShowForm] = useState(false)
  const [home, setHome] = useState('')
  const [away, setAway] = useState('')
  const [result, setResult] = useState('')

  const addScore = (e) => {
    e.preventDefault()
    if (!home.trim() || !away.trim()) return
    setScores(prev => [{ id: Date.now().toString(), home, away, result, date: new Date().toISOString() }, ...prev.slice(0, 4)])
    setHome(''); setAway(''); setResult('')
    setShowForm(false)
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(0,212,170,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>⚽</span>
          <h3 className="font-semibold text-sm">
            {days > 0 ? 'Heimsmeistaramót 2026' : 'HM 2026 · Í gangi!'}
          </h3>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs flex items-center gap-0.5" style={{ color: 'var(--accent)' }}>
          <Plus size={12} /> Niðurstaða
        </button>
      </div>

      {days > 0 ? (
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{days}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>dagar eftir · 11. júní 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · México</div>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end flex-1">
            {PINNED_TEAMS.map(t => (
              <div key={t.code} className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span style={{ fontSize: 22 }}>{t.flag}</span>
                <span style={{ fontSize: 9, color: 'var(--muted)' }}>{t.code}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm mb-3" style={{ color: 'var(--success)' }}>🎉 Mótið er hafið!</div>
      )}

      {showForm && (
        <form onSubmit={addScore} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" placeholder="Heimalið" value={home}
              onChange={e => setHome(e.target.value)} autoFocus />
            <input className="input text-sm w-16 text-center" placeholder="2-1" value={result}
              onChange={e => setResult(e.target.value)} />
            <input className="input text-sm flex-1" placeholder="Gestir" value={away}
              onChange={e => setAway(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center text-xs py-1.5">Vista</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost py-1.5">
              <X size={14} />
            </button>
          </div>
        </form>
      )}

      {scores.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {scores.map(s => (
            <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                 style={{ background: 'var(--surface2)' }}>
              <span className="flex-1 text-xs text-right">{s.home}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md min-w-[40px] text-center"
                    style={{ background: 'var(--border)', fontVariantNumeric: 'tabular-nums' }}>
                {s.result || '–'}
              </span>
              <span className="flex-1 text-xs">{s.away}</span>
              <button onClick={() => setScores(prev => prev.filter(x => x.id !== s.id))}
                      style={{ color: 'var(--muted)' }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
