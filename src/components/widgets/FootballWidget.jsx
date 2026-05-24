import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  d.setHours(12, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}

export default function FootballWidget() {
  const { nextMatch, lastMatch, loading } = useSports()

  if (loading) return (
    <div className="card flex items-center gap-3 animate-pulse-soft">
      <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'var(--surface2)' }} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-36 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (!nextMatch && !lastMatch) return null

  if (nextMatch) {
    const isHome = nextMatch.strHomeTeam === 'Tottenham Hotspur'
    const opponent = isHome ? nextMatch.strAwayTeam : nextMatch.strHomeTeam
    const days = daysUntil(nextMatch.dateEvent)
    const dateLabel = days === 0
      ? 'Í dag'
      : days === 1
        ? 'Á morgun'
        : days !== null && days > 0
          ? new Date(nextMatch.dateEvent).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
          : nextMatch.dateEvent

    return (
      <div className="card flex items-center gap-3" style={{ background: 'rgba(0,212,170,0.04)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'rgba(0,212,170,0.12)' }}>
          ⚽
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            Spurs {isHome ? 'vs' : '@'} {opponent}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {days === 0 ? '🔴 Leikur í dag!' : days === 1 ? '⏰ Á morgun' : `📅 ${dateLabel}`}
          </div>
        </div>
        <Link to="/sports" style={{ color: 'var(--muted)' }}>
          <ChevronRight size={16} />
        </Link>
      </div>
    )
  }

  if (lastMatch && lastMatch.intHomeScore !== null) {
    const isHome = lastMatch.strHomeTeam === 'Tottenham Hotspur'
    const opponent = isHome ? lastMatch.strAwayTeam : lastMatch.strHomeTeam
    const spursGoals = isHome ? Number(lastMatch.intHomeScore) : Number(lastMatch.intAwayScore)
    const oppGoals = isHome ? Number(lastMatch.intAwayScore) : Number(lastMatch.intHomeScore)
    const result = spursGoals > oppGoals ? '✓ Sigur' : spursGoals === oppGoals ? '= Jafntefli' : '✗ Tap'
    const resultColor = spursGoals > oppGoals ? 'var(--success)' : spursGoals === oppGoals ? '#f97316' : 'var(--danger)'

    return (
      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'var(--surface2)' }}>
          ⚽
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Spurs {isHome ? 'vs' : '@'} {opponent}</div>
          <div className="text-xs mt-0.5 font-medium" style={{ color: resultColor }}>
            {result} · {lastMatch.intHomeScore}–{lastMatch.intAwayScore}
          </div>
        </div>
        <Link to="/sports" style={{ color: 'var(--muted)' }}>
          <ChevronRight size={16} />
        </Link>
      </div>
    )
  }

  return null
}
