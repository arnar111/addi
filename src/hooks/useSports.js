import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

function isTottenham(name = '') {
  return ['tottenham', 'spurs', 'TOT'].some(n => name.toLowerCase().includes(n.toLowerCase()))
}

export function useSports() {
  const [standings, setStandings] = useState(null)
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchSports = async () => {
    setLoading(true)
    try {
      const [standRes, matchRes] = await Promise.all([
        fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings'),
        fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard'),
      ])

      const standData = await standRes.json()
      const matchData = await matchRes.json()

      const rawEntries =
        standData?.standings?.[0]?.entries ||
        standData?.children?.[0]?.standings?.[0]?.entries ||
        []

      const table = rawEntries.map(e => {
        const stat = name => e.stats?.find(s => s.name === name)?.value ?? 0
        return {
          rank: stat('rank') || 0,
          team: e.team?.displayName || '',
          short: e.team?.abbreviation || '',
          logo: e.team?.logos?.[0]?.href || null,
          id: e.team?.id || '',
          played: stat('gamesPlayed'),
          won: stat('wins'),
          drawn: stat('ties'),
          lost: stat('losses'),
          gf: stat('pointsFor'),
          ga: stat('pointsAgainst'),
          gd: stat('pointDifferential'),
          points: stat('points'),
          form: e.stats?.find(s => s.name === 'streak')?.displayValue || '',
          isTottenham:
            isTottenham(e.team?.displayName) || isTottenham(e.team?.abbreviation),
        }
      }).sort((a, b) => a.rank - b.rank)

      const games = (matchData?.events || []).map(e => {
        const comp = e.competitions?.[0]
        const home = comp?.competitors?.find(c => c.homeAway === 'home') || {}
        const away = comp?.competitors?.find(c => c.homeAway === 'away') || {}
        return {
          id: e.id,
          date: e.date,
          statusName: comp?.status?.type?.name || '',
          statusShort: comp?.status?.type?.shortDetail || '',
          clock: comp?.status?.displayClock || '',
          homeTeam: home.team?.displayName || '',
          homeShort: home.team?.abbreviation || '',
          homeScore: home.score,
          homeLogo: home.team?.logos?.[0]?.href,
          awayTeam: away.team?.displayName || '',
          awayShort: away.team?.abbreviation || '',
          awayScore: away.score,
          awayLogo: away.team?.logos?.[0]?.href,
          isTottenham:
            isTottenham(home.team?.displayName) ||
            isTottenham(away.team?.displayName),
        }
      })

      const result = { standings: table, matches: games }
      sessionStorage.setItem('addi_sports', JSON.stringify(result))
      sessionStorage.setItem('addi_sportsAt', String(Date.now()))
      setStandings(table)
      setMatches(games)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_sports')
    const cachedAt = sessionStorage.getItem('addi_sportsAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      const data = JSON.parse(cached)
      setStandings(data.standings)
      setMatches(data.matches)
      setLastUpdated(new Date(Number(cachedAt)))
      setLoading(false)
      return
    }
    fetchSports()
  }, [])

  return { standings, matches, loading, error, lastUpdated, refresh: fetchSports }
}
