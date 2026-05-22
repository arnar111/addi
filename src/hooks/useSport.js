import { useState, useEffect } from 'react'

function cacheKey(league) { return `sport_${league}` }
const TTL = 5 * 60 * 1000

function parseEvents(d) {
  return (d.events || []).map(e => {
    const comp = e.competitions?.[0]
    const home = comp?.competitors?.find(c => c.homeAway === 'home')
    const away = comp?.competitors?.find(c => c.homeAway === 'away')
    return {
      id: e.id,
      name: e.name,
      date: e.date,
      status: e.status?.type?.name,
      statusShort: e.status?.type?.shortDetail,
      clock: e.status?.displayClock,
      period: e.status?.period,
      home: {
        name: home?.team?.shortDisplayName || home?.team?.displayName,
        logo: home?.team?.logo,
        score: home?.score,
      },
      away: {
        name: away?.team?.shortDisplayName || away?.team?.displayName,
        logo: away?.team?.logo,
        score: away?.score,
      },
      venue: comp?.venue?.fullName,
    }
  })
}

export function useSport(league = 'eng.1') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  const fetchData = () => {
    const key = cacheKey(league)
    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const evts = parseEvents(d)
        sessionStorage.setItem(key, JSON.stringify(evts))
        sessionStorage.setItem(`${key}_at`, String(Date.now()))
        setEvents(evts)
        setLastFetch(new Date())
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    const key = cacheKey(league)
    const cachedAt = sessionStorage.getItem(`${key}_at`)
    const cached = sessionStorage.getItem(key)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < TTL) {
      setEvents(JSON.parse(cached))
      setLastFetch(new Date(Number(cachedAt)))
      setLoading(false)
      return
    }
    fetchData()
  }, [league])

  return { events, loading, error, refetch: fetchData, lastFetch }
}

export function useStandings(league = 'eng.1') {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = `standings_${league}`
    const cachedAt = sessionStorage.getItem(`${key}_at`)
    const cached = sessionStorage.getItem(key)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setStandings(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings`)
      .then(r => r.json())
      .then(d => {
        const entries = d.standings?.[0]?.entries || []
        const rows = entries.map(e => ({
          rank: e.stats?.find(s => s.name === 'rank')?.value,
          team: e.team?.shortDisplayName || e.team?.displayName,
          logo: e.team?.logos?.[0]?.href,
          gp: e.stats?.find(s => s.name === 'gamesPlayed')?.value,
          w: e.stats?.find(s => s.name === 'wins')?.value,
          d: e.stats?.find(s => s.name === 'ties')?.value,
          l: e.stats?.find(s => s.name === 'losses')?.value,
          gf: e.stats?.find(s => s.name === 'pointsFor')?.value,
          ga: e.stats?.find(s => s.name === 'pointsAgainst')?.value,
          gd: e.stats?.find(s => s.name === 'pointDifferential')?.value,
          pts: e.stats?.find(s => s.name === 'points')?.value,
        }))
        sessionStorage.setItem(key, JSON.stringify(rows))
        sessionStorage.setItem(`${key}_at`, String(Date.now()))
        setStandings(rows)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [league])

  return { standings, loading }
}
