import { useState, useEffect } from 'react'

const INTER_ID = '110'
const CACHE_MS = 15 * 60 * 1000

function processSchedule(events = []) {
  const now = new Date()
  const past = []
  const upcoming = []

  for (const e of events) {
    const comp = e.competitions?.[0]
    if (!comp) continue
    const completed = comp.status?.type?.completed
    const date = new Date(e.date)

    if (completed) {
      const inter = comp.competitors?.find(c => c.team?.id === INTER_ID)
      const opp = comp.competitors?.find(c => c.team?.id !== INTER_ID)
      if (!inter || !opp) continue
      const result = inter.winner ? 'W' : opp.winner ? 'L' : 'D'
      past.push({
        id: e.id,
        date: e.date,
        name: e.name,
        homeAway: inter.homeAway,
        interScore: inter.score,
        oppScore: opp.score,
        oppName: opp.team?.displayName,
        oppAbbr: opp.team?.abbreviation,
        oppLogo: opp.team?.logos?.[0]?.href,
        result,
        competition: comp.notes?.[0]?.headline || '',
      })
    } else if (date >= now) {
      const inter = comp.competitors?.find(c => c.team?.id === INTER_ID)
      const opp = comp.competitors?.find(c => c.team?.id !== INTER_ID)
      if (!inter || !opp) continue
      upcoming.push({
        id: e.id,
        date: e.date,
        name: e.name,
        homeAway: inter.homeAway,
        oppName: opp.team?.displayName,
        oppAbbr: opp.team?.abbreviation,
        oppLogo: opp.team?.logos?.[0]?.href,
        competition: comp.notes?.[0]?.headline || '',
      })
    }
  }

  return {
    past: past.slice(-5).reverse(),
    upcoming: upcoming.slice(0, 3),
  }
}

function processStandings(data) {
  const entries = data?.children?.[0]?.standings?.entries || []
  return entries.slice(0, 8).map(e => {
    const stat = (name) => e.stats?.find(s => s.name === name)?.value ?? '-'
    return {
      team: e.team?.displayName,
      abbr: e.team?.abbreviation,
      logo: e.team?.logos?.[0]?.href,
      isInter: e.team?.id === INTER_ID,
      points: stat('points'),
      gp: stat('gamesPlayed'),
      w: stat('wins'),
      d: stat('ties'),
      l: stat('losses'),
      gd: stat('pointDifferential'),
    }
  })
}

export function useSports() {
  const [schedule, setSchedule] = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('sports_v2')
    const cachedAt = sessionStorage.getItem('sports_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      const d = JSON.parse(cached)
      setSchedule(d.schedule)
      setStandings(d.standings)
      setLoading(false)
      return
    }

    const go = async () => {
      try {
        const [schedRes, standRes] = await Promise.all([
          fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/teams/${INTER_ID}/schedule`),
          fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/standings`),
        ])
        const [schedData, standData] = await Promise.all([schedRes.json(), standRes.json()])

        const sched = processSchedule(schedData.events)
        const stand = processStandings(standData)

        const payload = { schedule: sched, standings: stand }
        sessionStorage.setItem('sports_v2', JSON.stringify(payload))
        sessionStorage.setItem('sports_v2_at', String(Date.now()))
        setSchedule(sched)
        setStandings(stand)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    go()
  }, [])

  return { schedule, standings, loading, error }
}
