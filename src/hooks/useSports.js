import { useState, useEffect } from 'react'

export function useSports() {
  const [pl, setPl] = useState(null)
  const [wc, setWc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_sports')
    const cachedAt = sessionStorage.getItem('addi_sports_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 20 * 60 * 1000) {
      const d = JSON.parse(cached)
      setPl(d.pl)
      setWc(d.wc)
      setLoading(false)
      return
    }

    Promise.all([
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard')
        .then(r => r.json()).catch(() => null),
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard')
        .then(r => r.json()).catch(() => null),
    ]).then(([plData, wcData]) => {
      const data = { pl: plData, wc: wcData }
      sessionStorage.setItem('addi_sports', JSON.stringify(data))
      sessionStorage.setItem('addi_sports_at', String(Date.now()))
      setPl(plData)
      setWc(wcData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { pl, wc, loading }
}
