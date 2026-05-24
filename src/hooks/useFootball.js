import { useState, useEffect } from 'react'

const isSpurs = (name = '') =>
  name.toLowerCase().includes('tottenham') || name.toLowerCase().includes('spurs')

function parseEvent(e) {
  const comp = e.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  const homeName = home?.team?.shortDisplayName || home?.team?.displayName || '?'
  const awayName = away?.team?.shortDisplayName || away?.team?.displayName || '?'
  return {
    id: e.id,
    home: homeName,
    homeScore: home?.score ?? '',
    homeLogo: home?.team?.logo || '',
    away: awayName,
    awayScore: away?.score ?? '',
    awayLogo: away?.team?.logo || '',
    hasSpurs: isSpurs(homeName) || isSpurs(awayName),
    spursHome: isSpurs(homeName),
    status: comp.status?.type?.shortDetail || '',
    state: comp.status?.type?.state || 'pre',
    completed: comp.status?.type?.completed || false,
    date: e.date,
  }
}

function fmtDate(d) {
  return new Date(d).toISOString().split('T')[0].replace(/-/g, '')
}

export function useFootball() {
  const [todayMatches, setTodayMatches] = useState([])
  const [spursLast, setSpursLast] = useState(null)
  const [spursNext, setSpursNext] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_football')
    const cachedAt = sessionStorage.getItem('addi_footballAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const d = JSON.parse(cached)
      setTodayMatches(d.todayMatches || [])
      setSpursLast(d.spursLast || null)
      setSpursNext(d.spursNext || null)
      setLoading(false)
      return
    }

    const today = new Date()
    const past = new Date(today); past.setDate(past.getDate() - 7)
    const future = new Date(today); future.setDate(future.getDate() + 14)

    fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard` +
      `?dates=${fmtDate(past)}-${fmtDate(future)}&limit=100`
    )
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).map(parseEvent).filter(Boolean)

        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999)

        const todayMs = events.filter(e => {
          const dt = new Date(e.date)
          return dt >= todayStart && dt <= todayEnd
        })

        const spursAll = events.filter(e => e.hasSpurs)
        const spursDone = spursAll.filter(e => e.completed)
        const spursUp = spursAll.filter(e => !e.completed)

        const result = {
          todayMatches: todayMs,
          spursLast: spursDone.at(-1) || null,
          spursNext: spursUp[0] || null,
        }
        sessionStorage.setItem('addi_football', JSON.stringify(result))
        sessionStorage.setItem('addi_footballAt', String(Date.now()))
        setTodayMatches(result.todayMatches)
        setSpursLast(result.spursLast)
        setSpursNext(result.spursNext)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { todayMatches, spursLast, spursNext, loading }
}
