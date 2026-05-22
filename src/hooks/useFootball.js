import { useState, useEffect, useCallback } from 'react'

function parseMatches(data) {
  return (data.events || []).map(e => {
    const comp = e.competitions?.[0]
    const home = comp?.competitors?.find(c => c.homeAway === 'home')
    const away = comp?.competitors?.find(c => c.homeAway === 'away')
    return {
      id: e.id,
      date: e.date,
      status: e.status?.type?.name || 'STATUS_SCHEDULED',
      displayClock: e.status?.displayClock || '',
      displayDetail: e.status?.type?.shortDetail || '',
      home: {
        name: home?.team?.shortDisplayName || home?.team?.displayName || '?',
        abbreviation: home?.team?.abbreviation || '',
        score: home?.score ?? '',
        logo: home?.team?.logo || '',
        winner: home?.winner || false,
      },
      away: {
        name: away?.team?.shortDisplayName || away?.team?.displayName || '?',
        abbreviation: away?.team?.abbreviation || '',
        score: away?.score ?? '',
        logo: away?.team?.logo || '',
        winner: away?.winner || false,
      },
    }
  })
}

export function useFootball() {
  const [todayMatches, setTodayMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  const fetchMatches = useCallback(async (force = false) => {
    const cacheKey = 'football_today'
    const cacheTimeKey = 'football_today_at'

    if (!force) {
      const cached = sessionStorage.getItem(cacheKey)
      const cachedAt = sessionStorage.getItem(cacheTimeKey)
      if (cached && cachedAt) {
        const parsed = JSON.parse(cached)
        const hasLive = parsed.some(m => m.status === 'STATUS_IN_PROGRESS')
        const maxAge = hasLive ? 30000 : 5 * 60 * 1000
        if (Date.now() - Number(cachedAt) < maxAge) {
          setTodayMatches(parsed)
          setLoading(false)
          return
        }
      }
    }

    try {
      const res = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
        { signal: AbortSignal.timeout(8000) }
      )
      const data = await res.json()
      const matches = parseMatches(data)
      sessionStorage.setItem(cacheKey, JSON.stringify(matches))
      sessionStorage.setItem(cacheTimeKey, String(Date.now()))
      setTodayMatches(matches)
      setUpdatedAt(new Date())
      setError(null)
    } catch {
      setError('Gat ekki sótt leikjakynningar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
    const interval = setInterval(() => fetchMatches(), 60000)
    return () => clearInterval(interval)
  }, [fetchMatches])

  const isLiverpool = (name) =>
    name && (name.toLowerCase().includes('liverpool') || name.toLowerCase() === 'liv')

  const liveMatches = todayMatches.filter(m => m.status === 'STATUS_IN_PROGRESS')
  const finishedMatches = todayMatches.filter(m => m.status === 'STATUS_FINAL')
  const scheduledMatches = todayMatches.filter(m => m.status === 'STATUS_SCHEDULED')
  const liverpoolMatch = todayMatches.find(m =>
    isLiverpool(m.home.name) || isLiverpool(m.away.name)
  )

  return {
    todayMatches,
    liveMatches,
    finishedMatches,
    scheduledMatches,
    liverpoolMatch,
    loading,
    error,
    updatedAt,
    refresh: () => {
      sessionStorage.removeItem('football_today')
      sessionStorage.removeItem('football_today_at')
      fetchMatches(true)
    },
  }
}
