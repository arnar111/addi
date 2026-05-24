import { useState } from 'react'
import { useThraukarinn } from '../hooks/useThraukarinn'
import { Plus, X, Skull, RefreshCw, ChevronDown, ChevronUp, Edit2, Check } from 'lucide-react'

const WEIGHT_LABELS = ['150%', '120%', '110%', '100%', '100%', '90% (vara)']

function StandingsTable({ standings }) {
  if (!standings.length) return (
    <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
      <div className="text-3xl mb-2">🏝️</div>
      Engir þátttakendur ennþá. Bættu við til að byrja.
    </div>
  )

  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Stigatafla</h3>
      <div className="flex flex-col gap-1">
        {standings.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 py-2 px-2 rounded-xl"
               style={{ background: i === 0 ? 'rgba(251,191,36,0.08)' : i < 3 ? 'rgba(0,212,170,0.04)' : 'transparent' }}>
            <div className="w-6 text-center text-sm font-bold shrink-0"
                 style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#92400e' : 'var(--muted)' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              {p.teamName && <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.teamName}</div>}
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold" style={{ color: i === 0 ? '#fbbf24' : 'var(--text)' }}>
                {p.score.toFixed(1)}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>stig</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddPlayerForm({ cast, onAdd, onClose }) {
  const [name, setName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [team, setTeam] = useState(['', '', '', '', ''])
  const [backup, setBackup] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), teamName: teamName.trim(), team: team.filter(Boolean), backup })
    onClose()
  }

  const available = cast.filter(c => !team.includes(c) && c !== backup)

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Bæta við þátttakanda</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>
      <input className="input" placeholder="Nafn þátttakanda" value={name} onChange={e => setName(e.target.value)} autoFocus />
      <input className="input" placeholder="Heiti liðs (valkvæmt)" value={teamName} onChange={e => setTeamName(e.target.value)} />
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Lið (5 þraukarar)</div>
        {team.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs shrink-0 w-16" style={{ color: 'var(--muted)' }}>{WEIGHT_LABELS[i]}</span>
            <select className="input text-sm" value={t} onChange={e => setTeam(prev => prev.map((v, j) => j === i ? e.target.value : v))}>
              <option value="">Veldu þraukara</option>
              {cast.map(c => <option key={c} value={c} disabled={team.includes(c) && t !== c || backup === c}>{c}</option>)}
            </select>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-xs shrink-0 w-16" style={{ color: 'var(--muted)' }}>{WEIGHT_LABELS[5]}</span>
          <select className="input text-sm" value={backup} onChange={e => setBackup(e.target.value)}>
            <option value="">Varaþraukari</option>
            {cast.map(c => <option key={c} value={c} disabled={team.includes(c)}>{c}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
    </form>
  )
}

function CastManager({ cast, eliminated, activeCast, onEliminate, onRevive, onAdd, onRemove }) {
  const [show, setShow] = useState(false)
  const [newName, setNewName] = useState('')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3" onClick={() => setShow(v => !v)} style={{ cursor: 'pointer' }}>
        <h3 className="font-semibold text-sm">Þraukarar ({activeCast.length} eftir af {cast.length})</h3>
        {show ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
      </div>

      {show && (
        <div className="flex flex-col gap-2 animate-slide-up">
          <div className="flex gap-2">
            <input className="input text-sm flex-1" placeholder="Bæta við þraukara" value={newName} onChange={e => setNewName(e.target.value)}
                   onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) { onAdd(newName.trim()); setNewName('') } }} />
            <button className="btn btn-primary px-3" onClick={() => { if (newName.trim()) { onAdd(newName.trim()); setNewName('') } }}>
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {cast.map(c => {
              const isOut = eliminated.includes(c)
              return (
                <div key={c} className="flex items-center gap-2 py-1.5 px-2 rounded-xl"
                     style={{ background: isOut ? 'rgba(239,68,68,0.06)' : 'var(--surface2)' }}>
                  <span className="flex-1 text-sm" style={{ color: isOut ? 'var(--muted)' : 'var(--text)', textDecoration: isOut ? 'line-through' : 'none' }}>
                    {isOut ? '💀 ' : '🏆 '}{c}
                  </span>
                  {isOut ? (
                    <button className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }} onClick={() => onRevive(c)}>Endurkominn</button>
                  ) : (
                    <button className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} onClick={() => onEliminate(c)}>Úr leik</button>
                  )}
                  <button onClick={() => onRemove(c)}><X size={12} style={{ color: 'var(--muted)' }} /></button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function PointsEditor({ cast, weeklyPoints, onSet }) {
  const [show, setShow] = useState(false)
  const [edits, setEdits] = useState({})

  const save = () => {
    Object.entries(edits).forEach(([name, pts]) => onSet(name, Number(pts)))
    setEdits({})
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1" onClick={() => setShow(v => !v)} style={{ cursor: 'pointer' }}>
        <h3 className="font-semibold text-sm">Uppfæra stig</h3>
        {show ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>Heildarstig hvers þraukara (borin saman við þátttakendur)</p>

      {show && (
        <div className="flex flex-col gap-2 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {cast.map(c => (
              <div key={c} className="flex items-center gap-2">
                <span className="text-xs flex-1 truncate" style={{ color: 'var(--muted)' }}>{c}</span>
                <input
                  type="number"
                  className="input text-xs py-1 px-2 w-16 text-right"
                  value={edits[c] !== undefined ? edits[c] : (weeklyPoints[c] || '')}
                  onChange={e => setEdits(prev => ({ ...prev, [c]: e.target.value }))}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          {Object.keys(edits).length > 0 && (
            <button className="btn btn-primary w-full justify-center" onClick={save}>
              <Check size={14} /> Vista stig
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Thraukarinn() {
  const {
    season, setSeason,
    cast, activeCast, eliminated,
    players, standings,
    weeklyPoints,
    eliminate, revive,
    addPlayer, removePlayer,
    setPoints,
    addCastMember, removeCastMember,
  } = useThraukarinn()

  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [tab, setTab] = useState('standings')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">🏝️ Þraukarinn</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {season.name} · {activeCast.length} þraukarar eftir · {players.length} þátttakendur
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddPlayer(v => !v)}>
          <Plus size={16} /> Þátttakandi
        </button>
      </div>

      {showAddPlayer && (
        <AddPlayerForm cast={cast} onAdd={addPlayer} onClose={() => setShowAddPlayer(false)} />
      )}

      <div className="flex gap-2">
        {[['standings', '🏆 Stigatafla'], ['cast', '💀 Þraukarar'], ['points', '📊 Stig']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '6px 8px',
            }}>{l}</button>
        ))}
      </div>

      {tab === 'standings' && <StandingsTable standings={standings} />}

      {tab === 'cast' && (
        <CastManager
          cast={cast}
          eliminated={eliminated}
          activeCast={activeCast}
          onEliminate={eliminate}
          onRevive={revive}
          onAdd={addCastMember}
          onRemove={removeCastMember}
        />
      )}

      {tab === 'points' && (
        <PointsEditor cast={cast} weeklyPoints={weeklyPoints} onSet={setPoints} />
      )}

      {tab === 'standings' && players.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-sm mb-3">Lið þátttakenda</h3>
          <div className="flex flex-col gap-3">
            {standings.map((p, rank) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{rank + 1}. {p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.score.toFixed(1)} stig</span>
                    <button onClick={() => removePlayer(p.id)}><X size={12} style={{ color: 'var(--muted)' }} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(p.team || []).map((s, i) => {
                    const isOut = eliminated.includes(s)
                    return (
                      <span key={i} className="badge text-xs"
                            style={{
                              background: isOut ? 'rgba(239,68,68,0.1)' : 'rgba(0,212,170,0.1)',
                              color: isOut ? 'var(--muted)' : 'var(--accent)',
                              textDecoration: isOut ? 'line-through' : 'none',
                            }}>
                        {WEIGHT_LABELS[i].replace(' (vara)', '')} {s}
                      </span>
                    )
                  })}
                  {p.backup && (
                    <span className="badge text-xs" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent2)' }}>
                      Vara: {p.backup}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tímabil</span>
          <input
            className="input text-sm w-36 text-right py-1.5"
            value={season.name}
            onChange={e => setSeason(s => ({ ...s, name: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )
}
