import { useFootball } from '../../hooks/useFootball'
import { useNavigate } from 'react-router-dom'

export default function FootballWidget() {
  const { liveMatches, todayMatches, upcomingMatches, loading } = useFootball()
  const navigate = useNavigate()

  const hasLive = liveMatches.length > 0
  const displayMatches = hasLive
    ? liveMatches.slice(0, 2)
    : todayMatches.slice(0, 2)

  if (loading) return (
    <button onClick={() => navigate('/football')} className="card w-full text-left animate-pulse-soft"
            style={{ background: 'linear-gradient(135deg, rgba(0,80,40,0.12), rgba(0,40,120,0.08))' }}>
      <div className="h-4 w-36 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="h-10 rounded" style={{ background: 'var(--surface2)' }} />
    </button>
  )

  return (
    <button onClick={() => navigate('/football')} className="card w-full text-left"
            style={{ background: 'linear-gradient(135deg, rgba(0,80,40,0.12), rgba(0,40,120,0.08))' }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>FIFA WORLD CUP 2026</span>
        </div>
        {hasLive ? (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>LIVE</span>
          </div>
        ) : todayMatches.length > 0 ? (
          <span className="text-xs" style={{ color: 'var(--accent)' }}>{todayMatches.length} leikir í dag</span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Sjá meira →</span>
        )}
      </div>

      {displayMatches.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {displayMatches.map(m => {
            const home = m.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home')
            const away = m.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away')
            const isLive = m.status?.type?.state === 'in'
            const isDone = m.status?.type?.state === 'post'
            if (!home || !away) return null
            return (
              <div key={m.id} className="flex items-center gap-2 text-sm py-1 px-1 rounded-lg"
                   style={{ background: isLive ? 'rgba(239,68,68,0.06)' : 'transparent' }}>
                <span className="flex-1 truncate font-medium text-xs">
                  {home.team?.shortDisplayName || home.team?.abbreviation}
                </span>
                <span className="font-bold text-sm" style={{ color: isLive ? 'var(--danger)' : isDone ? 'var(--text)' : 'var(--muted)', minWidth: 48, textAlign: 'center' }}>
                  {(isLive || isDone) ? `${home.score} – ${away.score}` : 'vs'}
                </span>
                <span className="flex-1 truncate text-right font-medium text-xs">
                  {away.team?.shortDisplayName || away.team?.abbreviation}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 py-1">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-sm font-medium">
              {upcomingMatches.length > 0 ? 'Væntanlegir leikir' : 'Fylgstu með World Cup'}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {upcomingMatches.length > 0
                ? `${upcomingMatches.length} leikir á dagskrá`
                : 'England · Man United og fleira'}
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
