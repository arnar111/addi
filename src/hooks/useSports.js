import { useState, useEffect } from 'react'

export const LEAGUES = {
  PL:  { name: 'Premier League',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', espn: 'soccer/eng.1' },
  UCL: { name: 'Champions League', flag: '⭐',             espn: 'soccer/uefa.champions' },
  MLS: { name: 'MLS',              flag: '🇺🇸',            espn: 'soccer/usa.1' },
  ISL: { name: 'Úrvalsdeild',      flag: '🇮🇸',            espn: 'soccer/isl.1' },
}

function parseEvent(e) {
  const comp = e.competitions?.[0]
  const home = comp?.competitors?.find(c => c.homeAway === 'home')
  const away = comp?.competitors?.find(c => c.homeAway === 'away')
  return {
    id: e.id,
    name: e.name,
    date: e.date,
    statusType: e.status?.type?.name,
    statusDetail: e.status?.type?.shortDetail,
    isLive: e.status?.type?.name === 'STATUS_IN_PROGRESS',
    isFinal: e.status?.type?.name === 'STATUS_FINAL',
    home: {
      name: home?.team?.shortDisplayName || home?.team?.displayName || '?',
      score: home?.score ?? '-',
      logo: home?.team?.logo,
      winner: home?.winner,
    },
    away: {
      name: away?.team?.shortDisplayName || away?.team?.displayName || '?',
      score: away?.score ?? '-',
      logo: away?.team?.logo,
      winner: away?.winner,
    },
    venue: comp?.venue?.fullName,
  }
}

export function useSports(leagueKey = 'PL') {
  const league = LEAGUES[leagueKey]
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!league) return
    setLoading(true)
    setError(null)

    const cacheKey = `sports_${leagueKey}`
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
    if (cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }
    }

    fetch(`/api/espn/${league.espn}/scoreboard`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        const events = (d.events || []).map(parseEvent)
        const result = {
          events,
          leagueName: d.leagues?.[0]?.name || league.name,
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(result))
        sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [leagueKey])

  return { data, loading, error }
}
