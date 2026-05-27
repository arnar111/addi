import { useState, useEffect } from 'react'

export function useFootball() {
  const [plData, setPlData] = useState(null)
  const [wcData, setWcData] = useState(null)
  const [arsenalData, setArsenalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('football_v2')
    const cachedAt = sessionStorage.getItem('footballAt_v2')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const d = JSON.parse(cached)
      setPlData(d.pl)
      setWcData(d.wc)
      setArsenalData(d.arsenal)
      setLoading(false)
      return
    }

    Promise.allSettled([
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard').then(r => r.json()),
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard').then(r => r.json()),
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/359/schedule').then(r => r.json()),
    ]).then(([pl, wc, arsenal]) => {
      const d = {
        pl: pl.status === 'fulfilled' ? pl.value : null,
        wc: wc.status === 'fulfilled' ? wc.value : null,
        arsenal: arsenal.status === 'fulfilled' ? arsenal.value : null,
      }
      sessionStorage.setItem('football_v2', JSON.stringify(d))
      sessionStorage.setItem('footballAt_v2', String(Date.now()))
      setPlData(d.pl)
      setWcData(d.wc)
      setArsenalData(d.arsenal)
      setLoading(false)
    }).catch(e => {
      setError(e.message)
      setLoading(false)
    })
  }, [])

  return { plData, wcData, arsenalData, loading, error }
}
