import { useState, useEffect } from 'react'

const LEAGUES = {
  epl: { id: '4328', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', season: '2025-2026' },
  worldcup: { id: '4443', name: 'World Cup 2026', icon: '🌍', season: '2026' },
}

function cacheKey(leagueId) { return `football_${leagueId}` }
function cacheAtKey(leagueId) { return `football_${leagueId}_at` }

async function fetchLeague(leagueId) {
  const cached = sessionStorage.getItem(cacheKey(leagueId))
  const cachedAt = sessionStorage.getItem(cacheAtKey(leagueId))
  if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
    return JSON.parse(cached)
  }

  const [nextRes, pastRes] = await Promise.allSettled([
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`).then(r => r.json()),
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${leagueId}`).then(r => r.json()),
  ])

  const upcoming = nextRes.status === 'fulfilled' ? (nextRes.value.events || []).slice(0, 5) : []
  const recent = pastRes.status === 'fulfilled' ? (pastRes.value.events || []).slice(0, 5) : []

  const data = { upcoming, recent }
  sessionStorage.setItem(cacheKey(leagueId), JSON.stringify(data))
  sessionStorage.setItem(cacheAtKey(leagueId), String(Date.now()))
  return data
}

export function useFootball() {
  const [league, setLeague] = useState('epl')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const info = LEAGUES[league]
    if (!info) return
    fetchLeague(info.id)
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [league])

  return { league, setLeague, data, loading, error, leagues: LEAGUES }
}
