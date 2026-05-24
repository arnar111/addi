import { useState, useEffect } from 'react'

const SPURS_ID = '33591'
const PL_LEAGUE_ID = '4328'
const PL_SEASON = '2025-2026'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('fetch failed')
  return res.json()
}

export function usePremierLeague() {
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cacheKey = 'addi_pl_table'
    const cacheAt = 'addi_pl_table_at'
    const cached = sessionStorage.getItem(cacheKey)
    const at = sessionStorage.getItem(cacheAt)
    if (cached && at && Date.now() - Number(at) < 30 * 60 * 1000) {
      setTable(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetchJSON(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${PL_LEAGUE_ID}&s=${PL_SEASON}`)
      .then(d => {
        const standings = (d.table || []).map(t => ({
          pos: Number(t.intRank),
          name: t.strTeam,
          played: Number(t.intPlayed),
          won: Number(t.intWin),
          drawn: Number(t.intDraw),
          lost: Number(t.intLoss),
          gf: Number(t.intGoalsFor),
          ga: Number(t.intGoalsAgainst),
          gd: Number(t.intGoalDifference),
          pts: Number(t.intPoints),
          badge: t.strTeamBadge,
        }))
        sessionStorage.setItem(cacheKey, JSON.stringify(standings))
        sessionStorage.setItem(cacheAt, String(Date.now()))
        setTable(standings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { table, loading }
}

export function useSpursFixtures() {
  const [last, setLast] = useState(null)
  const [next, setNext] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cacheKey = 'addi_spurs_fixtures'
    const cacheAt = 'addi_spurs_fixtures_at'
    const cached = sessionStorage.getItem(cacheKey)
    const at = sessionStorage.getItem(cacheAt)
    if (cached && at && Date.now() - Number(at) < 15 * 60 * 1000) {
      const d = JSON.parse(cached)
      setLast(d.last); setNext(d.next)
      setLoading(false)
      return
    }

    Promise.all([
      fetchJSON(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${SPURS_ID}`),
      fetchJSON(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${SPURS_ID}`),
    ]).then(([lastD, nextD]) => {
      const mapEvent = (e) => ({
        id: e.idEvent,
        home: e.strHomeTeam,
        away: e.strAwayTeam,
        homeScore: e.intHomeScore,
        awayScore: e.intAwayScore,
        date: e.dateEvent,
        time: e.strTime,
        venue: e.strVenue,
        competition: e.strLeague,
        status: e.strStatus,
        homeBadge: e.strHomeTeamBadge,
        awayBadge: e.strAwayTeamBadge,
      })
      const lastEvent = lastD.results ? mapEvent(lastD.results[lastD.results.length - 1]) : null
      const nextEvent = nextD.events ? mapEvent(nextD.events[0]) : null
      const payload = { last: lastEvent, next: nextEvent }
      sessionStorage.setItem(cacheKey, JSON.stringify(payload))
      sessionStorage.setItem(cacheAt, String(Date.now()))
      setLast(lastEvent); setNext(nextEvent)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { last, next, loading }
}

export function useWorldCupCountdown() {
  const startDate = new Date('2026-06-11T18:00:00Z')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = startDate - now
  if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0, seconds: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { started: false, days, hours, minutes, seconds }
}
