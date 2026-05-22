import { useState, useEffect } from 'react'

export const LEAGUES = [
  { id: 'soccer/eng.1',      label: 'PL',          icon: '⚽', full: 'Premier League' },
  { id: 'soccer/uefa.champions', label: 'UCL',     icon: '⭐', full: 'Champions League' },
  { id: 'hockey/nhl',        label: 'NHL',         icon: '🏒', full: 'NHL' },
  { id: 'soccer/esp.1',      label: 'La Liga',     icon: '🇪🇸', full: 'La Liga' },
]

function parseEvents(raw) {
  return (raw.events || []).map(e => {
    const comp = e.competitions?.[0]
    if (!comp) return null
    const home = comp.competitors?.find(c => c.homeAway === 'home')
    const away = comp.competitors?.find(c => c.homeAway === 'away')
    const status = comp.status?.type
    return {
      id: e.id,
      date: e.date,
      status: status?.name || '',
      statusShort: status?.shortDetail || status?.description || '',
      home: {
        name: home?.team?.shortDisplayName || home?.team?.displayName || '?',
        score: home?.score,
        logo: home?.team?.logo,
        winner: home?.winner,
      },
      away: {
        name: away?.team?.shortDisplayName || away?.team?.displayName || '?',
        score: away?.score,
        logo: away?.team?.logo,
        winner: away?.winner,
      },
    }
  }).filter(Boolean)
}

export function useSports() {
  const [activeLeague, setActiveLeague] = useState('soccer/eng.1')
  const [gamesByLeague, setGamesByLeague] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cacheKey = `addi_sports_${activeLeague}`
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
    const cached = sessionStorage.getItem(cacheKey)

    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setGamesByLeague(prev => ({ ...prev, [activeLeague]: JSON.parse(cached) }))
      return
    }

    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/${activeLeague}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const events = parseEvents(d)
        sessionStorage.setItem(cacheKey, JSON.stringify(events))
        sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
        setGamesByLeague(prev => ({ ...prev, [activeLeague]: events }))
        setLoading(false)
      })
      .catch(() => {
        setGamesByLeague(prev => ({ ...prev, [activeLeague]: [] }))
        setLoading(false)
      })
  }, [activeLeague])

  const games = gamesByLeague[activeLeague] || []
  const live = games.filter(g => g.status === 'STATUS_IN_PROGRESS')

  return { games, live, loading, activeLeague, setActiveLeague }
}
