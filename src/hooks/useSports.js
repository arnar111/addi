import { useState, useEffect } from 'react'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const CACHE_MS = 20 * 60 * 1000

async function fetchTeamEvents(teamId) {
  const [r1, r2] = await Promise.all([
    fetch(`${BASE}/eventsnext.php?id=${teamId}`).then(r => r.json()),
    fetch(`${BASE}/eventslast.php?id=${teamId}`).then(r => r.json()),
  ])
  return {
    next: r1.events?.[0] ?? null,
    last: r2.results?.[0] ?? null,
  }
}

export function useSports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      // Liverpool FC: 133602
      const liv = await fetchTeamEvents('133602')
      const result = { liverpool: liv }
      sessionStorage.setItem('addi_sports', JSON.stringify(result))
      sessionStorage.setItem('addi_sports_at', String(Date.now()))
      setData(result)
      setLastFetch(Date.now())
    } catch {
      // silently fail — show cached or nothing
    }
    setLoading(false)
  }

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_sports')
    const cachedAt = sessionStorage.getItem('addi_sports_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      setData(JSON.parse(cached))
      setLastFetch(Number(cachedAt))
      setLoading(false)
      return
    }
    load()
  }, [])

  return { data, loading, refresh: load, lastFetch }
}
