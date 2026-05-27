import { useState, useEffect } from 'react'

// Arsenal ESPN ID in Premier League
const ARSENAL_ID = '359'
const CACHE_KEY = 'addi_football'
const CACHE_TTL = 5 * 60 * 1000 // 5 min

function parseCompetitor(comp) {
  return {
    id: comp?.team?.id,
    name: comp?.team?.displayName,
    shortName: comp?.team?.abbreviation,
    logo: comp?.team?.logos?.[0]?.href,
    score: comp?.score,
    winner: comp?.winner,
  }
}

function parseEvent(event) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')

  const isArsenalHome = home?.team?.id === ARSENAL_ID
  const arsenalComp = isArsenalHome ? home : away
  const oppComp = isArsenalHome ? away : home

  const completed = event.status?.type?.completed ?? false
  const homeScore = parseInt(home?.score) || 0
  const awayScore = parseInt(away?.score) || 0
  const arsenalScore = isArsenalHome ? homeScore : awayScore
  const oppScore = isArsenalHome ? awayScore : homeScore

  let result = null
  if (completed) {
    if (arsenalScore > oppScore) result = 'W'
    else if (arsenalScore < oppScore) result = 'L'
    else result = 'D'
  }

  return {
    id: event.id,
    date: event.date,
    name: event.name,
    venue: comp.venue?.fullName,
    completed,
    isArsenalHome,
    arsenal: parseCompetitor(arsenalComp),
    opponent: parseCompetitor(oppComp),
    arsenalScore,
    oppScore,
    result,
    status: event.status?.type?.shortDetail,
  }
}

function parseStandings(raw) {
  try {
    const entries = raw?.children?.[0]?.standings?.entries || []
    return entries.map((entry, idx) => {
      const stat = (name) => entry.stats?.find(s => s.name === name)?.value ?? 0
      return {
        position: idx + 1,
        team: entry.team?.displayName,
        shortName: entry.team?.abbreviation,
        logo: entry.team?.logos?.[0]?.href,
        isArsenal: entry.team?.id === ARSENAL_ID,
        points: stat('points'),
        played: stat('gamesPlayed'),
        wins: stat('wins'),
        draws: stat('ties'),
        losses: stat('losses'),
        gd: stat('pointDifferential'),
        gf: stat('pointsFor'),
        ga: stat('pointsAgainst'),
      }
    })
  } catch {
    return []
  }
}

export function useFootball() {
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

    const schedUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/${ARSENAL_ID}/schedule?season=2025&seasontype=2&limit=20`
    const standUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/standings`

    Promise.all([
      fetch(schedUrl).then(r => r.json()).catch(() => null),
      fetch(standUrl).then(r => r.json()).catch(() => null),
    ])
      .then(([schedData, standData]) => {
        const events = (schedData?.events || []).map(parseEvent).filter(Boolean)
        const now = new Date()

        const completed = events.filter(e => e.completed)
        const upcoming = events.filter(e => !e.completed && new Date(e.date) > now)

        const lastMatches = completed.slice(-5)
        const nextMatch = upcoming[0] || null

        const standings = parseStandings(standData)
        const arsenalStanding = standings.find(s => s.isArsenal) || null

        const parsed = {
          lastMatch: lastMatches[lastMatches.length - 1] || null,
          lastMatches,
          nextMatch,
          standing: arsenalStanding,
          standings,
        }

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(parsed)
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
