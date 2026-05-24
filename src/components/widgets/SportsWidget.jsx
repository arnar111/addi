import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight, Shield } from 'lucide-react'

function MatchRow({ match, label }) {
  if (!match) return null
  const isSpurs = (name) => name?.toLowerCase().includes('tottenham') || name?.toLowerCase().includes('spurs')
  const homeIsSpurs = isSpurs(match.home.name)
  const date = new Date(match.date)
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })

  let resultColor = 'var(--muted)'
  if (match.completed) {
    const spursScore = homeIsSpurs ? Number(match.home.score) : Number(match.away.score)
    const oppScore = homeIsSpurs ? Number(match.away.score) : Number(match.home.score)
    if (spursScore > oppScore) resultColor = 'var(--success)'
    else if (spursScore < oppScore) resultColor = 'var(--danger)'
    else resultColor = '#f97316'
  }

  return (
    <div className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="text-xs shrink-0 w-14" style={{ color: 'var(--muted)' }}>
        <div style={{ color: resultColor, fontWeight: 600 }}>{label}</div>
        <div>{dateStr}</div>
      </div>
      <div className="flex-1 flex items-center justify-center gap-2 text-sm">
        <span className={`text-xs font-semibold truncate max-w-[70px] text-right ${homeIsSpurs ? 'text-[var(--text)]' : ''}`}
              style={{ color: homeIsSpurs ? 'var(--text)' : 'var(--muted)' }}>
          {match.home.abbrev || match.home.name}
        </span>
        {match.completed ? (
          <span className="font-bold tabular-nums shrink-0" style={{ color: resultColor, minWidth: 36, textAlign: 'center' }}>
            {match.home.score}–{match.away.score}
          </span>
        ) : (
          <span className="text-xs shrink-0" style={{ color: 'var(--muted)', minWidth: 36, textAlign: 'center' }}>
            {timeStr}
          </span>
        )}
        <span className={`text-xs font-semibold truncate max-w-[70px] ${!homeIsSpurs ? 'text-[var(--text)]' : ''}`}
              style={{ color: !homeIsSpurs ? 'var(--text)' : 'var(--muted)' }}>
          {match.away.abbrev || match.away.name}
        </span>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { data, loading } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-32 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(19,34,87,0.3), rgba(255,255,255,0.03))' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
               style={{ background: 'rgba(19,34,87,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Shield size={14} color="#ffffff" />
          </div>
          <div>
            <div className="text-sm font-semibold">Tottenham Hotspur</div>
            {data?.record && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{data.record}</div>
            )}
          </div>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {!data || (!data.lastMatch && !data.nextMatch) ? (
        <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Engir leikir fundnir</span>
          <a href="https://theathletic.com" target="_blank" rel="noreferrer"
             className="text-xs" style={{ color: '#e5a820' }}>
            The Athletic →
          </a>
        </div>
      ) : (
        <div className="flex flex-col mt-1">
          <MatchRow match={data?.lastMatch} label="Síðast" />
          <MatchRow match={data?.nextMatch} label="Næst" />
        </div>
      )}
    </div>
  )
}
