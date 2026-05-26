import { useFootball } from '../../hooks/useFootball'
import { ExternalLink } from 'lucide-react'

function score(match) {
  const home = match.intHomeScore ?? '?'
  const away = match.intAwayScore ?? '?'
  return `${home}–${away}`
}

function shortName(name) {
  const MAP = {
    'Arsenal': 'ARS', 'Manchester City': 'MCI', 'Manchester United': 'MNU',
    'Chelsea': 'CHE', 'Liverpool': 'LIV', 'Tottenham Hotspur': 'TOT',
    'Newcastle United': 'NEW', 'Aston Villa': 'AVL', 'Brighton': 'BHA',
    'West Ham United': 'WHU', 'Crystal Palace': 'CRY', 'Brentford': 'BRE',
    'Fulham': 'FUL', 'Wolverhampton Wanderers': 'WOL', 'Everton': 'EVE',
    'Nottingham Forest': 'NFO', 'Leicester City': 'LEI', 'Burnley': 'BUR',
    'Luton Town': 'LUT', 'Sheffield United': 'SHU', 'Ipswich Town': 'IPS',
    'Southampton': 'SOU', 'Sunderland': 'SUN', 'Middlesbrough': 'MID',
  }
  return MAP[name] || name?.slice(0, 3).toUpperCase() || '???'
}

function resultColor(match) {
  const isHome = match.strHomeTeam === 'Arsenal'
  const hs = Number(match.intHomeScore)
  const as = Number(match.intAwayScore)
  if (isNaN(hs) || isNaN(as)) return 'var(--muted)'
  const arsenalScore = isHome ? hs : as
  const oppScore = isHome ? as : hs
  if (arsenalScore > oppScore) return 'var(--success)'
  if (arsenalScore < oppScore) return 'var(--danger)'
  return '#f97316'
}

function resultLabel(match) {
  const isHome = match.strHomeTeam === 'Arsenal'
  const hs = Number(match.intHomeScore)
  const as = Number(match.intAwayScore)
  if (isNaN(hs) || isNaN(as)) return '?'
  const arsenalScore = isHome ? hs : as
  const oppScore = isHome ? as : hs
  if (arsenalScore > oppScore) return 'W'
  if (arsenalScore < oppScore) return 'L'
  return 'D'
}

function opponent(match) {
  return match.strHomeTeam === 'Arsenal' ? match.strAwayTeam : match.strHomeTeam
}

function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
}

function formatNextDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + (timeStr ? 'T' + timeStr : ''))
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function FootballWidget() {
  const { data, loading } = useFootball()

  if (loading) {
    return (
      <div className="card animate-pulse-soft" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(255,255,255,0.03))' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full" style={{ background: 'var(--surface2)' }} />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 w-28 rounded" style={{ background: 'var(--surface2)' }} />
            <div className="h-3 w-20 rounded" style={{ background: 'var(--surface2)' }} />
          </div>
        </div>
      </div>
    )
  }

  const { lastMatch, nextMatch } = data || {}

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(255,255,255,0.02))', border: '1px solid rgba(239,68,68,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <span className="font-semibold text-sm">Arsenal · Premier League</span>
        </div>
        <a href="https://theathletic.com/team/arsenal" target="_blank" rel="noreferrer"
           className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          Athletic <ExternalLink size={11} />
        </a>
      </div>

      <div className="flex gap-3">
        {lastMatch && (
          <div className="flex-1 rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{shortName(opponent(lastMatch))}</span>
              <span className="font-bold text-base">{score(lastMatch)}</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                background: `${resultColor(lastMatch)}22`,
                color: resultColor(lastMatch),
              }}>{resultLabel(lastMatch)}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {lastMatch.strHomeTeam === 'Arsenal' ? 'H' : 'U'} · {formatMatchDate(lastMatch.dateEvent)}
            </div>
          </div>
        )}

        {nextMatch && (
          <div className="flex-1 rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="text-xs font-bold mb-1" style={{ color: '#ef4444' }}>
              vs {shortName(opponent(nextMatch))}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {nextMatch.strHomeTeam === 'Arsenal' ? 'H' : 'U'}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {formatNextDate(nextMatch.dateEvent, nextMatch.strTime)}
            </div>
          </div>
        )}

        {!lastMatch && !nextMatch && (
          <div className="flex-1 text-center py-3 text-xs" style={{ color: 'var(--muted)' }}>
            <div className="text-2xl mb-1">🔴</div>
            Arsenal FC
          </div>
        )}
      </div>
    </div>
  )
}
