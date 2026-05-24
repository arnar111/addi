import { useState } from 'react'
import { useSports, LEAGUES } from '../hooks/useSports'
import { RefreshCw } from 'lucide-react'

const WEST_HAM_NAMES = ['west ham', 'west ham united', 'hammers']

function isWestHam(name) {
  return WEST_HAM_NAMES.some(n => name?.toLowerCase().includes(n) || name?.toLowerCase().includes('ham'))
}

function StatusBadge({ status, desc }) {
  if (status === 'in') return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--danger)' }} />
      LIVE {desc}
    </span>
  )
  if (status === 'post') return (
    <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>Lokið</span>
  )
  return (
    <span className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</span>
  )
}

function MatchCard({ match }) {
  const wh = isWestHam(match.home) || isWestHam(match.away)
  const live = match.status === 'in'
  const hasScore = match.homeScore !== null && match.awayScore !== null

  return (
    <div className="card flex flex-col gap-2"
         style={{ borderColor: wh ? 'rgba(139,92,246,0.4)' : live ? 'rgba(239,68,68,0.2)' : 'var(--border)' }}>
      {wh && (
        <div className="text-xs font-semibold px-1" style={{ color: '#8b5cf6' }}>
          ⚒️ West Ham
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="font-semibold text-sm">{match.home}</div>
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0 min-w-[60px]">
          {hasScore ? (
            <div className="text-xl font-bold tabular-nums"
                 style={{ color: live ? 'var(--danger)' : 'var(--text)' }}>
              {match.homeScore} – {match.awayScore}
            </div>
          ) : (
            <div className="text-sm font-bold">vs</div>
          )}
          <StatusBadge status={match.status} desc={match.statusDesc} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{match.away}</div>
        </div>
      </div>
    </div>
  )
}

function LeagueScores({ leagueId }) {
  const { scores, loading } = useSports(leagueId)

  if (loading) return (
    <div className="flex flex-col gap-2">
      {[1,2,3].map(i => (
        <div key={i} className="card h-16 animate-pulse-soft" />
      ))}
    </div>
  )

  if (!scores.length) return (
    <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
      Engar leikir í gangi
    </div>
  )

  return (
    <div className="flex flex-col gap-2">
      {scores.map(m => <MatchCard key={m.id} match={m} />)}
    </div>
  )
}

export default function Sports() {
  const [league, setLeague] = useState('eng.1')
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => {
    LEAGUES.forEach(l => {
      sessionStorage.removeItem(`sports_${l.id}`)
      sessionStorage.removeItem(`sports_${l.id}_at`)
    })
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LEAGUES.map(l => (
          <button key={l.id} onClick={() => setLeague(l.id)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: league === l.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: league === l.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${league === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      {/* West Ham notice */}
      {league === 'eng.2' && (
        <div className="card flex items-center gap-2 py-2.5"
             style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.3)' }}>
          <span>⚒️</span>
          <span className="text-xs" style={{ color: '#8b5cf6' }}>
            West Ham United — Championship 2026/27 tímabilið
          </span>
        </div>
      )}

      <LeagueScores key={`${league}-${refreshKey}`} leagueId={league} />
    </div>
  )
}
