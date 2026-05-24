import { useState, useEffect } from 'react'

const LEAGUES = [
  { id: 'eng.1', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'eng.2', label: 'Championship', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'uefa.champions', label: 'Champions League', flag: '⭐' },
]

function parseScoreboard(data) {
  if (!data?.events) return []
  return data.events.slice(0, 8).map(ev => {
    const comps = ev.competitions?.[0]
    const home = comps?.competitors?.find(c => c.homeAway === 'home')
    const away = comps?.competitors?.find(c => c.homeAway === 'away')
    const status = comps?.status?.type
    return {
      id: ev.id,
      home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
      away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
      homeScore: home?.score ?? null,
      awayScore: away?.score ?? null,
      status: status?.state,
      statusDesc: status?.shortDetail || status?.description || '',
      date: ev.date,
    }
  })
}

export function useSports(leagueId = 'eng.1') {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = `sports_${leagueId}`
    const cachedAt = sessionStorage.getItem(`${key}_at`)
    const cached = sessionStorage.getItem(key)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setScores(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const result = parseScoreboard(d)
        sessionStorage.setItem(key, JSON.stringify(result))
        sessionStorage.setItem(`${key}_at`, String(Date.now()))
        setScores(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [leagueId])

  return { scores, loading }
}

export { LEAGUES }
