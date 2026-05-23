import { useState } from 'react'
import { useSports, getResultForTeam } from '../hooks/useSports'
import { Search, Plus, X, Trophy, Clock, Loader2 } from 'lucide-react'

const RESULT_COLOR = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
const RESULT_BG = { W: 'rgba(34,197,94,0.15)', D: 'rgba(249,115,22,0.15)', L: 'rgba(239,68,68,0.15)' }

function FormPill({ result }) {
  if (!result) return null
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: RESULT_BG[result], color: RESULT_COLOR[result] }}>
      {result}
    </span>
  )
}

function formatMatchDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr)
  const now = new Date()
  const diff = Math.round((d - now) / 86400000)
  if (diff === 0) return 'Í dag'
  if (diff === 1) return 'Á morgun'
  if (diff === -1) return 'Í gær'
  if (diff > 0 && diff < 7) return d.toLocaleDateString('is-IS', { weekday: 'long' })
  return d.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
}

function TeamCard({ team, ev, onRemove }) {
  const last = ev?.last || []
  const next = ev?.next || []
  const form = last.map(e => getResultForTeam(e, team.name))

  const lastMatch = last[last.length - 1]
  const nextMatch = next[0]

  return (
    <div className="card flex flex-col gap-3">
      {/* Team header */}
      <div className="flex items-center gap-3">
        {team.badge ? (
          <img src={team.badge} alt={team.name} className="w-10 h-10 object-contain" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
               style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
            {team.shortName || team.name.slice(0, 3).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{team.name}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{team.league}</div>
        </div>
        <button onClick={() => onRemove(team.id)} className="p-1 rounded-lg"
                style={{ color: 'var(--muted)' }}>
          <X size={15} />
        </button>
      </div>

      {/* Form */}
      {form.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Mynstur:</span>
          <div className="flex gap-1">
            {form.map((r, i) => <FormPill key={i} result={r} />)}
          </div>
        </div>
      )}

      {/* Last result */}
      {lastMatch && (
        <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
          <div className="flex items-center justify-between">
            <div className="text-sm">{lastMatch.strHomeTeam}</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tabular-nums">
                {lastMatch.intHomeScore ?? '?'} – {lastMatch.intAwayScore ?? '?'}
              </span>
              {getResultForTeam(lastMatch, team.name) && (
                <FormPill result={getResultForTeam(lastMatch, team.name)} />
              )}
            </div>
            <div className="text-sm text-right">{lastMatch.strAwayTeam}</div>
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            {lastMatch.strLeague} · {formatMatchDate(lastMatch.dateEvent)}
          </div>
        </div>
      )}

      {/* Next match */}
      {nextMatch && (
        <div className="flex flex-col gap-1 p-3 rounded-xl"
             style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--accent)' }}>
            <Clock size={11} /> Næsti leikur
          </div>
          <div className="flex items-center justify-between text-sm mt-0.5">
            <span>{nextMatch.strHomeTeam}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>vs</span>
            <span className="text-right">{nextMatch.strAwayTeam}</span>
          </div>
          <div className="text-xs text-center mt-0.5" style={{ color: 'var(--muted)' }}>
            {formatMatchDate(nextMatch.dateEvent, nextMatch.strTime)} · {nextMatch.strLeague}
          </div>
        </div>
      )}

      {!lastMatch && !nextMatch && (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engar leikjaupplýsingar tiltækar</div>
      )}
    </div>
  )
}

function SearchResult({ team, onAdd, isAdded }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
      {team.badge ? (
        <img src={team.badge} alt={team.name} className="w-8 h-8 object-contain" />
      ) : (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
             style={{ background: 'var(--border)', color: 'var(--muted)' }}>
          {(team.shortName || team.name.slice(0, 3)).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{team.name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{team.league} · {team.country}</div>
      </div>
      <button onClick={() => !isAdded && onAdd(team)}
        className="btn text-xs py-1.5 px-3"
        style={{
          background: isAdded ? 'var(--surface)' : 'rgba(0,212,170,0.15)',
          color: isAdded ? 'var(--muted)' : 'var(--accent)',
          border: `1px solid ${isAdded ? 'var(--border)' : 'rgba(0,212,170,0.3)'}`,
        }}>
        {isAdded ? 'Bætt við' : <><Plus size={12} /> Bæta</>}
      </button>
    </div>
  )
}

export default function Sport() {
  const { teams, events, loading, addTeam, removeTeam, searchTeams } = useSports()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = async (q) => {
    setQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    setSearching(true)
    const results = await searchTeams(q)
    setSearchResults(results)
    setSearching(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {teams.length} lið fylgst með
          </p>
        </div>
        <button onClick={() => setShowSearch(!showSearch)} className="btn btn-primary">
          <Plus size={16} /> Lið
        </button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Leita að liði</span>
            <button onClick={() => { setShowSearch(false); setQuery(''); setSearchResults([]) }}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input className="input pl-9 text-sm" placeholder="t.d. Liverpool, Arsenal..."
              value={query} onChange={e => handleSearch(e.target.value)} autoFocus />
          </div>
          {searching && (
            <div className="flex justify-center py-2">
              <Loader2 size={18} className="animate-spin" style={{ color: 'var(--muted)' }} />
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2">
              {searchResults.map(t => (
                <SearchResult key={t.id} team={t}
                  onAdd={team => { addTeam(team); setShowSearch(false); setQuery(''); setSearchResults([]) }}
                  isAdded={teams.some(ft => ft.id === t.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && teams.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-4" style={{ color: 'var(--muted)' }}>
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Sæki leikjaupplýsingar...</span>
        </div>
      )}

      {/* Teams */}
      {teams.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3">
          <Trophy size={40} style={{ color: 'var(--muted)', opacity: 0.4 }} />
          <div style={{ color: 'var(--muted)' }}>
            <div className="font-medium mb-1">Engin lið valin</div>
            <div className="text-sm">Bættu við lið til að fylgjast með niðurstöðum</div>
          </div>
          <button onClick={() => setShowSearch(true)} className="btn btn-primary mt-2">
            <Search size={15} /> Leita að liði
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} ev={events[team.id]} onRemove={removeTeam} />
          ))}
        </div>
      )}
    </div>
  )
}
