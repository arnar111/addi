import { useState, useEffect } from 'react'

function parseEvent(ev) {
  const comp = ev.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null
  const status = ev.status?.type
  return {
    id: ev.id,
    date: ev.date,
    homeTeam: home.team?.displayName ?? '',
    homeLogo: home.team?.logo ?? '',
    homeScore: home.score ?? null,
    awayTeam: away.team?.displayName ?? '',
    awayLogo: away.team?.logo ?? '',
    awayScore: away.score ?? null,
    statusText: status?.shortDetail ?? status?.description ?? '',
    isCompleted: status?.completed ?? false,
    isLive: status?.state === 'in',
    league: ev.competitions?.[0]?.series?.title ?? '',
  }
}

async function fetchEPL() {
  const res = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard'
  )
  const d = await res.json()
  return (d.events ?? []).map(parseEvent).filter(Boolean)
}

async function fetchWestHamSchedule() {
  const res = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/37/schedule?limit=5&seasontype=2'
  )
  const d = await res.json()
  const events = d.events ?? []
  return events.slice(-5).map(ev => {
    const comp = ev.competitions?.[0]
    if (!comp) return null
    const home = comp.competitors?.find(c => c.homeAway === 'home')
    const away = comp.competitors?.find(c => c.homeAway === 'away')
    if (!home || !away) return null
    const status = ev.status?.type
    return {
      id: ev.id,
      date: ev.date,
      homeTeam: home.team?.displayName ?? '',
      homeLogo: home.team?.logo ?? '',
      homeScore: home.score ?? null,
      awayTeam: away.team?.displayName ?? '',
      awayLogo: away.team?.logo ?? '',
      awayScore: away.score ?? null,
      statusText: status?.shortDetail ?? '',
      isCompleted: status?.completed ?? false,
      isLive: status?.state === 'in',
    }
  }).filter(Boolean)
}

async function fetchIcelandSoccer() {
  const res = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/soccer/isl.1/scoreboard'
  )
  const d = await res.json()
  return (d.events ?? []).map(parseEvent).filter(Boolean)
}

async function fetchTennis() {
  const res = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard'
  )
  const d = await res.json()
  return (d.events ?? []).slice(0, 6).map(ev => {
    const comp = ev.competitions?.[0]
    if (!comp) return null
    const p1 = comp.competitors?.[0]
    const p2 = comp.competitors?.[1]
    if (!p1 || !p2) return null
    const status = ev.status?.type
    return {
      id: ev.id,
      date: ev.date,
      player1: p1.athlete?.displayName ?? p1.team?.displayName ?? '',
      player2: p2.athlete?.displayName ?? p2.team?.displayName ?? '',
      score1: p1.score ?? '',
      score2: p2.score ?? '',
      statusText: status?.shortDetail ?? '',
      isCompleted: status?.completed ?? false,
      isLive: status?.state === 'in',
      tournament: ev.season?.displayName ?? ev.name ?? '',
    }
  }).filter(Boolean)
}

export function useSports() {
  const [westHam, setWestHam] = useState([])
  const [eplLive, setEplLive] = useState([])
  const [iceland, setIceland] = useState([])
  const [tennis, setTennis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cacheKey = 'sports_v2'
    const cacheTimeKey = 'sports_v2_at'
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(cacheTimeKey)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const parsed = JSON.parse(cached)
      setWestHam(parsed.westHam ?? [])
      setEplLive(parsed.eplLive ?? [])
      setIceland(parsed.iceland ?? [])
      setTennis(parsed.tennis ?? [])
      setLoading(false)
      return
    }

    Promise.allSettled([
      fetchWestHamSchedule(),
      fetchEPL(),
      fetchIcelandSoccer(),
      fetchTennis(),
    ]).then(([wh, epl, isl, ten]) => {
      const whData = wh.status === 'fulfilled' ? wh.value : []
      const eplData = epl.status === 'fulfilled' ? epl.value : []
      const islData = isl.status === 'fulfilled' ? isl.value : []
      const tenData = ten.status === 'fulfilled' ? ten.value : []

      setWestHam(whData)
      setEplLive(eplData)
      setIceland(islData)
      setTennis(tenData)

      const toCache = { westHam: whData, eplLive: eplData, iceland: islData, tennis: tenData }
      sessionStorage.setItem(cacheKey, JSON.stringify(toCache))
      sessionStorage.setItem(cacheTimeKey, String(Date.now()))
      setLoading(false)
    }).catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { westHam, eplLive, iceland, tennis, loading, error }
}
