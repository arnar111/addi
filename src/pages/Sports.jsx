import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw, Trophy } from 'lucide-react'

function positionColor(rank, total) {
  if (rank <= 4) return '#00d4aa'
  if (rank === 5) return '#8b5cf6'
  if (rank === 6) return '#3b82f6'
  if (total && rank >= total - 2) return '#ef4444'
  return 'var(--muted)'
}

function statusColor(name) {
  if (name === 'STATUS_IN_PROGRESS') return '#22c55e'
  if (name === 'STATUS_FINAL') return 'var(--muted)'
  return 'var(--accent)'
}

function MatchCard({ m }) {
  const isLive = m.statusName === 'STATUS_IN_PROGRESS'
  const isDone = m.statusName === 'STATUS_FINAL'
  const hasScore = m.homeScore !== undefined && m.homeScore !== null

  return (
    <div className="card py-3"
         style={{
           borderColor: m.isTottenham ? 'rgba(19,34,87,0.6)' : 'var(--border)',
           background: m.isTottenham ? 'linear-gradient(135deg, rgba(19,34,87,0.25), rgba(10,14,26,0))' : undefined,
         }}>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="text-sm font-semibold">
            {m.homeShort || m.homeTeam.split(' ').slice(-1)[0]}
            {isTottenhamTeam(m.homeTeam) && ' 🐓'}
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0 px-1">
          {hasScore ? (
            <div className="text-lg font-bold">{m.homeScore} – {m.awayScore}</div>
          ) : (
            <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>vs</div>
          )}
          <div className="text-xs" style={{ color: statusColor(m.statusName) }}>
            {isLive ? `${m.clock} ●` : m.statusShort || formatMatchDate(m.date)}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {isTottenhamTeam(m.awayTeam) && '🐓 '}
            {m.awayShort || m.awayTeam.split(' ').slice(-1)[0]}
          </div>
        </div>
      </div>
    </div>
  )
}

function isTottenhamTeam(name = '') {
  return ['tottenham', 'spurs', 'TOT'].some(n => name.toLowerCase().includes(n.toLowerCase()))
}

function formatMatchDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Sports() {
  const { standings, matches, loading, error, lastUpdated, refresh } = useSports()
  const [tab, setTab] = useState('table')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const total = standings?.length || 20

  const liveMatches = matches?.filter(m => m.statusName === 'STATUS_IN_PROGRESS') || []
  const finishedMatches = matches?.filter(m => m.statusName === 'STATUS_FINAL').slice(0, 10) || []
  const upcomingMatches = matches
    ?.filter(m => m.statusName === 'STATUS_SCHEDULED')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10) || []

  const tottenhamMatches = matches?.filter(m => m.isTottenham) || []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Knattspyrna</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025/26</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn btn-ghost text-xs"
          style={{ opacity: refreshing ? 0.5 : 1 }}>
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Uppfæra
        </button>
      </div>

      {lastUpdated && (
        <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>
          Síðast uppfært: {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5">
        {[['table', '📊 Tafla'], ['matches', '🎮 Leikir'], ['spurs', '🐓 Spurs']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '8px 6px',
            }}>
            {l}
          </button>
        ))}
      </div>

      {loading && (
        <div className="card animate-pulse-soft py-12 text-center" style={{ color: 'var(--muted)' }}>
          Sæki gögn…
        </div>
      )}

      {error && !loading && (
        <div className="card text-center py-8">
          <div className="text-2xl mb-2">😕</div>
          <div className="text-sm font-medium">Gat ekki sótt gögn</div>
          <div className="text-xs mt-1 mb-3" style={{ color: 'var(--muted)' }}>{error}</div>
          <button onClick={handleRefresh} className="btn btn-primary mx-auto">Reyna aftur</button>
        </div>
      )}

      {/* Table */}
      {tab === 'table' && standings && (
        <div className="card p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium"
               style={{ background: 'var(--surface2)', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <span className="w-6 shrink-0">#</span>
            <span className="flex-1">Lið</span>
            <span className="w-6 text-center">L</span>
            <span className="w-6 text-center">W</span>
            <span className="w-6 text-center">D</span>
            <span className="w-6 text-center">T</span>
            <span className="w-8 text-center">MD</span>
            <span className="w-8 text-center font-bold">S</span>
          </div>

          {standings.map(row => (
            <div key={row.id || row.rank}
                 className="flex items-center gap-2 px-4 py-2.5 text-sm"
                 style={{
                   background: row.isTottenham ? 'rgba(19,34,87,0.3)' : 'transparent',
                   borderBottom: '1px solid var(--border)',
                   borderLeft: `3px solid ${positionColor(row.rank, total)}`,
                 }}>
              <span className="w-6 text-xs font-medium shrink-0" style={{ color: positionColor(row.rank, total) }}>
                {row.rank}
              </span>
              <span className="flex-1 font-medium truncate text-xs" style={{ color: row.isTottenham ? '#a8c4e8' : 'var(--text)' }}>
                {row.team}
                {row.isTottenham && ' 🐓'}
              </span>
              <span className="w-6 text-center text-xs" style={{ color: 'var(--muted)' }}>{row.played}</span>
              <span className="w-6 text-center text-xs">{row.won}</span>
              <span className="w-6 text-center text-xs">{row.drawn}</span>
              <span className="w-6 text-center text-xs">{row.lost}</span>
              <span className="w-8 text-center text-xs" style={{ color: row.gd > 0 ? 'var(--success)' : row.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                {row.gd > 0 ? '+' : ''}{row.gd}
              </span>
              <span className="w-8 text-center text-xs font-bold" style={{ color: row.isTottenham ? '#a8c4e8' : 'var(--text)' }}>
                {row.points}
              </span>
            </div>
          ))}

          <div className="flex gap-3 px-4 py-2 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#00d4aa', display: 'inline-block' }} /> UCL</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6', display: 'inline-block' }} /> UEL</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#3b82f6', display: 'inline-block' }} /> UECL</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#ef4444', display: 'inline-block' }} /> Niður</span>
          </div>
        </div>
      )}

      {/* Matches */}
      {tab === 'matches' && (
        <div className="flex flex-col gap-3">
          {liveMatches.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#22c55e' }} />
                <h3 className="text-sm font-semibold">Í gangi</h3>
              </div>
              {liveMatches.map(m => <MatchCard key={m.id} m={m} />)}
            </>
          )}
          {upcomingMatches.length > 0 && (
            <>
              <h3 className="text-sm font-semibold px-1">Fyrirhugaðir leikir</h3>
              {upcomingMatches.map(m => <MatchCard key={m.id} m={m} />)}
            </>
          )}
          {finishedMatches.length > 0 && (
            <>
              <h3 className="text-sm font-semibold px-1">Nýlegar niðurstöður</h3>
              {finishedMatches.map(m => <MatchCard key={m.id} m={m} />)}
            </>
          )}
          {liveMatches.length === 0 && upcomingMatches.length === 0 && finishedMatches.length === 0 && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engir leikir fundust</div>
          )}
        </div>
      )}

      {/* Spurs tab */}
      {tab === 'spurs' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(19,34,87,0.4), rgba(10,14,26,0))' , borderColor: 'rgba(19,34,87,0.6)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🐓</span>
              <div>
                <div className="font-bold">Tottenham Hotspur</div>
                {standings && (() => {
                  const t = standings.find(s => s.isTottenham)
                  if (!t) return <div className="text-xs" style={{ color: 'var(--muted)' }}>Ekki fundist í töflu</div>
                  return (
                    <div className="text-sm" style={{ color: '#a8c4e8' }}>
                      #{t.rank} · {t.points} stig · {t.won}V {t.drawn}J {t.lost}T
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {tottenhamMatches.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold px-1">Leikir Spurs</h3>
              {tottenhamMatches.map(m => <MatchCard key={m.id} m={m} />)}
            </>
          ) : (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engir leikir Spurs fundust
            </div>
          )}
        </div>
      )}
    </div>
  )
}
