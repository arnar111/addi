import { useState, useEffect } from 'react'

const WEST_HAM_ID = '133611'
const CACHE_TTL = 30 * 60 * 1000

function getCached(key) {
  try {
    const data = sessionStorage.getItem(key)
    const at = sessionStorage.getItem(key + '_at')
    if (data && at && Date.now() - Number(at) < CACHE_TTL) return JSON.parse(data)
  } catch {}
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(key + '_at', String(Date.now()))
  } catch {}
}

export function useSports() {
  const [nextMatches, setNextMatches] = useState([])
  const [lastMatches, setLastMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = getCached('sports_whu')
    if (cached) {
      setNextMatches(cached.next || [])
      setLastMatches(cached.last || [])
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextteam.php?id=${WEST_HAM_ID}`)
        .then(r => r.json()),
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslastteam.php?id=${WEST_HAM_ID}`)
        .then(r => r.json()),
    ])
      .then(([nextData, lastData]) => {
        const next = (nextData.events || []).slice(0, 5)
        const last = (lastData.results || []).slice(0, 5)
        setNextMatches(next)
        setLastMatches(last)
        setCache('sports_whu', { next, last })
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const nextMatch = nextMatches[0] || null
  const lastResult = lastMatches[0] || null

  return { nextMatches, lastMatches, nextMatch, lastResult, loading, error }
}
