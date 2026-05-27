import { useState, useEffect } from 'react'

// Arsenal FC — TheSportsDB team ID
const ARSENAL_ID = '133604'
const API = 'https://www.thesportsdb.com/api/v1/json/3'

function parseEvent(ev) {
  return {
    id: ev.idEvent,
    date: ev.dateEvent,
    time: ev.strTime,
    homeTeam: ev.strHomeTeam,
    awayTeam: ev.strAwayTeam,
    homeScore: ev.intHomeScore,
    awayScore: ev.intAwayScore,
    league: ev.strLeague,
    season: ev.strSeason,
    venue: ev.strVenue,
    thumb: ev.strThumb,
    homeThumb: ev.strHomeTeamBadge,
    awayThumb: ev.strAwayTeamBadge,
    status: ev.strStatus,
  }
}

export function useSports() {
  const [lastResults, setLastResults] = useState(null)
  const [nextFixtures, setNextFixtures] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('sports')
    const cachedAt = sessionStorage.getItem('sportsAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      const d = JSON.parse(cached)
      setLastResults(d.lastResults)
      setNextFixtures(d.nextFixtures)
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`${API}/eventslast.php?id=${ARSENAL_ID}`).then(r => r.json()),
      fetch(`${API}/eventsnext.php?id=${ARSENAL_ID}`).then(r => r.json()),
    ])
      .then(([last, next]) => {
        const results = (last.results || []).map(parseEvent).slice(0, 5)
        const fixtures = (next.events || []).map(parseEvent).slice(0, 3)

        const d = { lastResults: results, nextFixtures: fixtures }
        sessionStorage.setItem('sports', JSON.stringify(d))
        sessionStorage.setItem('sportsAt', String(Date.now()))
        setLastResults(results)
        setNextFixtures(fixtures)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { lastResults, nextFixtures, loading, error }
}
