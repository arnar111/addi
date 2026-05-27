import { useState, useEffect } from 'react'

// ESPN public API — no key needed
const ESPN_PL = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/scoreboard'
const ESPN_STANDINGS = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings'

function parseEvent(ev) {
  const comp = ev.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  const status = ev.status?.type
  return {
    id: ev.id,
    date: ev.date,
    homeTeam: home?.team?.shortDisplayName || home?.team?.displayName || '?',
    homeLogo: home?.team?.logo,
    homeScore: home?.score ?? null,
    awayTeam: away?.team?.shortDisplayName || away?.team?.displayName || '?',
    awayLogo: away?.team?.logo,
    awayScore: away?.score ?? null,
    statusCode: status?.id,   // '1' scheduled, '2' in progress, '3' final
    statusName: status?.shortDetail || status?.description || '',
    clock: ev.status?.displayClock,
    period: ev.status?.period,
    isLive: status?.id === '2',
    isFinished: status?.id === '3',
  }
}

export function useFootball() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMatches = async () => {
    try {
      const res = await fetch(ESPN_PL)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      const events = (data.events || []).map(parseEvent).filter(Boolean)
      setMatches(events)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
    // Refresh every 60 seconds when live matches exist
    const interval = setInterval(fetchMatches, 60000)
    return () => clearInterval(interval)
  }, [])

  const liveMatches = matches.filter(m => m.isLive)
  const finishedMatches = matches.filter(m => m.isFinished)
  const upcomingMatches = matches.filter(m => !m.isLive && !m.isFinished)

  return { matches, liveMatches, finishedMatches, upcomingMatches, loading, error, lastUpdated, refetch: fetchMatches }
}
