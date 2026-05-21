import { useState, useEffect } from 'react'

export function useAurora() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('aurora')
    const cachedAt = sessionStorage.getItem('auroraAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json')
      .then(r => r.json())
      .then(arr => {
        const recent = arr.slice(-12)
        const latest = recent[recent.length - 1]
        const kp = parseFloat(latest?.kp_index ?? latest?.estimated_kp ?? 0)
        const trend = recent.length > 6
          ? parseFloat(recent[recent.length - 1].kp_index) - parseFloat(recent[recent.length - 6].kp_index)
          : 0

        let visibility = 'Ekki sýnileg'
        let color = '#64748b'
        let chance = 0

        if (kp >= 7) { visibility = 'Framúrskarandi'; color = '#f97316'; chance = 98 }
        else if (kp >= 5) { visibility = 'Góð sýnileiki'; color = '#00d4aa'; chance = 85 }
        else if (kp >= 4) { visibility = 'Möguleg'; color = '#8b5cf6'; chance = 60 }
        else if (kp >= 3) { visibility = 'Lítil möguleiki'; color = '#3b82f6'; chance = 30 }
        else { visibility = 'Lítil möguleiki'; color = '#64748b'; chance = 5 }

        const result = { kp: Math.round(kp * 10) / 10, visibility, color, chance, trend, history: recent.map(r => parseFloat(r.kp_index || 0)) }
        sessionStorage.setItem('aurora', JSON.stringify(result))
        sessionStorage.setItem('auroraAt', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { data, loading }
}
