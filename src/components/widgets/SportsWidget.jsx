import { useSports } from '../../hooks/useSports'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Trophy, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function MatchRow({ match }) {
  const isLive = match.state === 'in'
  const isDone = match.state === 'post'
  const isPre = match.state === 'pre'

  const dateStr = isPre ? new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) : null

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex-1 flex items-center justify-end gap-1.5">
        {match.home.logo && (
          <img src={match.home.logo} alt={match.home.name} className="w-5 h-5 object-contain" />
        )}
        <span className="text-xs font-medium truncate max-w-[70px]">{match.home.name}</span>
      </div>

      <div className="shrink-0 flex items-center gap-1 px-2">
        {(isDone || isLive) ? (
          <span className="text-sm font-bold tabular-nums" style={{ color: isLive ? 'var(--success)' : 'var(--text)' }}>
            {match.home.score} - {match.away.score}
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateStr || 'vs'}</span>
        )}
      </div>

      <div className="flex-1 flex items-center gap-1.5">
        {match.away.logo && (
          <img src={match.away.logo} alt={match.away.name} className="w-5 h-5 object-contain" />
        )}
        <span className="text-xs font-medium truncate max-w-[70px]">{match.away.name}</span>
      </div>

      {isLive && (
        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded font-semibold"
              style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
          LIVE
        </span>
      )}
    </div>
  )
}

export default function SportsWidget() {
  const { plMatches, loading } = useSports()
  const [favoriteTeam] = useLocalStorage('addi_fav_team', 'Man Utd')
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3 py-4">
      <Trophy size={18} style={{ color: 'var(--accent)' }} />
      <div className="text-sm" style={{ color: 'var(--muted)' }}>Sæki leiki...</div>
    </div>
  )

  const liveMatches = plMatches.filter(m => m.state === 'in')
  const recentMatches = plMatches.filter(m => m.state === 'post').slice(0, 2)
  const upcomingMatches = plMatches.filter(m => m.state === 'pre').slice(0, 2)

  const displayMatches = liveMatches.length > 0
    ? liveMatches.slice(0, 3)
    : recentMatches.length > 0
      ? recentMatches.slice(0, 2)
      : upcomingMatches.slice(0, 2)

  const favMatch = plMatches.find(m =>
    m.home.name.toLowerCase().includes(favoriteTeam.toLowerCase()) ||
    m.away.name.toLowerCase().includes(favoriteTeam.toLowerCase())
  )

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy size={15} style={{ color: 'var(--accent2)' }} />
          <span className="text-sm font-semibold">Premier League</span>
          {liveMatches.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded font-bold animate-pulse-soft"
                  style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--success)' }}>
              {liveMatches.length} LIVE
            </span>
          )}
        </div>
        <button onClick={() => navigate('/sports')} className="flex items-center gap-0.5 text-xs"
                style={{ color: 'var(--muted)' }}>
          Meira <ChevronRight size={12} />
        </button>
      </div>

      {favMatch && (
        <div className="mb-2 px-2 py-1.5 rounded-xl"
             style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--accent2)' }}>⭐ {favoriteTeam}</div>
          <MatchRow match={favMatch} />
        </div>
      )}

      {displayMatches.length === 0 ? (
        <div className="text-center py-3 text-xs" style={{ color: 'var(--muted)' }}>
          Engir leikir á dagskrá
        </div>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
          {displayMatches.map(m => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}
