import { useState, useEffect } from 'react'

const PL_LEAGUE_ID = 4328
const CACHE_KEY = 'addi_football_cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function useFootball() {
  const [upcoming, setUpcoming] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_TTL) {
          setUpcoming(data.upcoming || [])
          setResults(data.results || [])
          setLoading(false)
          return
        }
      }
    } catch {}

    const fetchData = async () => {
      try {
        const [nextRes, pastRes] = await Promise.all([
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${PL_LEAGUE_ID}`),
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${PL_LEAGUE_ID}`)
        ])

        const nextData = await nextRes.json()
        const pastData = await pastRes.json()

        const upcomingEvents = (nextData.events || []).slice(0, 5).map(e => ({
          id: e.idEvent,
          homeTeam: e.strHomeTeam,
          awayTeam: e.strAwayTeam,
          homeBadge: e.strHomeTeamBadge ? e.strHomeTeamBadge + '/tiny' : null,
          awayBadge: e.strAwayTeamBadge ? e.strAwayTeamBadge + '/tiny' : null,
          date: e.dateEvent,
          time: e.strTime ? e.strTime.slice(0, 5) : null,
          venue: e.strVenue,
          round: e.intRound,
        }))

        const pastEvents = (pastData.events || [])
          .slice(-6)
          .reverse()
          .map(e => ({
            id: e.idEvent,
            homeTeam: e.strHomeTeam,
            awayTeam: e.strAwayTeam,
            homeScore: e.intHomeScore,
            awayScore: e.intAwayScore,
            homeBadge: e.strHomeTeamBadge ? e.strHomeTeamBadge + '/tiny' : null,
            awayBadge: e.strAwayTeamBadge ? e.strAwayTeamBadge + '/tiny' : null,
            date: e.dateEvent,
          }))

        setUpcoming(upcomingEvents)
        setResults(pastEvents)

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: { upcoming: upcomingEvents, results: pastEvents },
            timestamp: Date.now()
          }))
        } catch {}
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { upcoming, results, loading, error }
}
