import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

export function useNBAScores() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('nba_scores')
    const cachedAt = sessionStorage.getItem('nba_scores_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      setGames(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')
      .then(r => r.json())
      .then(d => {
        const events = d.events || []
        const parsed = events.map(e => {
          const comp = e.competitions?.[0]
          if (!comp) return null
          const home = comp.competitors?.find(c => c.homeAway === 'home')
          const away = comp.competitors?.find(c => c.homeAway === 'away')
          return {
            id: e.id,
            name: e.name,
            status: e.status?.type?.description || '',
            state: e.status?.type?.state || 'pre',
            clock: e.status?.displayClock,
            period: e.status?.period,
            homeTeam: home?.team?.displayName || '',
            homeAbbr: home?.team?.abbreviation || '',
            homeLogo: home?.team?.logo || '',
            homeScore: home?.score || '0',
            homeWinner: home?.winner,
            awayTeam: away?.team?.displayName || '',
            awayAbbr: away?.team?.abbreviation || '',
            awayLogo: away?.team?.logo || '',
            awayScore: away?.score || '0',
            awayWinner: away?.winner,
            date: e.date,
            isKnicks: (home?.team?.displayName || '').includes('Knicks') ||
                      (away?.team?.displayName || '').includes('Knicks'),
          }
        }).filter(Boolean)

        const knicks = parsed.filter(g => g.isKnicks)
        const result = knicks.length > 0 ? knicks : parsed.slice(0, 4)

        sessionStorage.setItem('nba_scores', JSON.stringify(result))
        sessionStorage.setItem('nba_scores_at', String(Date.now()))
        setGames(result)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { games, loading, error }
}
