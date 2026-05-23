import { useState, useEffect } from 'react'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const PL_ID = '4328'
const SEASON = '2025-2026'
const TTL = 15 * 60 * 1000

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, t } = JSON.parse(raw)
    return Date.now() - t < TTL ? data : null
  } catch { return null }
}

function cacheSet(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ data, t: Date.now() })) } catch {}
}

export function useFootball() {
  const [football, setFootball] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const cached = cacheGet('addi_football')
    if (cached) {
      setFootball(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    Promise.all([
      fetch(`${BASE}/lookuptable.php?l=${PL_ID}&s=${SEASON}`).then(r => r.json()),
      fetch(`${BASE}/eventspastleague.php?id=${PL_ID}`).then(r => r.json()),
      fetch(`${BASE}/eventsnextleague.php?id=${PL_ID}`).then(r => r.json()),
    ])
      .then(([tableRes, pastRes, nextRes]) => {
        const data = {
          standings: tableRes.table || [],
          recent: ((pastRes.events || []).slice(-8)).reverse(),
          upcoming: (nextRes.events || []).slice(0, 8),
        }
        cacheSet('addi_football', data)
        setFootball(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [tick])

  const refresh = () => {
    try { sessionStorage.removeItem('addi_football') } catch {}
    setTick(t => t + 1)
    setLoading(true)
    setError(null)
  }

  return {
    standings: football?.standings || [],
    recent: football?.recent || [],
    upcoming: football?.upcoming || [],
    loading,
    error,
    refresh,
  }
}
