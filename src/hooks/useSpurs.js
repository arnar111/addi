import { useState, useEffect } from 'react'

const TEAM_ID = '367'
const CACHE_KEY = 'spurs_v2'
const CACHE_TTL = 15 * 60 * 1000

export function useSpurs() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    async function load() {
      try {
        const [standingsRes, upcomingRes, recentRes] = await Promise.allSettled([
          fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/standings'),
          fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard`),
          fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/${TEAM_ID}/schedule?season=2026`),
        ])

        // Parse standings
        let position = null, points = null, wins = 0, draws = 0, losses = 0, gd = null
        if (standingsRes.status === 'fulfilled') {
          const sd = await standingsRes.value.json()
          const entries = sd.standings?.entries || sd.children?.[0]?.standings?.entries || []
          const entry = entries.find(e =>
            e.team?.id === TEAM_ID || e.team?.displayName?.toLowerCase().includes('tottenham')
          )
          if (entry) {
            const stat = (name) => entry.stats?.find(s => s.name === name)?.value ?? null
            position = stat('rank')
            points = stat('points')
            wins = stat('wins') || 0
            draws = stat('ties') || 0
            losses = stat('losses') || 0
            gd = stat('pointDifferential')
          }
        }

        // Parse upcoming match from scoreboard
        let nextMatch = null
        if (upcomingRes.status === 'fulfilled') {
          const ud = await upcomingRes.value.json()
          const events = ud.events || []
          const spursEvent = events.find(e =>
            e.competitions?.[0]?.competitors?.some(c =>
              c.team?.id === TEAM_ID || c.team?.displayName?.toLowerCase().includes('tottenham')
            )
          )
          if (spursEvent) {
            const comp = spursEvent.competitions[0]
            const home = comp.competitors.find(c => c.homeAway === 'home')
            const away = comp.competitors.find(c => c.homeAway === 'away')
            nextMatch = {
              date: spursEvent.date,
              home: home?.team?.shortDisplayName || home?.team?.displayName,
              away: away?.team?.shortDisplayName || away?.team?.displayName,
              venue: comp.venue?.fullName,
              status: comp.status?.type?.description,
            }
          }
        }

        // Parse last result from schedule
        let lastResult = null
        if (recentRes.status === 'fulfilled') {
          const rd = await recentRes.value.json()
          const events = (rd.events || [])
            .filter(e => {
              const comp = e.competitions?.[0]
              return comp?.status?.type?.completed
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))

          if (events[0]) {
            const comp = events[0].competitions[0]
            const spurs = comp.competitors.find(c =>
              c.team?.id === TEAM_ID || c.team?.displayName?.toLowerCase().includes('tottenham')
            )
            const opp = comp.competitors.find(c =>
              c.team?.id !== TEAM_ID && !c.team?.displayName?.toLowerCase().includes('tottenham')
            )
            const sScore = Number(spurs?.score ?? 0)
            const oScore = Number(opp?.score ?? 0)
            lastResult = {
              date: events[0].date,
              opponent: opp?.team?.shortDisplayName || opp?.team?.displayName || '?',
              spursScore: sScore,
              oppScore: oScore,
              result: sScore > oScore ? 'W' : sScore < oScore ? 'L' : 'D',
              homeAway: spurs?.homeAway === 'home' ? 'H' : 'A',
            }
          }
        }

        const result = { position, points, wins, draws, losses, gd, nextMatch, lastResult }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(result)
      } catch {
        setData({ error: true })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading }
}
