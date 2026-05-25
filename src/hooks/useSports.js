import { useState, useEffect } from 'react'

const BASE = 'https://site.api.espn.com/apis/site/v2/sports'

function getCached(key) {
  try {
    const d = sessionStorage.getItem(key)
    const t = sessionStorage.getItem(`${key}_at`)
    if (d && t && Date.now() - Number(t) < 5 * 60 * 1000) return JSON.parse(d)
  } catch {}
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(`${key}_at`, String(Date.now()))
  } catch {}
}

async function fetchJSON(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

function parseEvent(e, teamId, scoreKey = 'score', oppScoreKey = 'opponentScore') {
  const comp = e.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  const teamIsHome = home?.team?.id === String(teamId)
  const mine = teamIsHome ? home : away
  const opp = teamIsHome ? away : home
  const myScore = Number(mine?.score ?? -1)
  const oppScore = Number(opp?.score ?? -1)
  return {
    id: e.id,
    date: e.date,
    opponent: opp?.team?.shortDisplayName || opp?.team?.displayName || '?',
    opponentLogo: opp?.team?.logos?.[0]?.href,
    myScore: mine?.score ?? '-',
    opponentScore: opp?.score ?? '-',
    isHome: teamIsHome,
    completed: !!e.status?.type?.completed,
    won: myScore > oppScore,
    drew: myScore === oppScore && myScore >= 0,
    statusDetail: e.status?.type?.shortDetail || e.status?.type?.description,
    venue: comp.venue?.fullName,
    competition: e.season?.displayName || '',
  }
}

// Inter Milan ESPN id in ita.1 (Serie A) = 110
export function useInterMilan() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCached('inter_data')
    if (cached) { setData(cached); setLoading(false); return }

    Promise.all([
      fetchJSON(`${BASE}/soccer/ita.1/teams/110`).catch(() => null),
      fetchJSON(`${BASE}/soccer/ita.1/teams/110/schedule?limit=10&season=2025`).catch(() => null),
    ]).then(([teamRes, schedRes]) => {
      const events = (schedRes?.events || []).map(e => parseEvent(e, 110)).filter(Boolean)
      const completed = events.filter(e => e.completed)
      const upcoming = events.filter(e => !e.completed)

      const result = {
        team: {
          name: teamRes?.team?.displayName || 'Inter Milan',
          logo: teamRes?.team?.logos?.[0]?.href || null,
          color: '#0068a8',
        },
        recent: completed.slice(-3).reverse(),
        next: upcoming.slice(0, 2),
      }
      setCache('inter_data', result)
      setData(result)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { data, loading }
}

// NY Knicks ESPN id in NBA = 18
export function useKnicks() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCached('knicks_data')
    if (cached) { setData(cached); setLoading(false); return }

    Promise.all([
      fetchJSON(`${BASE}/basketball/nba/teams/18`).catch(() => null),
      fetchJSON(`${BASE}/basketball/nba/teams/18/schedule?limit=10&season=2025`).catch(() => null),
    ]).then(([teamRes, schedRes]) => {
      const events = (schedRes?.events || []).map(e => parseEvent(e, 18)).filter(Boolean)
      const completed = events.filter(e => e.completed)
      const upcoming = events.filter(e => !e.completed)

      const result = {
        team: {
          name: teamRes?.team?.displayName || 'New York Knicks',
          logo: teamRes?.team?.logos?.[0]?.href || null,
          color: '#006BB6',
        },
        recent: completed.slice(-3).reverse(),
        next: upcoming.slice(0, 2),
      }
      setCache('knicks_data', result)
      setData(result)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
