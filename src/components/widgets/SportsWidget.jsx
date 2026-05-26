import { useSports } from '../../hooks/useSports'
import { Trophy, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function GameRow({ home, away, status, state, date }) {
  const isLive = state === 'in'
  const isDone = state === 'post'
  const dateStr = new Date(date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1 text-sm font-medium truncate">{away.name}</div>
      <div className="shrink-0 text-center" style={{ minWidth: 60 }}>
        {isDone || isLive ? (
          <span className="font-bold text-sm">{away.score} – {home.score}</span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateStr}</span>
        )}
      </div>
      <div className="flex-1 text-sm font-medium truncate text-right">{home.name}</div>
      {isLive && (
        <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold animate-pulse-soft shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>LIVE</span>
      )}
    </div>
  )
}

export default function SportsWidget() {
  const { nba, soccer, loading } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ height: 100 }}>
      <div className="h-4 w-24 rounded mb-2" style={{ background: 'var(--surface2)' }} />
      <div className="h-3 w-full rounded mb-1" style={{ background: 'var(--surface2)' }} />
      <div className="h-3 w-full rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  const hasNba = nba?.all?.length > 0
  const hasSoccer = soccer?.all?.length > 0

  if (!hasNba && !hasSoccer) return null

  const nbaGames = nba?.cavs || nba?.all?.slice(0, 2) || []
  const soccerGames = soccer?.inter || soccer?.all?.slice(0, 2) || []

  const showGames = [...soccerGames.slice(0, 1), ...nbaGames.slice(0, 1)]

  if (showGames.length === 0) return null

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(59,130,246,0.05))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy size={14} style={{ color: '#f97316' }} />
          <span className="text-sm font-semibold">Íþróttir</span>
        </div>
        <Link to="/sports" className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={13} />
        </Link>
      </div>

      {soccerGames.slice(0, 1).map(g => (
        <div key={g.id}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>⚫🔵 Serie A</div>
          <GameRow {...g} />
        </div>
      ))}

      {nbaGames.slice(0, 1).map(g => (
        <div key={g.id} className={soccerGames.length ? 'mt-2' : ''}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>🏀 NBA</div>
          <GameRow {...g} />
        </div>
      ))}
    </div>
  )
}
