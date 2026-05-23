import { useState } from 'react'
import { useThraukarinn } from '../hooks/useThraukarinn'
import { Trophy, Flame, X, Plus, Trash2, Edit2, Check } from 'lucide-react'

const STATUS_MAP = {
  active: { label: 'Í leiknum', color: '#22c55e', emoji: '🔥' },
  voted_out: { label: 'Úr', color: '#ef4444', emoji: '💀' },
  reserve: { label: 'Varamaður', color: '#64748b', emoji: '🔄' },
  winner: { label: 'Sigurvegari', color: '#f59e0b', emoji: '👑' },
}

function PlayerCard({ player, onUpdatePoints, onUpdateStatus }) {
  const [editing, setEditing] = useState(false)
  const [pts, setPts] = useState(String(player.points))
  const s = STATUS_MAP[player.status] || STATUS_MAP.active

  const save = () => {
    onUpdatePoints(player.id, pts)
    setEditing(false)
  }

  return (
    <div
      className="card flex items-center gap-3 py-3 transition-all"
      style={{
        opacity: player.status === 'voted_out' ? 0.55 : 1,
        borderColor: player.status === 'active' ? 'var(--border)' :
          player.status === 'winner' ? '#f59e0b44' : 'var(--border)',
      }}>
      <div className="text-xl w-8 text-center shrink-0">{s.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm flex items-center gap-1.5">
          {player.name}
          {player.status === 'voted_out' && (
            <span className="text-xs line-through" style={{ color: 'var(--muted)' }}> </span>
          )}
        </div>
        <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: s.color }}>
          <span>{s.label}</span>
        </div>
      </div>

      {/* Points */}
      <div className="flex items-center gap-1.5">
        {editing ? (
          <>
            <input
              className="input text-center font-bold"
              style={{ width: 60, padding: '4px 8px', fontSize: 14 }}
              type="number"
              value={pts}
              onChange={e => setPts(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && save()}
            />
            <button onClick={save} style={{ color: 'var(--accent)' }}><Check size={14} /></button>
          </>
        ) : (
          <button onClick={() => { setPts(String(player.points)); setEditing(true) }}
            className="flex flex-col items-center min-w-[40px]">
            <span className="font-bold text-lg" style={{ color: player.points > 0 ? 'var(--accent)' : 'var(--muted)' }}>
              {player.points}
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>stig</span>
          </button>
        )}
      </div>

      <select
        value={player.status}
        onChange={e => onUpdateStatus(player.id, e.target.value)}
        className="text-xs rounded-lg px-2 py-1 cursor-pointer shrink-0"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
        {Object.entries(STATUS_MAP).map(([v, { label }]) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
    </div>
  )
}

export default function Thraukarinn() {
  const {
    teamName, setTeamName,
    players, setPlayers,
    councils,
    season, rank, setRank,
    updatePoints, updateStatus,
    addCouncil, removeCouncil,
    totalPoints, active, votedOut,
  } = useThraukarinn()

  const [showCouncilForm, setShowCouncilForm] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [tab, setTab] = useState('players')
  const [editName, setEditName] = useState(false)
  const [nameInput, setNameInput] = useState(teamName)

  const [council, setCouncil] = useState({ episode: '', votedOut: '', notes: '' })
  const [newPlayer, setNewPlayer] = useState({ name: '', status: 'active', points: 0 })

  const handleAddCouncil = (e) => {
    e.preventDefault()
    if (!council.episode) return
    addCouncil(council)
    setCouncil({ episode: '', votedOut: '', notes: '' })
    setShowCouncilForm(false)
  }

  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (!newPlayer.name) return
    setPlayers(prev => [...prev, { ...newPlayer, id: Date.now().toString(), points: Number(newPlayer.points) }])
    setNewPlayer({ name: '', status: 'active', points: 0 })
    setShowAddPlayer(false)
  }

  const pts = totalPoints()
  const activeCnt = active().length
  const outCnt = votedOut().length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏝️</span>
            <h1 className="text-xl font-semibold">Þraukarinn</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>S{season}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 ml-9">
            {editName ? (
              <div className="flex gap-2 items-center">
                <input
                  className="input text-sm"
                  style={{ width: 120, padding: '2px 8px' }}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') { setTeamName(nameInput); setEditName(false) }
                  }}
                />
                <button onClick={() => { setTeamName(nameInput); setEditName(false) }}
                  style={{ color: 'var(--accent)', fontSize: 12 }}>Vista</button>
              </div>
            ) : (
              <button onClick={() => { setNameInput(teamName); setEditName(true) }}
                className="text-sm flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                Lið: <strong style={{ color: 'var(--text)' }}>{teamName}</strong>
                <Edit2 size={11} />
              </button>
            )}
          </div>
        </div>

        {tab === 'players' && (
          <button onClick={() => setShowAddPlayer(!showAddPlayer)} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>
            <Plus size={14} /> Leikmaður
          </button>
        )}
        {tab === 'tribal' && (
          <button onClick={() => setShowCouncilForm(!showCouncilForm)} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 12px' }}>
            <Plus size={14} /> Þing
          </button>
        )}
      </div>

      {/* Score card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(0,212,170,0.06))' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarstig liðsins</div>
            <div className="text-3xl font-bold flex items-end gap-2">
              {pts}
              <span className="text-base font-normal" style={{ color: 'var(--muted)' }}>stig</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Sæti</div>
            <div className="flex items-center gap-1">
              <Trophy size={16} style={{ color: '#f59e0b' }} />
              {rank ? (
                <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>#{rank}</span>
              ) : (
                <input
                  className="input text-center font-bold"
                  style={{ width: 60, padding: '2px 8px', fontSize: 16 }}
                  type="number"
                  placeholder="?"
                  value={rank || ''}
                  onChange={e => setRank(e.target.value ? Number(e.target.value) : null)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: '#22c55e' }}>{activeCnt}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Í leiknum</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: '#ef4444' }}>{outCnt}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Úr</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{councils.length}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Þing</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['players', 'Leikmenn'], ['tribal', 'Þingfundir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(139,92,246,0.15)' : 'var(--surface)',
              color: tab === t ? '#a78bfa' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(139,92,246,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'players' && (
        <div className="flex flex-col gap-2">
          {showAddPlayer && (
            <form onSubmit={handleAddPlayer} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Nýr leikmaður</h3>
                <button type="button" onClick={() => setShowAddPlayer(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <input className="input" placeholder="Nafn *" value={newPlayer.name}
                onChange={e => setNewPlayer(p => ({ ...p, name: e.target.value }))} autoFocus />
              <div className="flex gap-2">
                <select className="input flex-1" value={newPlayer.status}
                  onChange={e => setNewPlayer(p => ({ ...p, status: e.target.value }))}>
                  {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </select>
                <input className="input text-center" type="number" placeholder="Stig" style={{ width: 80 }}
                  value={newPlayer.points}
                  onChange={e => setNewPlayer(p => ({ ...p, points: Number(e.target.value) }))} />
              </div>
              <button type="submit" className="btn w-full justify-center"
                style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                <Plus size={16} /> Bæta við
              </button>
            </form>
          )}

          {/* Active players first */}
          {players
            .slice()
            .sort((a, b) => {
              const order = { winner: 0, active: 1, reserve: 2, voted_out: 3 }
              return (order[a.status] ?? 4) - (order[b.status] ?? 4) || b.points - a.points
            })
            .map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                onUpdatePoints={updatePoints}
                onUpdateStatus={updateStatus}
              />
            ))}
        </div>
      )}

      {tab === 'tribal' && (
        <div className="flex flex-col gap-2">
          {showCouncilForm && (
            <form onSubmit={handleAddCouncil} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Þingfundur</h3>
                <button type="button" onClick={() => setShowCouncilForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <input className="input" type="number" placeholder="Þáttur nr. *"
                value={council.episode} onChange={e => setCouncil(c => ({ ...c, episode: e.target.value }))} autoFocus />
              <input className="input" placeholder="Hverjum var vísað út?"
                value={council.votedOut} onChange={e => setCouncil(c => ({ ...c, votedOut: e.target.value }))} />
              <input className="input" placeholder="Athugasemdir"
                value={council.notes} onChange={e => setCouncil(c => ({ ...c, notes: e.target.value }))} />
              <button type="submit" className="btn w-full justify-center"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
                Skrá þingfund
              </button>
            </form>
          )}

          {councils.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-medium mb-1">Engir þingfundar ennþá</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Bættu við þegar einhverjum er vísað út</div>
            </div>
          ) : councils.map(c => (
            <div key={c.id} className="card flex items-start gap-3 py-3">
              <div className="text-xl shrink-0">🔥</div>
              <div className="flex-1">
                <div className="font-medium text-sm">Þáttur {c.episode}</div>
                {c.votedOut && (
                  <div className="text-sm mt-0.5" style={{ color: '#ef4444' }}>
                    💀 {c.votedOut} vísað út
                  </div>
                )}
                {c.notes && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{c.notes}</div>}
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {new Date(c.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeCouncil(c.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
