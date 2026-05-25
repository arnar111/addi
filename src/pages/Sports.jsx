import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { RefreshCw, Plus, Trash2, Edit2, Check } from 'lucide-react'

function GameCard({ game }) {
  const isFinal = game.status.includes('FINAL')
  const isLive = game.status.includes('IN_PROGRESS') || game.status === 'STATUS_HALFTIME'
  const isUpcoming = !isFinal && !isLive

  return (
    <div className="card-sm flex items-stretch gap-4"
         style={{ border: isLive ? '1px solid rgba(239,68,68,0.25)' : '1px solid var(--border)' }}>
      {/* Home */}
      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
        {game.home.logo ? (
          <img src={game.home.logo} alt={game.home.name} className="w-10 h-10 object-contain"
               onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
               style={{ background: 'var(--surface2)' }}>⚽</div>
        )}
        <span className="text-xs font-medium text-center leading-tight truncate w-full text-center"
              style={{ fontWeight: game.home.winner ? 700 : 500 }}>
          {game.home.name}
        </span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        {isFinal || isLive ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{game.home.score}</span>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-2xl font-bold">{game.away.score}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              {new Date(game.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-base font-bold">
              {new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        {isLive && (
          <span className="text-xs font-bold animate-pulse px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
            {game.statusText}
          </span>
        )}
        {isFinal && (
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            Lokið
          </span>
        )}
      </div>

      {/* Away */}
      <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
        {game.away.logo ? (
          <img src={game.away.logo} alt={game.away.name} className="w-10 h-10 object-contain"
               onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
               style={{ background: 'var(--surface2)' }}>⚽</div>
        )}
        <span className="text-xs font-medium text-center leading-tight truncate w-full text-center"
              style={{ fontWeight: game.away.winner ? 700 : 500 }}>
          {game.away.name}
        </span>
      </div>
    </div>
  )
}

function FootballTab() {
  const { inter, loading, error } = useSports()

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2].map(i => (
        <div key={i} className="card-sm animate-pulse-soft" style={{ height: 96 }} />
      ))}
    </div>
  )

  if (error) return (
    <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
      Gat ekki sótt leikjagögn
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img src="https://a.espncdn.com/i/teamlogos/soccer/500/110.png" alt="Inter"
             className="w-8 h-8 object-contain"
             onError={e => { e.target.style.display = 'none' }} />
        <div>
          <div className="font-semibold text-sm">Inter Milan</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Serie A · UEFA Champions League</div>
        </div>
        <span className="badge ml-auto"
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', fontSize: 10 }}>
          ❤️ Uppáhalds
        </span>
      </div>

      {inter.length > 0 ? (
        <div className="flex flex-col gap-2">
          {inter.map(g => <GameCard key={g.id} game={g} />)}
        </div>
      ) : (
        <div className="card text-center py-10">
          <div className="text-3xl mb-2">⚽</div>
          <div className="text-sm font-medium">Engir leikir á dagskrá</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Serie A tímabilið kann að vera á pásum eða lokið
          </div>
        </div>
      )}
    </div>
  )
}

function NBATab() {
  const { nba, loading, error } = useSports()

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="card-sm animate-pulse-soft" style={{ height: 96 }} />
      ))}
    </div>
  )

  if (error) return (
    <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
      Gat ekki sótt leikjagögn
    </div>
  )

  return (
    <div className="flex flex-col gap-2">
      {nba.length > 0 ? (
        nba.map(g => <GameCard key={g.id} game={g} />)
      ) : (
        <div className="card text-center py-10">
          <div className="text-3xl mb-2">🏀</div>
          <div className="text-sm font-medium">Engir NBA leikir í dag</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Athugaðu aftur seinna eða á leikdegi
          </div>
        </div>
      )}
    </div>
  )
}

function ThraukarinnTab() {
  const [entries, setEntries] = useLocalStorage('addi_thraukari', [
    { id: '1', name: 'Addi', points: 0 },
  ])
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  const sorted = [...entries].sort((a, b) => b.points - a.points)

  const addEntry = () => {
    if (!newName.trim()) return
    setEntries(prev => [...prev, { id: Date.now().toString(), name: newName.trim(), points: 0 }])
    setNewName('')
  }

  const updatePoints = (id, delta) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, points: Math.max(0, e.points + delta) } : e))
  }

  const setPointsManual = (id, val) => {
    const n = parseInt(val) || 0
    setEntries(prev => prev.map(e => e.id === id ? { ...e, points: Math.max(0, n) } : e))
  }

  const removeEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const MEDAL = ['🥇', '🥈', '🥉']

  return (
    <div className="flex flex-col gap-3">
      <div className="card">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-semibold text-sm">🏝️ Þraukarinn</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Survivor fantasy leikurinn þinn</p>
          </div>
          <button onClick={() => setEditing(!editing)}
                  className="btn btn-ghost text-xs" style={{ padding: '6px 12px' }}>
            {editing ? 'Loka' : 'Breyta'}
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          {sorted.map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                 style={{
                   background: i === 0 ? 'rgba(0,212,170,0.08)' : 'var(--surface2)',
                   border: i === 0 ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                 }}>
              <span className="text-lg w-7 text-center shrink-0">
                {MEDAL[i] || `${i + 1}.`}
              </span>
              <span className="flex-1 text-sm font-medium">{e.name}</span>
              {editing ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => updatePoints(e.id, -5)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                          style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>−</button>
                  <input type="number" value={e.points}
                         onChange={ev => setPointsManual(e.id, ev.target.value)}
                         className="input text-sm text-center font-bold"
                         style={{ width: 60, padding: '4px 8px' }} />
                  <button onClick={() => updatePoints(e.id, 5)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                          style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>+</button>
                  <button onClick={() => removeEntry(e.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : (
                <span className="font-bold text-sm shrink-0" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text)' }}>
                  {e.points} stig
                </span>
              )}
            </div>
          ))}

          {entries.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>
              Engir þátttakendur ennþá
            </p>
          )}
        </div>

        {editing && (
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <input className="input text-sm flex-1" placeholder="Nafn þátttakanda"
                   value={newName} onChange={e => setNewName(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && addEntry()} />
            <button onClick={addEntry} className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.12)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          💡 Notaðu "Breyta" til að uppfæra stig þátttakenda. Smelltu á + eða − til að breyta um 5 stig í einu.
        </p>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'football', label: '⚽ Fótbolti' },
  { id: 'nba', label: '🏀 NBA' },
  { id: 'thraukari', label: '🏝️ Þraukarinn' },
]

export default function Sports() {
  const [tab, setTab] = useState('football')
  const { loading, refresh } = useSports()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leikjanir & niðurstöður</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn flex-1 text-sm justify-center"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'football' && <FootballTab />}
      {tab === 'nba' && <NBATab />}
      {tab === 'thraukari' && <ThraukarinnTab />}
    </div>
  )
}
