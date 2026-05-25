import { useState, useEffect } from 'react'

const WC_START = new Date('2026-06-11T18:00:00Z')

export function useWCCountdown() {
  const calc = () => {
    const now = new Date()
    const diff = WC_START - now
    if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return { started: false, days, hours, minutes, seconds }
  }

  const [countdown, setCountdown] = useState(calc)

  useEffect(() => {
    const t = setInterval(() => setCountdown(calc()), 1000)
    return () => clearInterval(t)
  }, [])

  return countdown
}

export function useLiveScores(league) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!league) { setLoading(false); return }
    const cacheKey = `sport_${league}`
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
    const cached = sessionStorage.getItem(cacheKey)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setMatches(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).slice(0, 10).map(e => {
          const comps = e.competitions?.[0]
          const home = comps?.competitors?.find(c => c.homeAway === 'home')
          const away = comps?.competitors?.find(c => c.homeAway === 'away')
          return {
            id: e.id,
            home: home?.team?.shortDisplayName || home?.team?.name || '?',
            away: away?.team?.shortDisplayName || away?.team?.name || '?',
            homeLogo: home?.team?.logo,
            awayLogo: away?.team?.logo,
            homeScore: home?.score ?? '-',
            awayScore: away?.score ?? '-',
            status: e.status?.type?.shortDetail || '',
            state: e.status?.type?.state || 'pre',
            isLive: e.status?.type?.state === 'in',
            date: e.date,
          }
        })
        sessionStorage.setItem(cacheKey, JSON.stringify(events))
        sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
        setMatches(events)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [league])

  return { matches, loading, error }
}
