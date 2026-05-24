import { useState } from 'react'
import { useFootball } from '../../hooks/useFootball'
import { Plus, X, ChevronRight } from 'lucide-react'

const RESULT_COLORS = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
const COMPETITIONS = ['Premier League', 'FA Cup', 'Carabao Cup', 'Europa League', 'Champions League', 'Friendly']

export default function FootballWidget() {
  const { lastMatch, season, form, addResult, nextMatch, setNextMatch } = useFootball()
  const [showAdd, setShowAdd] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [res, setRes] = useState({ opponent: '', homeAway: 'home', goalsFor: '', goalsAgainst: '', competition: 'Premier League', date: new Date().toISOString().split('T')[0] })
  const [nextForm, setNextForm] = useState({ ...nextMatch })

  const s = season()
  const f = form()

  const handleAddResult = (e) => {
    e.preventDefault()
    if (!res.opponent || res.goalsFor === '' || res.goalsAgainst === '') return
    addResult(res)
    setRes({ opponent: '', homeAway: 'home', goalsFor: '', goalsAgainst: '', competition: 'Premier League', date: new Date().toISOString().split('T')[0] })
    setShowAdd(false)
  }

  const saveNext = () => {
    setNextMatch(nextForm)
    setShowNext(false)
  }

  const nextMatchDate = nextMatch.date ? new Date(nextMatch.date) : null
  const daysUntil = nextMatchDate ? Math.ceil((nextMatchDate - new Date()) / 86400000) : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <div>
            <div className="text-sm font-medium">Tottenham Hotspur</div>
            {s.played > 0 && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {s.W}V {s.D}J {s.L}T · {s.pts} stig
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          {showAdd ? <X size={13} /> : <Plus size={13} />}
        </button>
      </div>

      {/* Add result form */}
      {showAdd && (
        <form onSubmit={handleAddResult} className="flex flex-col gap-2 mb-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRes(r => ({ ...r, homeAway: 'home' }))}
              className="flex-1 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: res.homeAway === 'home' ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: res.homeAway === 'home' ? 'var(--accent)' : 'var(--muted)',
              }}>Heimaleikur</button>
            <button type="button" onClick={() => setRes(r => ({ ...r, homeAway: 'away' }))}
              className="flex-1 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: res.homeAway === 'away' ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: res.homeAway === 'away' ? 'var(--accent)' : 'var(--muted)',
              }}>Útileikur</button>
          </div>
          <input className="input text-sm" placeholder="Andstæðingur" value={res.opponent}
            onChange={e => setRes(r => ({ ...r, opponent: e.target.value }))} autoFocus />
          <div className="flex gap-2 items-center">
            <input className="input text-center text-sm" type="number" min="0" placeholder="Spurs"
              value={res.goalsFor} onChange={e => setRes(r => ({ ...r, goalsFor: e.target.value }))} />
            <span style={{ color: 'var(--muted)' }}>-</span>
            <input className="input text-center text-sm" type="number" min="0" placeholder="Þeir"
              value={res.goalsAgainst} onChange={e => setRes(r => ({ ...r, goalsAgainst: e.target.value }))} />
          </div>
          <select className="input text-sm" value={res.competition}
            onChange={e => setRes(r => ({ ...r, competition: e.target.value }))}>
            {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" className="input text-sm" value={res.date}
            onChange={e => setRes(r => ({ ...r, date: e.target.value }))} />
          <button type="submit" className="btn btn-primary text-xs py-1.5 justify-center">Vista niðurstöðu</button>
        </form>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Last result */}
        {lastMatch ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: `${RESULT_COLORS[lastMatch.result]}22`, color: RESULT_COLORS[lastMatch.result] }}>
              {lastMatch.result}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">
                {lastMatch.homeAway === 'home' ? 'Spurs' : lastMatch.opponent} {lastMatch.goalsFor}–{lastMatch.goalsAgainst} {lastMatch.homeAway === 'home' ? lastMatch.opponent : 'Spurs'}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{lastMatch.competition}</div>
            </div>
          </div>
        ) : (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Engar niðurstöður</div>
        )}

        {/* Form */}
        {f.length > 0 && (
          <div className="flex gap-1 shrink-0">
            {f.map((r, i) => (
              <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${RESULT_COLORS[r]}22`, color: RESULT_COLORS[r] }}>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next match */}
      {nextMatch.opponent ? (
        <button onClick={() => setShowNext(!showNext)}
          className="mt-3 pt-3 w-full text-left flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Næsti leikur: <span style={{ color: 'var(--text)' }}>{nextMatch.opponent}</span>
            {daysUntil !== null && daysUntil >= 0 && (
              <span style={{ color: 'var(--accent)' }}> · {daysUntil === 0 ? 'Í dag' : `${daysUntil}d`}</span>
            )}
          </div>
          <ChevronRight size={12} style={{ color: 'var(--muted)' }} />
        </button>
      ) : (
        <button onClick={() => setShowNext(!showNext)}
          className="mt-3 pt-3 w-full text-left text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
          + Setja inn næsta leik
        </button>
      )}

      {showNext && (
        <div className="flex flex-col gap-2 mt-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <input className="input text-sm" placeholder="Andstæðingur" value={nextForm.opponent}
            onChange={e => setNextForm(f => ({ ...f, opponent: e.target.value }))} />
          <input type="date" className="input text-sm" value={nextForm.date}
            onChange={e => setNextForm(f => ({ ...f, date: e.target.value }))} />
          <select className="input text-sm" value={nextForm.competition}
            onChange={e => setNextForm(f => ({ ...f, competition: e.target.value }))}>
            {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={saveNext} className="btn btn-primary text-xs flex-1 justify-center">Vista</button>
            <button onClick={() => setShowNext(false)} className="btn btn-ghost text-xs"><X size={13} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
