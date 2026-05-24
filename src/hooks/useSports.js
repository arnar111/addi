import { useState, useEffect } from 'react'

// Tottenham Hotspur ESPN team ID for Premier League
const SPURS_ID = '367'
const CACHE_KEY = 'spurs_v2'
const CACHE_TTL = 20 * 60 * 1000

function processEvent(e) {
  if (!e) return null
  const comp = e.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null
  return {
    id: e.id,
    date: e.date,
    name: e.name,
    completed: comp.status?.type?.completed || false,
    statusText: comp.status?.type?.shortDetail || comp.status?.type?.description,
    home: {
      name: home.team?.shortDisplayName || home.team?.displayName,
      abbrev: home.team?.abbreviation,
      score: home.score,
      logo: home.team?.logo,
      winner: home.winner,
    },
    away: {
      name: away.team?.shortDisplayName || away.team?.displayName,
      abbrev: away.team?.abbreviation,
      score: away.score,
      logo: away.team?.logo,
      winner: away.winner,
    },
  }
}

export function useSports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/${SPURS_ID}/schedule`)
      .then(r => r.json())
      .then(d => {
        const events = d.events || []
        const now = new Date()
        const pastEvents = events.filter(e => new Date(e.date) < now)
        const futureEvents = events.filter(e => new Date(e.date) > now)
        const lastMatch = processEvent(pastEvents[pastEvents.length - 1])
        const nextMatch = processEvent(futureEvents[0])
        const teamRecord = d.team?.record?.items?.[0]

        const result = {
          team: {
            name: d.team?.displayName || 'Tottenham Hotspur',
            logo: d.team?.logo,
            color: d.team?.color || '132257',
          },
          lastMatch,
          nextMatch,
          record: teamRecord ? `${teamRecord.summary}` : null,
          season: d.season?.displayName,
        }

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
