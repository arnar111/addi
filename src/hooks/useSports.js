import { useState, useEffect } from 'react'

const TTL = 3 * 60 * 1000

async function cfetch(key, url) {
  const s = sessionStorage.getItem(key)
  const t = sessionStorage.getItem(key + '_t')
  if (s && t && Date.now() - +t < TTL) return JSON.parse(s)
  const d = await fetch(url).then(r => r.json())
  sessionStorage.setItem(key, JSON.stringify(d))
  sessionStorage.setItem(key + '_t', Date.now().toString())
  return d
}

function parseGame(ev) {
  const comp = ev.competitions?.[0]
  const teams = comp?.competitors?.map(c => ({
    name: c.team.shortDisplayName || c.team.displayName,
    abbrev: c.team.abbreviation,
    score: c.score || '0',
    winner: c.winner || false,
    homeAway: c.homeAway,
    logo: c.team.logo || c.team.logos?.[0]?.href,
  })) || []
  const state = ev.status?.type?.state
  return {
    id: ev.id,
    name: ev.name,
    shortName: ev.shortName,
    date: ev.date,
    status: ev.status?.type?.description || 'Scheduled',
    detail: ev.status?.type?.detail || '',
    clock: ev.status?.displayClock || '',
    period: ev.status?.period || 0,
    isLive: state === 'in',
    isFinal: state === 'post',
    isPre: state === 'pre',
    teams,
    note: comp?.notes?.[0]?.headline || comp?.series?.summary || '',
    venue: comp?.venue?.fullName || '',
    seriesInfo: comp?.series || null,
  }
}

export function useSports() {
  const [nba, setNba] = useState([])
  const [serie, setSerie] = useState([])
  const [worldCup, setWorldCup] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = () => {
    // Clear cache to force fresh fetch
    ['s_nba', 's_serie', 's_wc'].forEach(k => {
      sessionStorage.removeItem(k)
      sessionStorage.removeItem(k + '_t')
    })
    setLoading(true)
    fetchAll()
  }

  const fetchAll = () => {
    Promise.all([
      cfetch('s_nba', 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard'),
      cfetch('s_serie', 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard'),
      cfetch('s_wc', 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard'),
    ])
      .then(([nbaData, serieData, wcData]) => {
        setNba((nbaData.events || []).map(parseGame))
        setSerie((serieData.events || []).map(parseGame))
        setWorldCup((wcData.events || []).map(parseGame))
        setError(null)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const interGames = serie.filter(g =>
    g.teams.some(t =>
      t.name.toLowerCase().includes('inter') ||
      t.abbrev?.toUpperCase() === 'INT' ||
      t.name.toLowerCase().includes('internazionale')
    )
  )

  // Most relevant NBA game (live first, then most recent final, then upcoming)
  const topNbaGame = nba.find(g => g.isLive)
    || nba.find(g => g.isFinal)
    || nba[0]

  const topInterGame = interGames.find(g => g.isLive)
    || interGames.find(g => g.isFinal)
    || interGames[0]

  return { nba, serie, interGames, worldCup, topNbaGame, topInterGame, loading, error, refresh }
}
