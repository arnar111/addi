import { useState, useEffect } from 'react'

const SPURS_ID = '367'
const EPL = 'eng.1'
const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer'

function parseCompetitor(comp, homeAway) {
  return comp?.find(c => c.homeAway === homeAway)
}

export function useFootball() {
  const [nextMatch, setNextMatch] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cacheKey = 'addi_football'
    const cacheTs = 'addi_football_ts'
    const cached = sessionStorage.getItem(cacheKey)
    const ts = sessionStorage.getItem(cacheTs)
    if (cached && ts && Date.now() - Number(ts) < 15 * 60 * 1000) {
      const d = JSON.parse(cached)
      setNextMatch(d.nextMatch)
      setLastResult(d.lastResult)
      setRecentResults(d.recentResults || [])
      setLoading(false)
      return
    }

    fetch(`${BASE}/${EPL}/teams/${SPURS_ID}/schedule`)
      .then(r => r.json())
      .then(data => {
        const events = data.events || []
        const now = Date.now()

        const completed = events.filter(e => {
          const comp = e.competitions?.[0]
          return comp?.status?.type?.completed === true
        })
        const upcoming = events.filter(e => {
          const comp = e.competitions?.[0]
          return !comp?.status?.type?.completed && new Date(e.date).getTime() > now
        })

        const parseEvent = (e) => {
          const comp = e.competitions?.[0]
          const home = parseCompetitor(comp?.competitors, 'home')
          const away = parseCompetitor(comp?.competitors, 'away')
          const spursHome = home?.team?.id === SPURS_ID || home?.team?.abbreviation === 'TOT'
          return {
            id: e.id,
            date: e.date,
            home: home?.team?.displayName || home?.team?.shortDisplayName || '',
            away: away?.team?.displayName || away?.team?.shortDisplayName || '',
            homeScore: home?.score ?? null,
            awayScore: away?.score ?? null,
            venue: comp?.venue?.fullName || '',
            completed: comp?.status?.type?.completed,
            spursHome,
          }
        }

        const last = completed.length > 0 ? parseEvent(completed[completed.length - 1]) : null
        const next = upcoming.length > 0 ? parseEvent(upcoming[0]) : null
        const recent = completed.slice(-5).reverse().map(parseEvent)

        const payload = { nextMatch: next, lastResult: last, recentResults: recent }
        sessionStorage.setItem(cacheKey, JSON.stringify(payload))
        sessionStorage.setItem(cacheTs, String(Date.now()))

        setNextMatch(next)
        setLastResult(last)
        setRecentResults(recent)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { nextMatch, lastResult, recentResults, loading }
}

export function useWorldCup() {
  const WC_START = new Date('2026-06-11T18:00:00Z')
  const now = new Date()
  const diff = WC_START - now
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const started = diff <= 0
  return { days, hours, started, WC_START }
}
