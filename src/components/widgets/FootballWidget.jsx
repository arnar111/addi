import { useFootball } from '../../hooks/useFootball'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const RESULT_COLOR = { W: 'var(--success)', L: 'var(--danger)', D: '#f59e0b' }

function ResultBadge({ r }) {
  if (!r) return null
  return (
    <span className="badge" style={{ background: `${RESULT_COLOR[r]}22`, color: RESULT_COLOR[r] }}>{r}</span>
  )
}

export default function FootballWidget() {
  const { nextMatch, lastMatches, loading } = useFootball()

  if (loading) return (
    <div className="card animate-pulse-soft h-24" style={{ background: 'var(--surface)' }} />
  )

  const last = lastMatches[0]

  return (
    <Link to="/football" className="card block" style={{ background: 'linear-gradient(135deg, rgba(26,38,58,0.9), rgba(10,14,26,0.9))', border: '1px solid var(--border)', textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <span className="text-sm font-semibold">Tottenham Hotspur</span>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {last && (
          <div className="rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium truncate mr-2">{last.isHome ? 'vs' : '@'} {last.opponent?.split(' ').slice(-1)[0]}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-sm font-bold">{last.score}</span>
                <ResultBadge r={last.result} />
              </div>
            </div>
          </div>
        )}

        {nextMatch ? (
          <div className="rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="text-xs font-medium truncate">{nextMatch.isHome ? 'vs' : '@'} {nextMatch.opponent?.split(' ').slice(-1)[0]}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
              {nextMatch.date ? new Date(nextMatch.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' }) : ''}
              {nextMatch.time ? ` · ${nextMatch.time}` : ''}
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Engin leikur á dagskrá</div>
          </div>
        )}
      </div>

      {lastMatches.length > 1 && (
        <div className="flex gap-1.5 mt-3">
          {lastMatches.slice(0, 5).reverse().map((m, i) => (
            <div key={m?.id || i} className="flex-1 h-1.5 rounded-full"
                 style={{ background: m?.result ? RESULT_COLOR[m.result] : 'var(--surface2)' }} />
          ))}
        </div>
      )}
    </Link>
  )
}
