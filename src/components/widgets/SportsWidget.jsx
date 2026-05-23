import { Link } from 'react-router-dom'
import { useSports } from '../../hooks/useSports'
import { ChevronRight, Trophy, Zap } from 'lucide-react'

const WC2026_START = new Date('2026-06-11T19:00:00Z')

function getDaysUntil(date) {
  return Math.max(0, Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)))
}

export default function SportsWidget() {
  const { events, loading } = useSports('eng.1')
  const daysToWC = getDaysUntil(WC2026_START)
  const live = events.filter(e => e.isLive)
  const recent = events.filter(e => e.isFinal).slice(0, 2)
  const hasMatches = live.length > 0 || recent.length > 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          <Trophy size={14} style={{ color: 'var(--accent)' }} />
          Íþróttir
        </h3>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {/* World Cup countdown */}
      <Link to="/sports" className="block mb-3">
        <div className="flex items-center gap-3 p-3 rounded-xl"
             style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,170,0.2)' }}>
          <div className="text-2xl">🌍</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              {daysToWC === 0 ? 'FIFA World Cup 2026 is LIVE!' : `${daysToWC} days to World Cup 2026`}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              USMNT · England · June 11 opener
            </div>
          </div>
          <ChevronRight size={13} style={{ color: 'var(--muted)' }} />
        </div>
      </Link>

      {/* PL scores */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => (
            <div key={i} className="h-10 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : hasMatches ? (
        <div className="flex flex-col gap-2">
          {live.length > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <Zap size={11} style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>LIVE</span>
            </div>
          )}
          {[...live.slice(0, 1), ...recent].map(m => (
            <Link key={m.id} to="/sports"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'var(--surface2)' }}>
              {m.home.logo && <img src={m.home.logo} alt="" className="w-5 h-5 object-contain" />}
              <span className="text-xs flex-1 truncate">{m.home.name}</span>
              <span className="text-xs font-mono font-bold tabular-nums">
                {m.home.score} – {m.away.score}
              </span>
              <span className="text-xs flex-1 truncate text-right">{m.away.name}</span>
              {m.away.logo && <img src={m.away.logo} alt="" className="w-5 h-5 object-contain" />}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 No Premier League matches today</p>
        </div>
      )}
    </div>
  )
}
