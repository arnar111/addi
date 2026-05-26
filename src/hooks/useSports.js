import { useState, useEffect } from 'react'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const CACHE_MS = 20 * 60 * 1000

async function safeJson(url) {
  try {
    const r = await fetch(url)
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

export function useSports() {
  const [pl, setPl] = useState(null)
  const [nba, setNba] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = () => {
    sessionStorage.removeItem('addi_sports_ts')
    setLoading(true)
    load()
  }

  const load = () => {
    const ts = sessionStorage.getItem('addi_sports_ts')
    const cached = sessionStorage.getItem('addi_sports_data')
    if (cached && ts && Date.now() - Number(ts) < CACHE_MS) {
      const { pl: p, nba: n } = JSON.parse(cached)
      setPl(p); setNba(n); setLoading(false)
      return
    }

    Promise.all([
      safeJson(`${BASE}/eventspastleague.php?id=4328`),
      safeJson(`${BASE}/eventsnextleague.php?id=4328`),
      safeJson(`${BASE}/eventspastleague.php?id=4387`),
      safeJson(`${BASE}/eventsnextleague.php?id=4387`),
    ]).then(([plPast, plNext, nbaPast, nbaNext]) => {
      const plData = {
        past: ((plPast?.events) || []).slice(-10).reverse(),
        next: ((plNext?.events) || []).slice(0, 8),
      }
      const nbaData = {
        past: ((nbaPast?.events) || []).slice(-10).reverse(),
        next: ((nbaNext?.events) || []).slice(0, 8),
      }
      setPl(plData)
      setNba(nbaData)
      sessionStorage.setItem('addi_sports_data', JSON.stringify({ pl: plData, nba: nbaData }))
      sessionStorage.setItem('addi_sports_ts', String(Date.now()))
      setLoading(false)
    }).catch(e => {
      setError(e.message)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  return { pl, nba, loading, error, refresh }
}
