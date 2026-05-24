import { useState, useEffect } from 'react'

// West Ham United — ESPN team ID 371
// Relegated to EFL Championship for 2025-26 season
const TEAM_ID = '371'
const LEAGUES = ['eng.2', 'eng.1', 'eng.fa', 'eng.league_cup']

function parseEvent(e) {
  if (!e) return null
  const comp = e.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  return {
    date: e.date,
    home: { name: home?.team?.shortDisplayName || home?.team?.abbreviation || '?', score: home?.score ?? null },
    away: { name: away?.team?.shortDisplayName || away?.team?.abbreviation || '?', score: away?.score ?? null },
    completed: comp.status?.type?.completed || false,
    status: comp.status?.type?.shortDetail || '',
    venue: comp.venue?.shortName || comp.venue?.fullName || '',
    competition: comp.conferenceCompetition ? 'Cup' : e.season?.displayName || '',
  }
}

export function useFootball() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_football')
    const cachedAt = sessionStorage.getItem('addi_footballAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    const tryLeague = async (league) => {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${TEAM_ID}/schedule?limit=10`
      )
      const json = await res.json()
      return json.events || []
    }

    const load = async () => {
      let allEvents = []
      for (const league of LEAGUES) {
        try {
          const events = await tryLeague(league)
          if (events.length > 0) {
            allEvents = [...allEvents, ...events]
            break
          }
        } catch {}
      }

      const now = new Date()
      const past = allEvents.filter(e => new Date(e.date) < now && parseEvent(e)?.completed)
      const future = allEvents.filter(e => new Date(e.date) >= now)

      const result = {
        last: parseEvent(past[past.length - 1]),
        next: parseEvent(future[0]),
        recentForm: past.slice(-5).reverse().map(e => {
          const match = parseEvent(e)
          if (!match) return null
          const isHome = match.home.name === 'WHU' || match.home.name === 'West Ham'
          const whuScore = Number(isHome ? match.home.score : match.away.score)
          const oppScore = Number(isHome ? match.away.score : match.home.score)
          return whuScore > oppScore ? 'W' : whuScore < oppScore ? 'L' : 'D'
        }).filter(Boolean),
      }

      sessionStorage.setItem('addi_football', JSON.stringify(result))
      sessionStorage.setItem('addi_footballAt', String(Date.now()))
      setData(result)
      setLoading(false)
    }

    load().catch(() => {
      setData({ last: null, next: null, recentForm: [] })
      setLoading(false)
    })
  }, [])

  return { data, loading }
}
