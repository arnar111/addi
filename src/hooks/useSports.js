import { useState, useEffect } from 'react'

const CACHE_MS = 3 * 60 * 1000

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    const at = Number(sessionStorage.getItem(key + '_at') || 0)
    if (raw && Date.now() - at < CACHE_MS) return JSON.parse(raw)
  } catch {}
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(key + '_at', String(Date.now()))
  } catch {}
}

export function useNBAScoreboard() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCache('nba_board')
    if (cached) { setGames(cached); setLoading(false); return }

    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')
      .then(r => r.json())
      .then(d => {
        const g = (d.events || []).map(e => {
          const comp = e.competitions[0]
          const home = comp.competitors?.find(c => c.homeAway === 'home')
          const away = comp.competitors?.find(c => c.homeAway === 'away')
          return {
            id: e.id,
            shortName: e.shortName || e.name,
            home: { abbr: home?.team?.abbreviation, score: home?.score },
            away: { abbr: away?.team?.abbreviation, score: away?.score },
            status: comp.status?.type?.shortDetail,
            inProgress: comp.status?.type?.state === 'in',
            completed: comp.status?.type?.completed,
          }
        })
        setCache('nba_board', g)
        setGames(g)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { games, loading }
}

export function useKnicksSchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCache('knicks_sched')
    if (cached) { setSchedule(cached); setLoading(false); return }

    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/18/schedule')
      .then(r => r.json())
      .then(d => {
        const events = d.events || []
        const processed = events.map(e => {
          const comp = e.competitions?.[0]
          if (!comp) return null
          const home = comp.competitors?.find(c => c.homeAway === 'home')
          const away = comp.competitors?.find(c => c.homeAway === 'away')
          const isHome = home?.team?.abbreviation === 'NYK'
          const knicks = isHome ? home : away
          const opp = isHome ? away : home
          return {
            id: e.id,
            date: e.date,
            opponent: opp?.team?.shortDisplayName || opp?.team?.abbreviation || 'TBD',
            oppAbbr: opp?.team?.abbreviation,
            oppLogo: opp?.team?.logos?.[0]?.href,
            isHome,
            kScore: knicks?.score,
            oScore: opp?.score,
            status: comp.status?.type?.shortDetail,
            completed: comp.status?.type?.completed,
            inProgress: comp.status?.type?.state === 'in',
            won: comp.status?.type?.completed &&
                 Number(knicks?.score) > Number(opp?.score),
          }
        }).filter(Boolean)
        setCache('knicks_sched', processed)
        setSchedule(processed)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { schedule, loading }
}

export function useInterMilanSchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCache('inter_sched')
    if (cached) { setSchedule(cached); setLoading(false); return }

    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/teams/110/schedule')
      .then(r => r.json())
      .then(d => {
        const events = d.events || []
        const processed = events.map(e => {
          const comp = e.competitions?.[0]
          if (!comp) return null
          const home = comp.competitors?.find(c => c.homeAway === 'home')
          const away = comp.competitors?.find(c => c.homeAway === 'away')
          const isHome = home?.team?.id === '110'
          const inter = isHome ? home : away
          const opp = isHome ? away : home
          return {
            id: e.id,
            date: e.date,
            opponent: opp?.team?.shortDisplayName || opp?.team?.name || 'TBD',
            oppLogo: opp?.team?.logos?.[0]?.href,
            isHome,
            iScore: inter?.score,
            oScore: opp?.score,
            status: comp.status?.type?.shortDetail,
            completed: comp.status?.type?.completed,
            inProgress: comp.status?.type?.state === 'in',
            won: comp.status?.type?.completed &&
                 Number(inter?.score) > Number(opp?.score),
          }
        }).filter(Boolean)
        setCache('inter_sched', processed)
        setSchedule(processed)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { schedule, loading }
}
