import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

function MiniMatch({ event }) {
  const isLive = event.isLive
  const isFinal = event.isFinal
  const timeStr = new Date(event.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex items-center gap-2 py-1.5 text-xs">
      <div className="flex-1 text-right truncate">{event.home.name}</div>
      <div className="shrink-0 w-14 text-center">
        {isLive ? (
          <span className="font-bold" style={{ color: 'var(--danger)' }}>
            {event.home.score}–{event.away.score}
          </span>
        ) : isFinal ? (
          <span className="font-semibold" style={{ color: 'var(--muted)' }}>
            {event.home.score}–{event.away.score}
          </span>
        ) : (
          <span style={{ color: 'var(--accent)' }}>{timeStr}</span>
        )}
      </div>
      <div className="flex-1 truncate">{event.away.name}</div>
    </div>
  )
}

export default function SportsWidget() {
  const { data, loading, error } = useSports('PL')

  const matches = data?.events?.slice(0, 4) || []

  return (
    <Link to="/sports" className="card block" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold">Premier League</span>
          {data?.events?.some(e => e.isLive) && (
            <span className="text-xs px-1.5 py-0.5 rounded-full animate-pulse-soft font-semibold"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>● LIVE</span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--accent)' }}>Allt →</span>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1,2].map(i => <div key={i} className="h-5 rounded animate-pulse-soft" style={{ background: 'var(--surface2)' }} />)}
        </div>
      )}
      {error && (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>📡 Tengist…</div>
      )}
      {!loading && !error && matches.length === 0 && (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engir leikir í dag ⚽</div>
      )}
      {!loading && matches.map(e => <MiniMatch key={e.id} event={e} />)}
    </Link>
  )
}
