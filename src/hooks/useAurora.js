import { useState, useEffect } from 'react'

export function useAurora() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_aurora')
    const cachedAt = sessionStorage.getItem('addi_auroraAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json')
      .then(r => r.json())
      .then(arr => {
        const latest = arr[arr.length - 1]
        const kp = parseFloat(latest?.kp_index ?? latest?.estimated_kp ?? 0)
        let color, label, chance
        if (kp >= 7)      { color = '#ff6b35'; label = 'Einstakt norðurljós!'; chance = 99 }
        else if (kp >= 5) { color = '#00d4aa'; label = 'Norðurljós líklegt';   chance = 80 }
        else if (kp >= 4) { color = '#22c55e'; label = 'Möguleg norðurljós';   chance = 50 }
        else if (kp >= 3) { color = '#8b5cf6'; label = 'Lítil líkur';          chance = 20 }
        else              { color = '#64748b'; label = 'Ólíklegt í kvöld';     chance = 5  }
        const result = { kp: Math.round(kp * 10) / 10, color, label, chance }
        sessionStorage.setItem('addi_aurora', JSON.stringify(result))
        sessionStorage.setItem('addi_auroraAt', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
