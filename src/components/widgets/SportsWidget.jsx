import { useSports } from '../../hooks/useSports'
import { Trophy } from 'lucide-react'

function scoreLine(event, teamName) {
  const h = event.strHomeTeam
  const a = event.strAwayTeam
  const hs = event.intHomeScore
  const as_ = event.intAwayScore
  if (hs === null || hs === undefined || hs === '') return null
  return { home: h, away: a, homeScore: hs, awayScore: as_ }
}

function matchResult(event, teamName) {
  const line = scoreLine(event, teamName)
  if (!line) return null
  const isHome = line.home === teamName
  const myScore = isHome ? Number(line.homeScore) : Number(line.awayScore)
  const oppScore = isHome ? Number(line.awayScore) : Number(line.homeScore)
  if (myScore > oppScore) return 'W'
  if (myScore < oppScore) return 'L'
  return 'D'
}

export default function SportsWidget() {
  const { fixtures, results, teams, loading } = useSports()

  if (loading) {
    return (
      <div className="card flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,170,0.12)' }}>
          <Trophy size={16} style={{ color: 'var(--accent)' }} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Íþróttir</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Hleður leikjum...</div>
        </div>
      </div>
    )
  }

  const allFixtures = Object.entries(teams).flatMap(([key, team]) =>
    (fixtures[key] || []).slice(0, 1).map(ev => ({ ...ev, _teamKey: key, _team: team }))
  )
  const sorted = allFixtures.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent))

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={14} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Næstu leikir</span>
        </div>
        <a href="#/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Sjá meira</a>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.slice(0, 3).map(ev => {
          const date = new Date(ev.dateEvent + (ev.strTime ? 'T' + ev.strTime : ''))
          const dayStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
          const timeStr = ev.strTime ? ev.strTime.slice(0, 5) : ''
          const isHome = ev.strHomeTeam === ev._team.name
          const opp = isHome ? ev.strAwayTeam : ev.strHomeTeam
          const res = results[ev._teamKey]?.[0]

          return (
            <div key={ev.idEvent} className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ev._team.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {ev._team.short} vs {opp.replace(/.*?(\w+\s*\w*$)/, '$1').slice(-12)}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{ev.strLeague?.slice(0, 20)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium">{dayStr}</div>
                {timeStr && <div className="text-xs" style={{ color: 'var(--muted)' }}>{timeStr}</div>}
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engir leikir fundust</div>
        )}
      </div>
    </div>
  )
}
