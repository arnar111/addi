import { useState, useEffect, useCallback } from 'react'

export const LEAGUES = [
  { id: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'PL' },
  { id: 'UEFA.CHAMPIONS', name: 'Champions League', flag: '⭐', short: 'UCL' },
  { id: 'FIFA.WORLD', name: 'World Cup 2026', flag: '🌍', short: 'WC26' },
  { id: 'usa.1', name: 'MLS', flag: '🇺🇸', short: 'MLS' },
]

function parseEvent(e) {
  const comp = e.competitions?.[0]
  if (!comp) return null
  const competitors = comp.competitors || []
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0]
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1]
  if (!home || !away) return null
  const statusName = e.status?.type?.name || 'STATUS_SCHEDULED'
  return {
    id: e.id,
    name: e.name,
    date: e.date,
    statusName,
    detail: e.status?.type?.shortDetail || '',
    isLive: statusName === 'STATUS_IN_PROGRESS',
    isFinal: statusName === 'STATUS_FINAL',
    isScheduled: statusName === 'STATUS_SCHEDULED',
    home: {
      name: home.team?.shortDisplayName || home.team?.displayName || '?',
      abbr: home.team?.abbreviation || '?',
      score: home.score ?? '-',
      logo: home.team?.logo || '',
      winner: home.winner,
    },
    away: {
      name: away.team?.shortDisplayName || away.team?.displayName || '?',
      abbr: away.team?.abbreviation || '?',
      score: away.score ?? '-',
      logo: away.team?.logo || '',
      winner: away.winner,
    },
  }
}

export function useSports(leagueId = 'eng.1') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    const key = `sports_${leagueId}`
    const atKey = `sportsAt_${leagueId}`
    const cached = sessionStorage.getItem(key)
    const cachedAt = sessionStorage.getItem(atKey)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setEvents(JSON.parse(cached))
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then(d => {
        const parsed = (d.events || []).map(parseEvent).filter(Boolean)
        sessionStorage.setItem(key, JSON.stringify(parsed))
        sessionStorage.setItem(atKey, String(Date.now()))
        setEvents(parsed)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [leagueId])

  useEffect(() => { load() }, [load])

  return { events, loading, error, refresh: load }
}
