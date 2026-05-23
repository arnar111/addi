import { useState, useEffect } from 'react'

const WC_DATE = new Date('2026-06-11T00:00:00')

export function daysUntilWC() {
  const diff = WC_DATE - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function useFootball(league = 'FIFA.WORLD') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [league])

  return { events, loading, error, daysLeft: daysUntilWC() }
}
