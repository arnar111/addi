import { useState, useEffect } from 'react'

export function useFootball() {
  const [scores, setScores] = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = (force = false) => {
    const cacheKey = 'addi_football'
    const cacheAt = 'addi_football_at'
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(cacheAt)

    if (!force && cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const data = JSON.parse(cached)
      setScores(data.scores)
      setStandings(data.standings)
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all([
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard').then(r => r.json()),
      fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings').then(r => r.json()),
    ])
      .then(([scoreData, standData]) => {
        const events = scoreData.events || []
        const parsedScores = events.map(e => {
          const comp = e.competitions?.[0]
          const home = comp?.competitors?.find(c => c.homeAway === 'home')
          const away = comp?.competitors?.find(c => c.homeAway === 'away')
          if (!home || !away) return null
          return {
            id: e.id,
            date: e.date,
            status: e.status?.type?.description || '',
            statusShort: e.status?.type?.shortDetail || '',
            completed: e.status?.type?.completed || false,
            live: e.status?.type?.state === 'in',
            home: { name: home.team?.shortDisplayName || home.team?.displayName, score: home.score, logo: home.team?.logo },
            away: { name: away.team?.shortDisplayName || away.team?.displayName, score: away.score, logo: away.team?.logo },
          }
        }).filter(Boolean)

        const entries = standData.standings?.entries || []
        const parsedStandings = entries.map(e => {
          const stats = {}
          e.stats?.forEach(s => { stats[s.name] = s.value })
          return {
            rank: Math.round(stats.rank || 0),
            team: e.team?.shortDisplayName || e.team?.displayName,
            logo: e.team?.logos?.[0]?.href,
            played: Math.round(stats.gamesPlayed || 0),
            won: Math.round(stats.wins || 0),
            drawn: Math.round(stats.ties || 0),
            lost: Math.round(stats.losses || 0),
            gd: Math.round(stats.pointDifferential || 0),
            points: Math.round(stats.points || 0),
          }
        }).sort((a, b) => a.rank - b.rank)

        const data = { scores: parsedScores, standings: parsedStandings }
        sessionStorage.setItem(cacheKey, JSON.stringify(data))
        sessionStorage.setItem(cacheAt, String(Date.now()))
        setScores(parsedScores)
        setStandings(parsedStandings)
        setError(null)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(() => { fetchData() }, [])

  return { scores, standings, loading, error, refresh: () => fetchData(true) }
}
