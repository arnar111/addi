import { useSports } from '../../hooks/useSports'
import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

function TeamRow({ team, isWinner }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {team.logo ? (
        <img src={team.logo} alt={team.abbr} className="w-6 h-6 object-contain shrink-0" />
      ) : (
        <div className="w-6 h-6 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
      )}
      <span className="text-sm font-medium truncate" style={{ color: isWinner ? 'var(--text)' : 'var(--muted)' }}>
        {team.abbr || team.name}
      </span>
    </div>
  )
}

function MatchCard({ match, label }) {
  if (!match) return null
  const { home, away, status, statusDisplay, live, date } = match
  const isFinal = status === 'STATUS_FINAL'
  const hasScore = home.score !== null && away.score !== null

  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: live ? 'rgba(239,68,68,0.15)' : isFinal ? 'rgba(0,212,170,0.1)' : 'rgba(100,116,139,0.1)',
            color: live ? '#ef4444' : isFinal ? 'var(--accent)' : 'var(--muted)',
          }}>
          {live ? '🔴 LIVE' : isFinal ? 'FT' : new Date(date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <TeamRow team={home} isWinner={isFinal && home.winner} />
        <div className="shrink-0 text-center min-w-[40px]">
          {hasScore ? (
            <span className="text-base font-bold tabular-nums">{home.score} - {away.score}</span>
          ) : (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>vs</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
          <TeamRow team={away} isWinner={isFinal && away.winner} />
        </div>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { inter, knicks, loading, refresh } = useSports()

  const interNext = inter?.upcoming?.[0]
  const interLast = inter?.recent?.[0]
  const knicksNext = knicks?.upcoming?.[0]
  const knicksLast = knicks?.recent?.[0]

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold">Íþróttir</span>
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">⚽🏀 Íþróttir</h3>
        <div className="flex items-center gap-2">
          <button onClick={refresh} style={{ color: 'var(--muted)' }}>
            <RefreshCw size={13} />
          </button>
          <Link to="/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Sjá meira →</Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Inter Milan */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#0068A8' }}>
            <img src="https://a.espncdn.com/i/teamlogos/soccer/500/110.png" alt="Inter" className="w-4 h-4 object-contain" />
            Inter Milan
          </span>
          <MatchCard match={interNext || interLast} label={interNext ? 'Næsti leikur' : 'Síðasti leikur'} />
        </div>

        {/* Knicks */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#006BB6' }}>
            <img src="https://a.espncdn.com/i/teamlogos/nba/500/ny.png" alt="Knicks" className="w-4 h-4 object-contain" />
            New York Knicks
          </span>
          <MatchCard match={knicksNext || knicksLast} label={knicksNext ? 'Næsti leikur' : 'Síðasti leikur'} />
        </div>
      </div>
    </div>
  )
}
