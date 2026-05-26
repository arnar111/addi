import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { Plus, Trash2, X } from 'lucide-react'

const FORM_COLOR = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
const FORM_BG = { W: 'rgba(34,197,94,0.15)', D: 'rgba(249,115,22,0.15)', L: 'rgba(239,68,68,0.15)' }
const RESULT_LABEL = { W: 'Sigur', D: 'Jafntefli', L: 'Tap' }

function FormBadge({ r }) {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: FORM_BG[r], color: FORM_COLOR[r] }}>{r}</span>
  )
}

export default function Sports() {
  const {
    results, standings,
    fixtures, addResult, removeResult, addFixture, removeFixture,
    recentForm, seasonStats, arsenalStanding,
  } = useSports()

  const [tab, setTab] = useState('overview')
  const [showResultForm, setShowResultForm] = useState(false)
  const [opponent, setOpponent] = useState('')
  const [homeAway, setHomeAway] = useState('H')
  const [goalsFor, setGoalsFor] = useState('')
  const [goalsAgainst, setGoalsAgainst] = useState('')
  const [competition, setCompetition] = useState('PL')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const [showFixtureForm, setShowFixtureForm] = useState(false)
  const [fxOpponent, setFxOpponent] = useState('')
  const [fxHomeAway, setFxHomeAway] = useState('H')
  const [fxDate, setFxDate] = useState('')
  const [fxComp, setFxComp] = useState('PL')

  const handleAddResult = (e) => {
    e.preventDefault()
    if (!opponent || goalsFor === '' || goalsAgainst === '') return
    addResult(opponent, homeAway, goalsFor, goalsAgainst, competition, date)
    setOpponent(''); setGoalsFor(''); setGoalsAgainst(''); setShowResultForm(false)
  }

  const handleAddFixture = (e) => {
    e.preventDefault()
    if (!fxOpponent || !fxDate) return
    addFixture(fxOpponent, fxHomeAway, fxDate, fxComp)
    setFxOpponent(''); setFxDate(''); setShowFixtureForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">⚽ Arsenal</h1>
            {arsenalStanding && arsenalStanding.pos === 1 && (
              <span className="text-sm px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>🏆 #1</span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025–26</p>
        </div>
        <button onClick={() => setShowResultForm(!showResultForm)} className="btn btn-primary">
          <Plus size={16} /> Niðurstaða
        </button>
      </div>

      {/* Arsenal season card */}
      {arsenalStanding && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(239,68,68,0.03))' }}>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              ['Stig', arsenalStanding.pts],
              ['Leikir', arsenalStanding.played],
              ['Sigrar', arsenalStanding.won],
              ['+/−', arsenalStanding.gd > 0 ? `+${arsenalStanding.gd}` : arsenalStanding.gd],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold" style={{ color: label === 'Stig' ? 'var(--accent)' : 'var(--text)' }}>
                  {val}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Form</span>
            <div className="flex gap-1.5">
              {recentForm.map((r, i) => <FormBadge key={i} r={r} />)}
              {recentForm.length === 0 && <span className="text-xs" style={{ color: 'var(--muted)' }}>—</span>}
            </div>
          </div>
        </div>
      )}

      {/* Add result form */}
      {showResultForm && (
        <form onSubmit={handleAddResult} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við niðurstöðu</h3>
            <button type="button" onClick={() => setShowResultForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Andstæðingur (t.d. Liverpool)" value={opponent}
            onChange={e => setOpponent(e.target.value)} autoFocus />
          <div className="flex gap-2">
            {[['H', 'Heimavöllur'], ['A', 'Gestir']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setHomeAway(v)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: homeAway === v ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: homeAway === v ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${homeAway === v ? 'var(--accent)' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Arsenal</label>
              <input className="input text-center text-lg font-bold" type="number" min="0" value={goalsFor}
                onChange={e => setGoalsFor(e.target.value)} placeholder="0" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--muted)' }}>–</span>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{opponent || 'Andstæðingur'}</label>
              <input className="input text-center text-lg font-bold" type="number" min="0" value={goalsAgainst}
                onChange={e => setGoalsAgainst(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="input text-sm flex-1" value={competition}
              onChange={e => setCompetition(e.target.value)}>
              <option value="PL">Premier League</option>
              <option value="CL">Champions League</option>
              <option value="FA">FA Cup</option>
              <option value="EFL">EFL Cup</option>
            </select>
            <input type="date" className="input text-sm flex-1" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Vista niðurstöðu</button>
        </form>
      )}

      {/* Fixture form */}
      {showFixtureForm && (
        <form onSubmit={handleAddFixture} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við leik</h3>
            <button type="button" onClick={() => setShowFixtureForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Andstæðingur" value={fxOpponent}
            onChange={e => setFxOpponent(e.target.value)} autoFocus />
          <div className="flex gap-2">
            {[['H', 'Heimavöllur'], ['A', 'Gestir']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setFxHomeAway(v)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: fxHomeAway === v ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: fxHomeAway === v ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${fxHomeAway === v ? 'var(--accent)' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <input type="date" className="input" value={fxDate} onChange={e => setFxDate(e.target.value)} />
          <select className="input text-sm" value={fxComp} onChange={e => setFxComp(e.target.value)}>
            <option value="PL">Premier League</option>
            <option value="CL">Champions League</option>
            <option value="FA">FA Cup</option>
            <option value="EFL">EFL Cup</option>
          </select>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['standings', 'Töfla'], ['fixtures', 'Leikir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-2"
            style={{
              background: tab === t ? 'rgba(239,68,68,0.12)' : 'var(--surface)',
              color: tab === t ? '#ef4444' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-2">
          {results.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">⚽</div>
              <div>Engar niðurstöður ennþá</div>
            </div>
          ) : results.map(r => (
            <div key={r.id} className="card flex items-center gap-3 py-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: FORM_BG[r.result], color: FORM_COLOR[r.result] }}>{r.result}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {r.homeAway === 'H'
                    ? `Arsenal ${r.goalsFor}–${r.goalsAgainst} ${r.opponent}`
                    : `${r.opponent} ${r.goalsAgainst}–${r.goalsFor} Arsenal`
                  }
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {r.competition} · {r.homeAway === 'H' ? 'Heimavöllur' : 'Gestir'} · {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeResult(r.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'standings' && (
        <div className="card overflow-hidden p-0">
          <div className="grid text-xs font-medium px-4 py-2.5"
               style={{ gridTemplateColumns: '28px 1fr 32px 32px 32px 36px', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <span>#</span><span>Lið</span><span className="text-center">L</span>
            <span className="text-center">S</span><span className="text-center">+/-</span>
            <span className="text-right">Stig</span>
          </div>
          {standings.map((s, idx) => {
            const isArsenal = s.team === 'Arsenal'
            return (
              <div key={s.team}
                className="grid items-center px-4 py-2.5 text-sm"
                style={{
                  gridTemplateColumns: '28px 1fr 32px 32px 32px 36px',
                  background: isArsenal ? 'rgba(239,68,68,0.06)' : 'transparent',
                  borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                }}>
                <span className="text-xs font-bold" style={{ color: s.pos <= 4 ? 'var(--accent)' : 'var(--muted)' }}>
                  {s.pos}
                </span>
                <span className={`font-${isArsenal ? 'bold' : 'medium'} truncate`}
                      style={{ color: isArsenal ? '#ef4444' : 'var(--text)' }}>
                  {isArsenal ? '⚡ ' : ''}{s.team}
                </span>
                <span className="text-center text-xs" style={{ color: 'var(--muted)' }}>{s.played}</span>
                <span className="text-center text-xs" style={{ color: 'var(--muted)' }}>{s.won}</span>
                <span className="text-center text-xs" style={{ color: s.gd > 0 ? 'var(--success)' : s.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </span>
                <span className="text-right font-bold" style={{ color: isArsenal ? 'var(--accent)' : 'var(--text)' }}>
                  {s.pts}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'fixtures' && (
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowFixtureForm(!showFixtureForm)}
            className="btn btn-ghost w-full justify-center text-sm">
            <Plus size={14} /> Bæta við leik
          </button>
          {fixtures.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">📅</div>
              <div>Engir leikir skráðir</div>
            </div>
          ) : fixtures.map(f => (
            <div key={f.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xl"
                   style={{ background: 'rgba(239,68,68,0.1)' }}>⚽</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {f.homeAway === 'H' ? `Arsenal vs ${f.opponent}` : `${f.opponent} vs Arsenal`}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                  {new Date(f.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'long', day: 'numeric' })}
                  {' · '}{f.competition}
                </div>
              </div>
              <button onClick={() => removeFixture(f.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
