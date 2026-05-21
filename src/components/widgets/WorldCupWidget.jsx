import { useWorldCup, WC_START } from '../../hooks/useWorldCup'
import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'

function MatchRow({ m }) {
  const isLive = m.statusName === 'in'
  const isDone = m.completed
  const isPre = !isLive && !isDone
  const matchTime = isPre
    ? new Date(m.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="flex items-center gap-2 py-2.5"
         style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Home */}
      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
        <span className="text-xs font-medium truncate" style={{ maxWidth: 72 }}>{m.home.name}</span>
        <span className="text-lg leading-none">{m.home.flag}</span>
      </div>

      {/* Score / time */}
      <div className="flex flex-col items-center w-[60px] shrink-0">
        {(isLive || isDone) ? (
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tabular-nums">{m.home.score}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
            <span className="font-bold text-sm tabular-nums">{m.away.score}</span>
          </div>
        ) : (
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{matchTime}</span>
        )}
        {isLive && (
          <span className="text-[10px] font-bold animate-pulse-soft mt-0.5"
                style={{ color: '#ef4444' }}>● {m.displayClock || 'LIVE'}</span>
        )}
        {isDone && !isLive && (
          <span className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Lokið</span>
        )}
        {isPre && m.note && (
          <span className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--muted)', maxWidth: 56 }}>{m.note}</span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-lg leading-none">{m.away.flag}</span>
        <span className="text-xs font-medium truncate" style={{ maxWidth: 72 }}>{m.away.name}</span>
      </div>
    </div>
  )
}

export default function WorldCupWidget() {
  const { loading, preWC, days, liveMatches, todayMatches, upcomingMatches } = useWorldCup()

  const displayMatches = liveMatches.length > 0
    ? liveMatches
    : todayMatches.length > 0
      ? todayMatches
      : upcomingMatches.slice(0, 3)

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ minHeight: 88 }}>
      <div className="h-4 w-36 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,85,164,0.09) 0%, rgba(239,68,68,0.07) 100%)',
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="font-semibold text-sm">FIFA World Cup 2026</span>
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <Zap size={9} /> LIVE
            </span>
          )}
        </div>
        <Link to="/football" className="flex items-center gap-0.5 text-xs"
              style={{ color: 'var(--accent)' }}>
          Allt <ChevronRight size={12} />
        </Link>
      </div>

      {preWC && days > 0 && (
        <div className="flex items-end gap-3 py-1 mb-2">
          <div className="text-center">
            <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{days}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>dagar eftir</div>
          </div>
          <div className="flex flex-col gap-0.5 pb-1">
            <span className="text-xs font-medium">HMK hefst</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {WC_START.toLocaleDateString('is-IS', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>🇺🇸 🇨🇦 🇲🇽 USA · Canada · México</span>
          </div>
        </div>
      )}

      {displayMatches.length > 0 ? (
        <div>
          {displayMatches.map(m => <MatchRow key={m.id} m={m} />)}
        </div>
      ) : !preWC ? (
        <p className="text-sm py-2" style={{ color: 'var(--muted)' }}>Engir leikir í dag</p>
      ) : null}
    </div>
  )
}
