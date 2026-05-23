import { useState, useEffect } from 'react'

function parseMatches(events = []) {
  return events.map(e => {
    const comp = e.competitions?.[0]
    if (!comp) return null
    const home = comp.competitors?.find(c => c.homeAway === 'home')
    const away = comp.competitors?.find(c => c.homeAway === 'away')
    if (!home || !away) return null
    return {
      id: e.id,
      name: e.name,
      date: e.date,
      state: comp.status?.type?.state || 'pre',
      statusDesc: comp.status?.type?.shortDetail || '',
      home: {
        id: home.team?.id,
        name: home.team?.shortDisplayName || home.team?.displayName,
        abbr: home.team?.abbreviation,
        logo: home.team?.logo,
        score: home.score ?? null,
        winner: home.winner,
      },
      away: {
        id: away.team?.id,
        name: away.team?.shortDisplayName || away.team?.displayName,
        abbr: away.team?.abbreviation,
        logo: away.team?.logo,
        score: away.score ?? null,
        winner: away.winner,
      },
    }
  }).filter(Boolean)
}

function parseStandings(data) {
  try {
    const entries = data?.children?.[0]?.standings?.entries || []
    return entries.map(e => {
      const stat = (name) => e.stats?.find(s => s.name === name)?.value ?? 0
      return {
        rank: stat('rank'),
        team: e.team?.shortDisplayName || e.team?.displayName,
        abbr: e.team?.abbreviation,
        logo: e.team?.logo,
        gp: stat('gamesPlayed'),
        w: stat('wins'),
        d: stat('ties'),
        l: stat('losses'),
        gd: stat('pointDifferential'),
        pts: stat('points'),
      }
    }).sort((a, b) => a.rank - b.rank)
  } catch {
    return []
  }
}

export function useSports() {
  const [plMatches, setPlMatches] = useState([])
  const [plStandings, setPlStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cacheKey = 'addi_sports_v3'
    const cacheAtKey = 'addi_sports_v3_at'
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(cacheAtKey)

    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const d = JSON.parse(cached)
      setPlMatches(d.matches || [])
      setPlStandings(d.standings || [])
      setLoading(false)
      return
    }

    const LEAGUE = 'eng.1'
    Promise.allSettled([
      fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}/scoreboard`).then(r => r.json()),
      fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}/standings`).then(r => r.json()),
    ]).then(([mRes, sRes]) => {
      const matches = mRes.status === 'fulfilled' ? parseMatches(mRes.value.events) : []
      const standings = sRes.status === 'fulfilled' ? parseStandings(sRes.value) : []
      const data = { matches, standings }
      sessionStorage.setItem(cacheKey, JSON.stringify(data))
      sessionStorage.setItem(cacheAtKey, String(Date.now()))
      setPlMatches(matches)
      setPlStandings(standings)
      setLoading(false)
    })
  }, [])

  return { plMatches, plStandings, loading }
}
