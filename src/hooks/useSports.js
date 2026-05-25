import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

function getCache(key) {
  try {
    const d = sessionStorage.getItem(key)
    const t = sessionStorage.getItem(key + '_ts')
    if (d && t && Date.now() - +t < CACHE_MS) return JSON.parse(d)
  } catch {}
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(key + '_ts', String(Date.now()))
  } catch {}
}

async function fetchESPN(sport, league) {
  const key = `espn_${sport}_${league}`
  const hit = getCache(key)
  if (hit) return hit
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`
  )
  if (!res.ok) throw new Error(`ESPN ${res.status}`)
  const data = await res.json()
  setCache(key, data)
  return data
}

function parseEvent(event, nameFilter) {
  const comp = event.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null

  if (nameFilter) {
    const h = (home.team.displayName || '').toLowerCase()
    const a = (away.team.displayName || '').toLowerCase()
    if (!h.includes(nameFilter) && !a.includes(nameFilter)) return null
  }

  return {
    id: event.id,
    name: event.shortName || event.name,
    date: event.date,
    status: comp.status?.type?.name || 'STATUS_SCHEDULED',
    statusText: comp.status?.type?.shortDetail || '',
    home: {
      name: home.team.shortDisplayName || home.team.abbreviation || home.team.displayName,
      score: home.score || '',
      logo: home.team.logo || '',
      winner: !!home.winner,
    },
    away: {
      name: away.team.shortDisplayName || away.team.abbreviation || away.team.displayName,
      score: away.score || '',
      logo: away.team.logo || '',
      winner: !!away.winner,
    },
  }
}

export function useSports() {
  const [inter, setInter] = useState([])
  const [nba, setNba] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const sa = await fetchESPN('soccer', 'ita.1')
      const interSA = (sa.events || []).map(e => parseEvent(e, 'inter')).filter(Boolean)

      let interUCL = []
      try {
        const ucl = await fetchESPN('soccer', 'uefa.champions')
        interUCL = (ucl.events || []).map(e => parseEvent(e, 'inter')).filter(Boolean)
      } catch {}

      setInter([...interSA, ...interUCL].slice(0, 5))

      const nbaData = await fetchESPN('basketball', 'nba')
      const games = (nbaData.events || [])
        .map(e => parseEvent(e, null))
        .filter(Boolean)
        .slice(0, 8)
      setNba(games)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  return { inter, nba, loading, error, refresh }
}
