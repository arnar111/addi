import { useFootball } from '../../hooks/useFootball'
import { RefreshCw, Zap } from 'lucide-react'

// Highlight Arsenal
const ARSENAL_NAMES = ['Arsenal', 'ARS']
const isArsenal = (name) => ARSENAL_NAMES.some(a => name?.toLowerCase().includes(a.toLowerCase()))

function MatchRow({ match }) {
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const arsenalHome = isArsenal(match.homeTeam)
  const arsenalAway = isArsenal(match.awayTeam)
  const arsenalInvolved = arsenalHome || arsenalAway

  let resultBg = null
  if (match.isFinished && arsenalInvolved) {
    const arsenalGoals = arsenalHome ? Number(match.homeScore) : Number(match.awayScore)
    const oppGoals = arsenalHome ? Number(match.awayScore) : Number(match.homeScore)
    if (arsenalGoals > oppGoals) resultBg = 'rgba(34,197,94,0.08)'
    else if (arsenalGoals < oppGoals) resultBg = 'rgba(239,68,68,0.08)'
    else resultBg = 'rgba(100,116,139,0.08)'
  }

  return (
    <div className="flex items-center justify-between py-2 px-2 rounded-xl"
         style={{ background: arsenalInvolved ? (resultBg || 'rgba(239,68,68,0.05)') : 'transparent' }}>
      {/* Home */}
      <div className="flex items-center gap-1.5 w-[38%]">
        {match.homeLogo && (
          <img src={match.homeLogo} alt="" className="w-5 h-5 object-contain shrink-0" />
        )}
        <span className="text-xs truncate font-medium" style={{ color: arsenalHome ? '#ef4444' : 'var(--text)' }}>
          {match.homeTeam}
        </span>
      </div>

      {/* Score / time */}
      <div className="flex flex-col items-center shrink-0 mx-1">
        {hasScore ? (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold" style={{ minWidth: 14, textAlign: 'center' }}>{match.homeScore}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-sm font-bold" style={{ minWidth: 14, textAlign: 'center' }}>{match.awayScore}</span>
          </div>
        ) : (
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {match.isLive && (
          <span className="text-xs font-bold mt-0.5 animate-pulse-soft" style={{ color: '#ef4444', fontSize: 10 }}>
            LIVE {match.clock}
          </span>
        )}
        {match.isFinished && !match.isLive && (
          <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>FT</span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 w-[38%] justify-end">
        <span className="text-xs truncate font-medium text-right" style={{ color: arsenalAway ? '#ef4444' : 'var(--text)' }}>
          {match.awayTeam}
        </span>
        {match.awayLogo && (
          <img src={match.awayLogo} alt="" className="w-5 h-5 object-contain shrink-0" />
        )}
      </div>
    </div>
  )
}

export default function FootballWidget() {
  const { matches, liveMatches, finishedMatches, upcomingMatches, loading, error, lastUpdated, refetch } = useFootball()

  if (loading) return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚽</span>
        <span className="font-semibold text-sm">Premier League</span>
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="h-9 rounded-xl mb-1 shimmer" />
      ))}
    </div>
  )

  // Prioritize: live first, then today's finished, then upcoming
  const display = [
    ...liveMatches,
    ...finishedMatches.slice(0, liveMatches.length > 0 ? 2 : 4),
    ...upcomingMatches.slice(0, 3),
  ].slice(0, 6)

  return (
    <div className="card" style={{ padding: '14px' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="font-semibold text-sm">Premier League</span>
          {liveMatches.length > 0 && (
            <span className="badge text-xs animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <Zap size={9} className="mr-0.5" /> LIVE {liveMatches.length}
            </span>
          )}
        </div>
        <button onClick={refetch} className="p-1 rounded-lg transition-all"
                style={{ color: 'var(--muted)' }}
                title="Uppfæra">
          <RefreshCw size={13} />
        </button>
      </div>

      {error ? (
        <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
          Gat ekki sótt leiki. {error}
        </div>
      ) : display.length === 0 ? (
        <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
          Engir leikir í dag 🎉
        </div>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
          {display.map(m => <MatchRow key={m.id} match={m} />)}
        </div>
      )}

      {lastUpdated && (
        <div className="text-xs mt-2 text-right" style={{ color: 'var(--muted)', fontSize: 10 }}>
          Uppfært {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
