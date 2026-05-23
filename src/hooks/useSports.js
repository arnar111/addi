import { useState, useEffect } from 'react'

const WC_START = new Date('2026-06-11T20:00:00Z')

export function useWCCountdown() {
  const [diff, setDiff] = useState(() => WC_START - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(WC_START - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { started: false, days, hours, minutes, seconds }
}

export function useESPNScores(leagueId = 'fifa.world') {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cacheKey = `espn_${leagueId}`
    let cancelled = false

    const load = async () => {
      const cached = sessionStorage.getItem(cacheKey)
      const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
      if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
        if (!cancelled) {
          setMatches(JSON.parse(cached))
          setLoading(false)
        }
        return
      }

      try {
        const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
        const d = await r.json()
        const events = (d.events || []).map(e => {
          const comp = e.competitions?.[0] || {}
          const home = comp.competitors?.find(c => c.homeAway === 'home') || {}
          const away = comp.competitors?.find(c => c.homeAway === 'away') || {}
          return {
            id: e.id,
            name: e.name,
            date: e.date,
            statusDesc: e.status?.type?.shortDetail || '',
            state: e.status?.type?.state || 'pre',
            completed: e.status?.type?.completed || false,
            home: {
              name: home.team?.shortDisplayName || home.team?.displayName || '',
              abbr: home.team?.abbreviation || '',
              score: home.score || '0',
              logo: home.team?.logo || '',
              winner: home.winner || false,
            },
            away: {
              name: away.team?.shortDisplayName || away.team?.displayName || '',
              abbr: away.team?.abbreviation || '',
              score: away.score || '0',
              logo: away.team?.logo || '',
              winner: away.winner || false,
            },
            venue: comp.venue?.fullName || '',
          }
        })
        if (!cancelled) {
          sessionStorage.setItem(cacheKey, JSON.stringify(events))
          sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
          setMatches(events)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [leagueId])

  return { matches, loading, error }
}
