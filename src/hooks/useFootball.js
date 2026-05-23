import { useState, useEffect } from 'react'

export const FOOTBALL_LEAGUES = {
  'eng.1': 'Premier League',
  'uefa.champions': 'Meistarabikar',
  'fifa.world': 'Heimsmeistaramót',
}

export function useFootball(leagueId = 'eng.1') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cacheKey = `football_${leagueId}`
    const cacheAtKey = `${cacheKey}_at`
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(cacheAtKey)

    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).map(e => {
          const comp = e.competitions?.[0]
          const home = comp?.competitors?.find(c => c.homeAway === 'home')
          const away = comp?.competitors?.find(c => c.homeAway === 'away')
          const status = comp?.status
          return {
            id: e.id,
            date: e.date,
            home: {
              id: home?.team?.id,
              name: home?.team?.shortDisplayName || home?.team?.displayName || '?',
              fullName: home?.team?.displayName || '?',
              score: home?.score ?? '',
              logo: home?.team?.logo || null,
              winner: home?.winner || false,
            },
            away: {
              id: away?.team?.id,
              name: away?.team?.shortDisplayName || away?.team?.displayName || '?',
              fullName: away?.team?.displayName || '?',
              score: away?.score ?? '',
              logo: away?.team?.logo || null,
              winner: away?.winner || false,
            },
            status: {
              state: status?.type?.state || 'pre',
              clock: status?.displayClock || '',
              period: status?.period || 0,
              detail: status?.type?.shortDetail || '',
              completed: status?.type?.completed || false,
            },
            venue: comp?.venue?.fullName || '',
          }
        })
        const result = {
          events,
          league: FOOTBALL_LEAGUES[leagueId] || leagueId,
          leagueId,
          day: d.day?.date || '',
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(result))
        sessionStorage.setItem(cacheAtKey, String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [leagueId])

  const refetch = () => {
    sessionStorage.removeItem(`football_${leagueId}`)
    sessionStorage.removeItem(`football_${leagueId}_at`)
    setLoading(true)
    setData(null)
  }

  return { data, loading, error, refetch }
}
