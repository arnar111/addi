import { useState, useEffect } from 'react'

const CACHE_TTL = 30 * 60 * 1000

export function useManUnited() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('mu_data')
      const cachedAt = sessionStorage.getItem('mu_data_at')
      if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }
    } catch {}

    Promise.all([
      fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133604').then(r => r.json()),
      fetch('https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133604').then(r => r.json()),
    ])
      .then(([nextRes, lastRes]) => {
        const result = {
          next: nextRes.events?.[0] || null,
          last: lastRes.results?.[0] || null,
        }
        try {
          sessionStorage.setItem('mu_data', JSON.stringify(result))
          sessionStorage.setItem('mu_data_at', String(Date.now()))
        } catch {}
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
