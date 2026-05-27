import { useState, useEffect } from 'react'

const CACHE_KEY = 'addi_football_v2'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export function useFootball() {
  const [standings, setStandings] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, ts } = JSON.parse(cached)
          if (Date.now() - ts < CACHE_DURATION) {
            setStandings(data.standings || [])
            setEvents(data.events || [])
            setLoading(false)
            return
          }
        }

        const [sRes, eRes] = await Promise.allSettled([
          fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/standings'),
          fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard')
        ])

        let standingsData = []
        let eventsData = []

        if (sRes.status === 'fulfilled' && sRes.value.ok) {
          const json = await sRes.value.json()
          // ESPN standings structure varies — flatten all entries
          const groups = json?.standings || []
          for (const group of groups) {
            if (group.entries) standingsData = [...standingsData, ...group.entries]
          }
        }

        if (eRes.status === 'fulfilled' && eRes.value.ok) {
          const json = await eRes.value.json()
          eventsData = json?.events || []
        }

        const data = { standings: standingsData, events: eventsData }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
        setStandings(standingsData)
        setEvents(eventsData)
      } catch (err) {
        setError('Ekki tókst að sækja gögn')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Helper to get stat value by name
  function getStat(entry, name) {
    return entry?.stats?.find(s => s.name === name)?.value ?? 0
  }

  const table = standings
    .map(entry => ({
      name: entry.team?.displayName || entry.team?.name || '—',
      shortName: entry.team?.abbreviation || '—',
      logo: entry.team?.logos?.[0]?.href,
      played: getStat(entry, 'gamesPlayed'),
      won: getStat(entry, 'wins'),
      drawn: getStat(entry, 'ties'),
      lost: getStat(entry, 'losses'),
      gf: getStat(entry, 'pointsFor'),
      ga: getStat(entry, 'pointsAgainst'),
      gd: getStat(entry, 'pointDifferential'),
      points: getStat(entry, 'points'),
    }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd)

  // Recent results (completed events)
  const results = events
    .filter(e => e.competitions?.[0]?.status?.type?.completed)
    .slice(0, 5)
    .map(e => {
      const comp = e.competitions[0]
      const home = comp.competitors.find(c => c.homeAway === 'home')
      const away = comp.competitors.find(c => c.homeAway === 'away')
      return {
        id: e.id,
        home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
        homeScore: home?.score || '0',
        away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
        awayScore: away?.score || '0',
        date: e.date,
        homeLogo: home?.team?.logos?.[0]?.href,
        awayLogo: away?.team?.logos?.[0]?.href,
      }
    })

  // Upcoming fixtures
  const upcoming = events
    .filter(e => !e.competitions?.[0]?.status?.type?.completed)
    .slice(0, 5)
    .map(e => {
      const comp = e.competitions[0]
      const home = comp.competitors.find(c => c.homeAway === 'home')
      const away = comp.competitors.find(c => c.homeAway === 'away')
      return {
        id: e.id,
        home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
        away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
        date: e.date,
        homeLogo: home?.team?.logos?.[0]?.href,
        awayLogo: away?.team?.logos?.[0]?.href,
      }
    })

  return { table, results, upcoming, loading, error }
}
