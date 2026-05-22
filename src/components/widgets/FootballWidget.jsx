import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Plus, X, Trophy } from 'lucide-react'

const INTER_BLUE = '#0068A8'
const INTER_BLACK = '#1a1a1a'

const DEFAULT_MATCHES = [
  {
    id: 'cup1',
    competition: 'Coppa Italia',
    homeTeam: 'Inter',
    awayTeam: 'Milan',
    homeScore: 1,
    awayScore: 0,
    date: '2026-05-13',
    finished: true,
    trophy: true,
  },
]

export default function FootballWidget() {
  const [matches, setMatches] = useLocalStorage('addi_football', DEFAULT_MATCHES)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    competition: 'Serie A', homeTeam: 'Inter', awayTeam: '',
    homeScore: '', awayScore: '', date: new Date().toISOString().split('T')[0], finished: false,
  })

  const addMatch = (e) => {
    e.preventDefault()
    if (!form.awayTeam.trim()) return
    setMatches(prev => [{
      id: Date.now().toString(),
      ...form,
      homeScore: form.finished ? Number(form.homeScore) : null,
      awayScore: form.finished ? Number(form.awayScore) : null,
    }, ...prev])
    setForm({ competition: 'Serie A', homeTeam: 'Inter', awayTeam: '', homeScore: '', awayScore: '', date: new Date().toISOString().split('T')[0], finished: false })
    setShowAdd(false)
  }

  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const recent = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  return (
    <div className="card" style={{
      background: `linear-gradient(135deg, rgba(0,104,168,0.08), rgba(0,0,0,0.04))`,
      border: `1px solid rgba(0,104,168,0.2)`,
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
               style={{ background: `linear-gradient(135deg, ${INTER_BLUE}, ${INTER_BLACK})`, color: '#fff' }}>
            ⚫🔵
          </div>
          <div>
            <div className="font-semibold text-sm">Inter Milan</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>2025/26</div>
          </div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--surface2)' }}>
          {showAdd ? <X size={13} style={{ color: 'var(--muted)' }} /> : <Plus size={13} style={{ color: 'var(--muted)' }} />}
        </button>
      </div>

      {/* Champion banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
           style={{ background: 'linear-gradient(90deg, rgba(0,104,168,0.15), rgba(255,215,0,0.1))', border: '1px solid rgba(255,215,0,0.25)' }}>
        <Trophy size={14} style={{ color: '#fbbf24', flexShrink: 0 }} />
        <div className="text-xs font-semibold">
          Campioni d'Italia 🏆 + Coppa Italia 🏆 · Historic Double!
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={addMatch} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Keppni</div>
              <input className="input text-xs py-1.5" value={form.competition}
                onChange={e => setForm(f => ({ ...f, competition: e.target.value }))} placeholder="Serie A" />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Dagsetning</div>
              <input className="input text-xs py-1.5" type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <input className="input text-xs py-1.5 text-center" value={form.homeTeam}
              onChange={e => setForm(f => ({ ...f, homeTeam: e.target.value }))} placeholder="Heimalið" />
            <div className="text-center text-xs font-bold" style={{ color: 'var(--muted)' }}>vs</div>
            <input className="input text-xs py-1.5 text-center" value={form.awayTeam}
              onChange={e => setForm(f => ({ ...f, awayTeam: e.target.value }))} placeholder="Útilið" required />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--muted)' }}>
              <input type="checkbox" checked={form.finished}
                onChange={e => setForm(f => ({ ...f, finished: e.target.checked }))} />
              Leikur lokinn
            </label>
          </div>
          {form.finished && (
            <div className="grid grid-cols-3 gap-2 items-center">
              <input className="input text-sm py-1.5 text-center" type="number" min={0} max={20}
                value={form.homeScore} onChange={e => setForm(f => ({ ...f, homeScore: e.target.value }))} placeholder="0" />
              <div className="text-center text-xs font-bold" style={{ color: 'var(--muted)' }}>:</div>
              <input className="input text-sm py-1.5 text-center" type="number" min={0} max={20}
                value={form.awayScore} onChange={e => setForm(f => ({ ...f, awayScore: e.target.value }))} placeholder="0" />
            </div>
          )}
          <button type="submit" className="btn btn-primary text-xs py-2 justify-center w-full"
                  style={{ background: INTER_BLUE, color: '#fff' }}>
            Vista leik
          </button>
        </form>
      )}

      {/* Match list */}
      <div className="flex flex-col gap-1.5">
        {recent.length === 0 ? (
          <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engir leikir skráðir</div>
        ) : recent.map(m => {
          const isInter = m.homeTeam === 'Inter'
          const interScore = isInter ? m.homeScore : m.awayScore
          const oppScore = isInter ? m.awayScore : m.homeScore
          const won = m.finished && interScore > oppScore
          const drew = m.finished && interScore === oppScore
          const resultColor = won ? '#22c55e' : drew ? '#f97316' : m.finished ? 'var(--danger)' : INTER_BLUE

          return (
            <div key={m.id} className="flex items-center gap-2 px-2.5 py-2 rounded-xl group"
                 style={{ background: 'var(--surface2)' }}>
              {m.finished ? (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0"
                      style={{ background: `${resultColor}22`, color: resultColor }}>
                  {won ? 'W' : drew ? 'D' : 'L'}
                </span>
              ) : (
                <span className="text-xs px-1.5 py-0.5 rounded-md shrink-0"
                      style={{ background: `${INTER_BLUE}22`, color: INTER_BLUE }}>
                  {new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {m.homeTeam} vs {m.awayTeam}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.competition}</div>
              </div>
              {m.finished && (
                <span className="text-sm font-bold shrink-0" style={{ color: resultColor }}>
                  {m.homeScore}–{m.awayScore}
                </span>
              )}
              <button onClick={() => removeMatch(m.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: 'var(--muted)' }}>
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
