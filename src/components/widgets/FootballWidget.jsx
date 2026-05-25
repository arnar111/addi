import { useFootball } from '../../hooks/useFootball'
import { ExternalLink } from 'lucide-react'

const RESULT_COLORS = { W: '#22c55e', D: '#f97316', L: '#ef4444' }

function FormDot({ event, teamName, shortName }) {
  const isHome = event.strHomeTeam === teamName || event.strHomeTeam?.includes(shortName)
  const myScore = parseInt(isHome ? event.intHomeScore : event.intAwayScore) || 0
  const oppScore = parseInt(isHome ? event.intAwayScore : event.intHomeScore) || 0
  const r = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D'
  return (
    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: RESULT_COLORS[r] + '25', color: RESULT_COLORS[r] }}>
      {r}
    </span>
  )
}

export default function FootballWidget() {
  const { results, loading } = useFootball()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-4 w-20 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2].map(i => (
          <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />
        ))}
      </div>
    </div>
  )

  if (!results.length) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <h3 className="font-semibold text-sm">Fótbolti</h3>
        </div>
        <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          The Athletic <ExternalLink size={10} />
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {results.map(({ team, events }) => {
          if (!events.length) return null
          const last = events[events.length - 1]
          const isHome = last.strHomeTeam === team.name || last.strHomeTeam?.includes(team.shortName)
          const opponent = (isHome ? last.strAwayTeam : last.strHomeTeam) || ''
          const myScore = parseInt(isHome ? last.intHomeScore : last.intAwayScore) || 0
          const oppScore = parseInt(isHome ? last.intAwayScore : last.intHomeScore) || 0
          const r = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D'
          const last5 = events.slice(-5)

          return (
            <div key={team.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">{team.shortName}</div>
                <div className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
                  {isHome ? 'vs' : '@'} {opponent.replace(' FC', '').replace(' United', ' Utd').slice(0, 16)}
                  {' · '}
                  <span style={{ color: RESULT_COLORS[r], fontWeight: 600 }}>
                    {myScore}–{oppScore}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {last5.map((e, i) => (
                  <FormDot key={i} event={e} teamName={team.name} shortName={team.shortName} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mt-3">
        <a href="https://www.transfermarkt.com/arnar-kjartansson/profil/spieler/226789"
           target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
           style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          🇮🇸 Arnar Kjartansson
        </a>
        <a href="https://www.premierleague.com/tables"
           target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
           style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          PL tafla
        </a>
      </div>
    </div>
  )
}
