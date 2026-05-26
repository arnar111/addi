import { useState, useEffect } from 'react'

const ARSENAL_ID = '133604'
const CACHE_KEY = 'addi_football'
const CACHE_TTL = 15 * 60 * 1000

export function useFootball() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    const base = 'https://www.thesportsdb.com/api/v1/json/3'
    Promise.all([
      fetch(`${base}/eventslast.php?id=${ARSENAL_ID}`).then(r => r.json()).catch(() => ({})),
      fetch(`${base}/eventsnext.php?id=${ARSENAL_ID}`).then(r => r.json()).catch(() => ({})),
    ])
      .then(([last, next]) => {
        const results = last.results || []
        const lastPL = results.filter(e => e.strLeague?.includes('Premier')).pop()
          || results[results.length - 1]
          || null
        const nextMatch = (next.events || [])[0] || null
        const d = { lastMatch: lastPL, nextMatch }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(d))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setData(null)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
