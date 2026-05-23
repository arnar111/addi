import { useLocalStorage } from './useLocalStorage'
import { useState, useEffect } from 'react'

export const DEFAULT_TEAMS = [
  { id: '133602', name: 'Liverpool', shortName: 'LIV', league: 'English Premier League', country: 'England', badge: 'https://www.thesportsdb.com/images/media/team/badge/xzqdr31575988923.png' },
  { id: '133604', name: 'Arsenal', shortName: 'ARS', league: 'English Premier League', country: 'England', badge: 'https://www.thesportsdb.com/images/media/team/badge/a1af2i1557005128.png' },
]

const CACHE_MS = 30 * 60 * 1000

async function fetchTeamData(teamId) {
  const key = `addi_sport_${teamId}`
  const keyAt = `addi_sport_${teamId}_at`
  const cached = sessionStorage.getItem(key)
  const cachedAt = sessionStorage.getItem(keyAt)
  if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
    return JSON.parse(cached)
  }
  try {
    const [lastRes, nextRes] = await Promise.all([
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`),
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`),
    ])
    const [lastData, nextData] = await Promise.all([lastRes.json(), nextRes.json()])
    const result = {
      last: (lastData.results || []).slice(-5),
      next: (nextData.events || []).slice(0, 2),
    }
    sessionStorage.setItem(key, JSON.stringify(result))
    sessionStorage.setItem(keyAt, String(Date.now()))
    return result
  } catch {
    return { last: [], next: [] }
  }
}

export function getResultForTeam(event, teamName) {
  const h = parseInt(event.intHomeScore)
  const a = parseInt(event.intAwayScore)
  if (isNaN(h) || isNaN(a)) return null
  const name = teamName.toLowerCase()
  const home = event.strHomeTeam?.toLowerCase() || ''
  const isHome = home.includes(name) || name.includes(home.split(' ')[0])
  if (isHome) return h > a ? 'W' : h < a ? 'L' : 'D'
  return a > h ? 'W' : a < h ? 'L' : 'D'
}

export function useSports() {
  const [teams, setTeams] = useLocalStorage('addi_sports_teams', DEFAULT_TEAMS)
  const [events, setEvents] = useState({})
  const [fetchedIds, setFetchedIds] = useState('')
  const teamIds = teams.map(t => t.id).join(',')
  const loading = !!teamIds && fetchedIds !== teamIds

  useEffect(() => {
    if (!teamIds) return
    Promise.all(teams.map(t => fetchTeamData(t.id).then(ev => ({ id: t.id, ev }))))
      .then(results => {
        const map = {}
        results.forEach(r => { map[r.id] = r.ev })
        setEvents(map)
        setFetchedIds(teamIds)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIds])

  const addTeam = (team) => {
    if (teams.find(t => t.id === team.id)) return
    setTeams(prev => [...prev, team])
  }

  const removeTeam = (id) => {
    setTeams(prev => prev.filter(t => t.id !== id))
    setEvents(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const searchTeams = async (query) => {
    if (!query || query.length < 2) return []
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`)
      const data = await res.json()
      return (data.teams || []).slice(0, 6).map(t => ({
        id: t.idTeam,
        name: t.strTeam,
        shortName: t.strTeamShort || t.strTeam.slice(0, 3).toUpperCase(),
        league: t.strLeague,
        country: t.strCountry,
        badge: t.strBadge || '',
      }))
    } catch {
      return []
    }
  }

  return { teams, events, loading, addTeam, removeTeam, searchTeams }
}
