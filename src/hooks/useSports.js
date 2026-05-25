import { useState, useEffect } from 'react'

const CACHE_MS = 10 * 60 * 1000

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(`sports_${key}`)
    if (!raw) return null
    const { v, t } = JSON.parse(raw)
    if (Date.now() - t > CACHE_MS) return null
    return v
  } catch { return null }
}

function setCache(key, v) {
  try { sessionStorage.setItem(`sports_${key}`, JSON.stringify({ v, t: Date.now() })) } catch {}
}

function parseEvents(d, myTeamId) {
  const myId = String(d.team?.id || myTeamId)
  const now = Date.now()

  const events = (d.events || []).map(e => {
    const comp = e.competitions?.[0]
    if (!comp) return null
    const mine = comp.competitors?.find(c => String(c.team?.id) === myId)
    const opp = comp.competitors?.find(c => String(c.team?.id) !== myId)
    const done = !!comp.status?.type?.completed
    const myScore = parseInt(mine?.score || 0)
    const oppScore = parseInt(opp?.score || 0)
    return {
      id: e.id,
      date: e.date,
      completed: done,
      inProgress: comp.status?.type?.state === 'in',
      statusDetail: comp.status?.type?.shortDetail || '',
      isHome: mine?.homeAway === 'home',
      opponent: opp?.team?.displayName || opp?.team?.shortDisplayName || '?',
      opponentAbbr: opp?.team?.abbreviation || '?',
      opponentLogo: opp?.team?.logo || '',
      myScore: mine?.score || '',
      oppScore: opp?.score || '',
      result: done ? (myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D') : null,
      venue: comp.venue?.fullName || '',
    }
  }).filter(Boolean)

  return {
    past: events.filter(e => e.completed && new Date(e.date).getTime() < now).slice(-5),
    upcoming: events.filter(e => !e.completed && new Date(e.date).getTime() >= now - 3 * 3600 * 1000).slice(0, 3),
    season: d.season?.displayName || '',
  }
}

async function fetchSchedule(sport, league, teamId) {
  const key = `${league}_${teamId}`
  const cached = getCache(key)
  if (cached) return cached

  const r = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${teamId}/schedule`
  )
  if (!r.ok) throw new Error(`ESPN ${r.status}`)
  const d = await r.json()
  const result = parseEvents(d, teamId)
  setCache(key, result)
  return result
}

export function useSports() {
  const [inter, setInter] = useState({ past: [], upcoming: [], season: '', loading: true, error: null })
  const [cavs, setCavs] = useState({ past: [], upcoming: [], season: '', loading: true, error: null })

  useEffect(() => {
    fetchSchedule('soccer', 'ita.1', 110)
      .then(d => setInter({ ...d, loading: false, error: null }))
      .catch(e => setInter(s => ({ ...s, loading: false, error: e.message })))

    fetchSchedule('basketball', 'nba', 5)
      .then(d => setCavs({ ...d, loading: false, error: null }))
      .catch(e => setCavs(s => ({ ...s, loading: false, error: e.message })))
  }, [])

  return { inter, cavs }
}
