import { useSports } from '../../hooks/useSports'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function MatchRow({ match }) {
  const date = new Date(match.date)
  const dateStr = date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
  const timeStr = date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const isWH_home = match.homeTeam?.toLowerCase().includes('west ham')
  const isWH_away = match.awayTeam?.toLowerCase().includes('west ham')

  return (
    <div className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <span className={`font-medium truncate ${isWH_home ? 'text-[var(--accent)]' : ''}`}
                style={{ maxWidth: 90 }}>
            {match.homeTeam}
          </span>
          {match.isCompleted ? (
            <span className="font-bold text-xs px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'var(--surface2)', minWidth: 32, textAlign: 'center' }}>
              {match.homeScore}–{match.awayScore}
            </span>
          ) : match.isLive ? (
            <span className="font-bold text-xs px-1.5 py-0.5 rounded shrink-0 animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', minWidth: 32, textAlign: 'center' }}>
              {match.homeScore ?? 0}–{match.awayScore ?? 0}
            </span>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)', minWidth: 32, textAlign: 'center' }}>
              vs
            </span>
          )}
          <span className={`font-medium truncate ${isWH_away ? 'text-[var(--accent)]' : ''}`}
                style={{ maxWidth: 90 }}>
            {match.awayTeam}
          </span>
        </div>
      </div>
      <div className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
        {match.isLive ? (
          <span style={{ color: 'var(--danger)' }}>● {match.statusText}</span>
        ) : match.isCompleted ? (
          dateStr
        ) : (
          <span>{dateStr} {timeStr}</span>
        )}
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { westHam, loading } = useSports()
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[1, 2].map(i => (
        <div key={i} className="h-8 rounded mb-2" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  const recent = westHam.filter(m => m.isCompleted).slice(-2)
  const upcoming = westHam.filter(m => !m.isCompleted && !m.isLive).slice(0, 1)
  const live = westHam.filter(m => m.isLive)
  const shown = [...live, ...upcoming, ...recent].slice(0, 3)

  return (
    <div className="card cursor-pointer hover:border-[var(--accent)] transition-colors"
         onClick={() => navigate('/sports')}
         style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">⚒️</span>
          <h3 className="text-sm font-semibold">West Ham</h3>
          {live.length > 0 && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>LIVE</span>
          )}
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      {shown.length === 0 ? (
        <p className="text-xs py-2" style={{ color: 'var(--muted)' }}>Engar leikir fundust</p>
      ) : (
        shown.map(m => <MatchRow key={m.id} match={m} />)
      )}
    </div>
  )
}
