import { useState, useEffect } from 'react'

const CACHE_KEY = 'addi_sports_v2'
const CACHE_TTL = 45 * 60 * 1000

async function fetchTeamData(searchName) {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchName)}`
  )
  const data = await res.json()
  const team = data.teams?.[0]
  if (!team) throw new Error(`Team not found: ${searchName}`)

  const [lastRes, nextRes] = await Promise.all([
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`),
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${team.idTeam}`),
  ])

  const [lastData, nextData] = await Promise.all([lastRes.json(), nextRes.json()])

  return {
    id: team.idTeam,
    name: team.strTeam,
    badge: team.strBadge,
    last: (lastData.results || []).slice(0, 5),
    next: (nextData.events || []).slice(0, 3),
  }
}

export function useSports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    Promise.all([
      fetchTeamData('Internazionale'),
      fetchTeamData('Cleveland Cavaliers'),
    ])
      .then(([inter, cavs]) => {
        const result = { inter, cavs }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

export function getMatchResult(event, myTeamName) {
  const keyword = myTeamName.toLowerCase()
  const isHome =
    event.strHomeTeam?.toLowerCase().includes(keyword) ||
    event.strHomeTeam?.toLowerCase().includes('inter') ||
    event.strHomeTeam?.toLowerCase().includes('cleveland')
  const opponent = isHome ? event.strAwayTeam : event.strHomeTeam
  const myScore = isHome ? event.intHomeScore : event.intAwayScore
  const oppScore = isHome ? event.intAwayScore : event.intHomeScore
  const hasResult = myScore !== null && myScore !== '' && oppScore !== null && oppScore !== ''
  let result = null
  if (hasResult) {
    result = Number(myScore) > Number(oppScore) ? 'W' : Number(myScore) < Number(oppScore) ? 'L' : 'D'
  }
  const dateStr = event.dateEvent
    ? new Date(event.dateEvent).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
    : ''
  return { opponent, myScore, oppScore, hasResult, result, dateStr, isHome }
}
