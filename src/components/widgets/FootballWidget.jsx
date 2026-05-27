import { useState, useEffect } from 'react'

// Arsenal's ESPN ID in Premier League (eng.1)
const ARSENAL_ESPN_ID = '359'

function ScoreBlock({ game }) {
  if (!game) return null
  const home = game.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home')
  const away = game.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null

  const isArsenal = team => team.team?.id === ARSENAL_ESPN_ID || team.team?.abbreviation === 'ARS'
  const arsenalSide = isArsenal(home) ? 'home' : 'away'
  const completed = game.status?.type?.completed
  const inProgress = game.status?.type?.state === 'in'

  const homeScore = home.score
  const awayScore = away.score

  let resultBg = 'var(--surface2)'
  if (completed) {
    const aScore = arsenalSide === 'home' ? Number(homeScore) : Number(awayScore)
    const oScore = arsenalSide === 'home' ? Number(awayScore) : Number(homeScore)
    if (aScore > oScore) resultBg = 'rgba(34,197,94,0.12)'
    else if (aScore < oScore) resultBg = 'rgba(239,68,68,0.12)'
    else resultBg = 'rgba(100,116,139,0.12)'
  }

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: resultBg }}>
      {/* Home */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {home.team?.logo && <img src={home.team.logo} alt="" className="w-5 h-5 object-contain" />}
        <span className={`text-xs font-medium truncate ${isArsenal(home) ? 'text-red-400' : ''}`}
              style={{ color: isArsenal(home) ? '#ef4444' : 'var(--text)' }}>
          {home.team?.abbreviation || home.team?.shortDisplayName}
        </span>
      </div>

      {/* Score or time */}
      <div className="flex items-center gap-1 shrink-0">
        {completed || inProgress ? (
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold tabular-nums">{homeScore || '0'}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-sm font-bold tabular-nums">{awayScore || '0'}</span>
            {inProgress && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />}
          </div>
        ) : (
          <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
            {game.date ? new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) : 'vs'}
          </span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className={`text-xs font-medium truncate`}
              style={{ color: isArsenal(away) ? '#ef4444' : 'var(--text)' }}>
          {away.team?.abbreviation || away.team?.shortDisplayName}
        </span>
        {away.team?.logo && <img src={away.team.logo} alt="" className="w-5 h-5 object-contain" />}
      </div>
    </div>
  )
}

export default function FootballWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [standing, setStanding] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('football_data')
    const cachedAt = sessionStorage.getItem('football_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
    } else {
      // Fetch PL scoreboard (recent + upcoming)
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard')
        .then(r => r.json())
        .then(d => {
          const events = d.events || []
          // Filter for Arsenal games in the events
          const arsenalGames = events.filter(e =>
            e.competitions?.[0]?.competitors?.some(c =>
              c.team?.id === ARSENAL_ESPN_ID || c.team?.abbreviation === 'ARS'
            )
          )
          sessionStorage.setItem('football_data', JSON.stringify({ events, arsenalGames }))
          sessionStorage.setItem('football_at', String(Date.now()))
          setData({ events, arsenalGames })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    // Fetch Arsenal standings
    fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings')
      .then(r => r.json())
      .then(d => {
        const entries = d.children?.[0]?.standings?.entries || []
        const arsenalEntry = entries.find(e =>
          e.team?.id === ARSENAL_ESPN_ID || e.team?.abbreviation === 'ARS'
        )
        if (arsenalEntry) {
          const stats = arsenalEntry.stats || []
          const getStat = (name) => stats.find(s => s.name === name)?.value || 0
          setStanding({
            rank: arsenalEntry.note?.rank || entries.indexOf(arsenalEntry) + 1,
            points: getStat('points'),
            wins: getStat('wins'),
            draws: getStat('ties'),
            losses: getStat('losses'),
            gf: getStat('pointsFor'),
            ga: getStat('pointsAgainst'),
          })
        }
      })
      .catch(() => {})
  }, [])

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3">
      <div className="w-10 h-10 rounded-full" style={{ background: 'var(--surface2)' }} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-16 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  const arsenalGames = data?.arsenalGames || []
  const recentGame = arsenalGames.find(e => e.status?.type?.completed) ||
                     arsenalGames[arsenalGames.length - 1]
  const nextGame = arsenalGames.find(e => !e.status?.type?.completed)

  // If no Arsenal games in today's scoreboard, show a placeholder
  if (!recentGame && !nextGame) return (
    <div className="card flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'rgba(239,68,68,0.12)' }}>
        🔴
      </div>
      <div>
        <div className="text-sm font-medium">Arsenal · Premier League</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {standing ? `${standing.rank}. sæti · ${standing.points} stig` : 'Engin leikur í dag'}
        </div>
      </div>
      {standing && (
        <div className="ml-auto text-right">
          <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>#{standing.rank}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{standing.points}p</div>
        </div>
      )}
    </div>
  )

  return (
    <div className="card flex flex-col gap-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">🔴</span>
          <span className="text-sm font-semibold">Arsenal · PL</span>
          {standing && (
            <span className="badge text-xs" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              #{standing.rank} · {standing.points}p
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {standing ? `${standing.wins}V ${standing.draws}J ${standing.losses}T` : 'EPL 2025/26'}
        </span>
      </div>

      {recentGame && (
        <div className="flex flex-col gap-1">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {recentGame.status?.type?.completed ? 'Síðasti leikur' : 'Í gangi'}
          </div>
          <ScoreBlock game={recentGame} />
        </div>
      )}

      {nextGame && nextGame !== recentGame && (
        <div className="flex flex-col gap-1">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Næsti leikur · {new Date(nextGame.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <ScoreBlock game={nextGame} />
        </div>
      )}
    </div>
  )
}
