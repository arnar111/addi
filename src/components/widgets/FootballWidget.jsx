import { useFootball } from '../../hooks/useFootball'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function MatchRow({ match }) {
  const isLive = match.status === 'STATUS_IN_PROGRESS'
  const isFinal = match.status === 'STATUS_FINAL'
  const time = !isFinal && !isLive
    ? new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
    : null
  const isLiverpool = (n) => n?.toLowerCase().includes('liverpool')
  const hlHome = isLiverpool(match.home.name)
  const hlAway = isLiverpool(match.away.name)

  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className={`flex-1 text-xs text-right truncate ${hlHome ? 'font-semibold' : ''}`}
            style={{ color: hlHome ? 'var(--accent)' : 'var(--text)' }}>
        {match.home.name}
      </span>
      <div className="flex items-center gap-1 shrink-0" style={{ minWidth: 60, justifyContent: 'center' }}>
        {isFinal || isLive ? (
          <span className="text-sm font-bold tabular-nums">
            {match.home.score}
            <span className="mx-1 font-normal" style={{ color: 'var(--muted)' }}>-</span>
            {match.away.score}
          </span>
        ) : (
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{time}</span>
        )}
      </div>
      <span className={`flex-1 text-xs truncate ${hlAway ? 'font-semibold' : ''}`}
            style={{ color: hlAway ? 'var(--accent)' : 'var(--text)' }}>
        {match.away.name}
      </span>
      {isLive && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-soft" style={{ background: '#ef4444' }} />
      )}
    </div>
  )
}

export default function FootballWidget() {
  const { todayMatches, liveMatches, loading, error } = useFootball()
  const display = [...liveMatches, ...todayMatches.filter(m => m.status !== 'STATUS_IN_PROGRESS')].slice(0, 5)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <h3 className="font-semibold text-sm">Premier League</h3>
          {liveMatches.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              LIVE
            </span>
          )}
        </div>
        <Link to="/sport" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="py-4 text-center text-xs animate-pulse-soft" style={{ color: 'var(--muted)' }}>Hleð leikjum...</div>
      ) : error || display.length === 0 ? (
        <div className="py-3 text-center text-xs" style={{ color: 'var(--muted)' }}>
          {error ? 'Gat ekki tengst' : 'Engir leikir á dagskrá í dag'}
        </div>
      ) : (
        <div>
          {display.map(m => <MatchRow key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
