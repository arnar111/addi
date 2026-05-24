import { useState, useEffect } from 'react'

export function useAurora() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('aurora_v2')
    const cachedAt = sessionStorage.getItem('aurora_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
      .then(r => r.json())
      .then(rows => {
        const readings = rows.slice(1).slice(-8)
        const latest = parseFloat(readings[readings.length - 1]?.[1] || 0)
        const max = Math.max(...readings.map(r => parseFloat(r[1] || 0)))
        const result = {
          latest: Math.round(latest * 10) / 10,
          max: Math.round(max * 10) / 10,
          readings: readings.slice(-5).map(r => ({
            time: r[0],
            kp: parseFloat(r[1]),
          })),
        }
        sessionStorage.setItem('aurora_v2', JSON.stringify(result))
        sessionStorage.setItem('aurora_v2_at', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function getStatus(kp) {
    if (kp >= 5) return { label: 'Mjög líklegt!', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', bar: '#00d4aa' }
    if (kp >= 3) return { label: 'Mögulegt', color: '#f97316', bg: 'rgba(249,115,22,0.12)', bar: '#f97316' }
    return { label: 'Ólíklegt', color: '#64748b', bg: 'rgba(100,116,139,0.08)', bar: '#64748b' }
  }

  return { data, loading, getStatus }
}
