import { useState, useEffect } from 'react'

async function fetchCached(url, key, ttl = 5 * 60 * 1000) {
  try {
    const cached = sessionStorage.getItem(key)
    const at = sessionStorage.getItem(`${key}_at`)
    if (cached && at && Date.now() - Number(at) < ttl) return JSON.parse(cached)
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(`${key}_at`, String(Date.now()))
    return data
  } catch (e) {
    const cached = sessionStorage.getItem(key)
    if (cached) return JSON.parse(cached)
    throw e
  }
}

export function useSports() {
  const [recentPL, setRecentPL] = useState([])
  const [upcomingUCL, setUpcomingUCL] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchCached(
        'https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=4328',
        'sports_past_pl'
      ),
      fetchCached(
        'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4480',
        'sports_next_ucl'
      ),
    ])
      .then(([past, next]) => {
        const events = past?.events || []
        setRecentPL(events.slice(-8).reverse())
        setUpcomingUCL((next?.events || []).slice(0, 5))
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { recentPL, upcomingUCL, loading, error }
}

export function useWCCountdown() {
  const WC_OPEN = new Date('2026-06-11T18:00:00Z') // Opening ceremony
  const WC_FINAL = new Date('2026-07-19T20:00:00Z')

  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const diff = WC_OPEN - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds, started: false }
  }

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  return { timeLeft, WC_OPEN, WC_FINAL }
}
