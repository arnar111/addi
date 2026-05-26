import { useState, useEffect, useCallback } from 'react'

const EPL_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard'
const NBA_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard'
const EPL_TABLE_URL = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings'

function parseGame(event) {
  const comp = event.competitions?.[0]
  const home = comp?.competitors?.find(c => c.homeAway === 'home')
  const away = comp?.competitors?.find(c => c.homeAway === 'away')
  const status = comp?.status
  return {
    id: event.id,
    home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
    homeLogo: home?.team?.logo,
    away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
    awayLogo: away?.team?.logo,
    homeScore: home?.score ?? '-',
    awayScore: away?.score ?? '-',
    status: status?.type?.state || 'pre', // pre, in, post
    statusText: status?.displayClock || status?.type?.shortDetail || '',
    clock: status?.displayClock || '',
    period: status?.period || 0,
    date: event.date,
  }
}

export function useSports() {
  const [epl, setEpl] = useState({ games: [], loading: true, error: null })
  const [nba, setNba] = useState({ games: [], loading: true, error: null })
  const [eplTable, setEplTable] = useState({ standings: [], loading: true })
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchEPL = useCallback(async () => {
    try {
      const res = await fetch(EPL_URL)
      const data = await res.json()
      const games = (data.events || []).map(parseGame)
      setEpl({ games, loading: false, error: null })
    } catch (e) {
      setEpl(prev => ({ ...prev, loading: false, error: 'Gat ekki sótt PL leiki' }))
    }
  }, [])

  const fetchNBA = useCallback(async () => {
    try {
      const res = await fetch(NBA_URL)
      const data = await res.json()
      const games = (data.events || []).map(parseGame)
      setNba({ games, loading: false, error: null })
    } catch (e) {
      setNba(prev => ({ ...prev, loading: false, error: 'Gat ekki sótt NBA leiki' }))
    }
  }, [])

  const fetchEplTable = useCallback(async () => {
    try {
      const res = await fetch(EPL_TABLE_URL)
      const data = await res.json()
      const entries = data.standings?.[0]?.entries || []
      const standings = entries.map(e => ({
        team: e.team?.shortDisplayName || e.team?.displayName,
        logo: e.team?.logos?.[0]?.href,
        abbr: e.team?.abbreviation,
        played: e.stats?.find(s => s.name === 'gamesPlayed')?.value ?? 0,
        won: e.stats?.find(s => s.name === 'wins')?.value ?? 0,
        drawn: e.stats?.find(s => s.name === 'ties')?.value ?? 0,
        lost: e.stats?.find(s => s.name === 'losses')?.value ?? 0,
        gd: e.stats?.find(s => s.name === 'pointDifferential')?.displayValue ?? '0',
        points: e.stats?.find(s => s.name === 'points')?.value ?? 0,
        position: e.stats?.find(s => s.name === 'rank')?.value ?? 0,
      })).sort((a, b) => a.position - b.position)
      setEplTable({ standings, loading: false })
    } catch (e) {
      setEplTable({ standings: [], loading: false })
    }
  }, [])

  const refresh = useCallback(() => {
    setEpl(prev => ({ ...prev, loading: true }))
    setNba(prev => ({ ...prev, loading: true }))
    Promise.all([fetchEPL(), fetchNBA(), fetchEplTable()])
      .then(() => setLastUpdated(new Date()))
  }, [fetchEPL, fetchNBA, fetchEplTable])

  useEffect(() => {
    refresh()
    // Auto-refresh every 60 seconds when games are live
    const interval = setInterval(refresh, 60_000)
    return () => clearInterval(interval)
  }, [refresh])

  const liveGames = [...epl.games, ...nba.games].filter(g => g.status === 'in')

  return { epl, nba, eplTable, liveGames, refresh, lastUpdated }
}
