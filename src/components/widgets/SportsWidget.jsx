import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function MatchRow({ match }) {
  const isLive = match.status === 'STATUS_IN_PROGRESS'
  const isFinal = match.status === 'STATUS_FINAL'

  return (
    <div className="flex items-center gap-2 py-2" style={{ borderTop: '1px solid var(--border)' }}>
      <span className="text-xs font-medium truncate flex-1 text-right">{match.home.name}</span>
      <div className="shrink-0 flex items-center justify-center w-16">
        {isFinal || isLive ? (
          <span className="font-bold text-sm tabular-nums">
            <span style={{ color: match.home.winner ? 'var(--text)' : 'var(--muted)' }}>{match.home.score}</span>
            <span style={{ color: 'var(--muted)', margin: '0 3px' }}>–</span>
            <span style={{ color: match.away.winner ? 'var(--text)' : 'var(--muted)' }}>{match.away.score}</span>
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{match.statusShort || 'vs'}</span>
        )}
      </div>
      <span className="text-xs font-medium truncate flex-1">{match.away.name}</span>
      {isLive && (
        <span className="text-xs animate-pulse-soft shrink-0" style={{ color: 'var(--danger)', fontSize: 9 }}>LIVE</span>
      )}
    </div>
  )
}

export default function SportsWidget() {
  const { football, loading } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-3 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[0, 1, 2].map(i => (
        <div key={i} className="h-8 rounded-lg mb-1" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  const shown = football.slice(0, 4)
  if (shown.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span>⚽</span>
          <h3 className="font-semibold text-sm">Knattspyrna</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>
      {shown.map(m => <MatchRow key={m.id} match={m} />)}
    </div>
  )
}
