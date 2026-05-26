import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

async function fetchESPN(path) {
  const key = `espn_${path.replace(/\//g, '_')}`
  const atKey = `${key}_at`
  try {
    const cached = sessionStorage.getItem(key)
    const cachedAt = sessionStorage.getItem(atKey)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      return JSON.parse(cached)
    }
  } catch {}
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(atKey, String(Date.now()))
  } catch {}
  return data
}

function parseMatch(event, leagueName) {
  const comp = event.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null
  const statusType = event.status?.type
  return {
    id: event.id,
    league: leagueName,
    home: {
      name: home.team?.shortDisplayName || home.team?.name || 'Home',
      score: home.score ?? '-',
      logo: home.team?.logo,
      winner: !!home.winner,
    },
    away: {
      name: away.team?.shortDisplayName || away.team?.name || 'Away',
      score: away.score ?? '-',
      logo: away.team?.logo,
      winner: !!away.winner,
    },
    status: statusType?.name,
    statusShort: statusType?.shortDetail || statusType?.detail,
    date: new Date(event.date),
    displayClock: event.status?.displayClock,
  }
}

const LEAGUES = [
  { path: 'sports/soccer/ita.1/scoreboard', name: 'Serie A' },
  { path: 'sports/soccer/UEFA.Champions_League/scoreboard', name: 'Champions League' },
  { path: 'sports/soccer/eng.1/scoreboard', name: 'Premier League' },
  { path: 'sports/soccer/UEFA.Europa_League/scoreboard', name: 'Europa League' },
]

const WC_START = new Date('2026-06-11T00:00:00')

function parseNBAGame(event) {
  const comp = event.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  if (!home || !away) return null
  const statusType = event.status?.type
  const homeName = home.team?.displayName || home.team?.name || 'Home'
  const awayName = away.team?.displayName || away.team?.name || 'Away'
  return {
    id: event.id,
    state: statusType?.state || 'pre',
    status: statusType?.name,
    statusShort: statusType?.shortDetail || statusType?.detail || '',
    clock: event.status?.displayClock,
    period: event.status?.period,
    home: { name: homeName, abbr: home.team?.abbreviation || '', score: home.score ?? '0', winner: !!home.winner, logo: home.team?.logo },
    away: { name: awayName, abbr: away.team?.abbreviation || '', score: away.score ?? '0', winner: !!away.winner, logo: away.team?.logo },
    date: new Date(event.date),
    isKnicks: homeName.includes('Knicks') || awayName.includes('Knicks'),
  }
}

export function useSports() {
  const [football, setFootball] = useState([])
  const [golf, setGolf] = useState(null)
  const [nba, setNba] = useState([])
  const [loading, setLoading] = useState(true)

  const daysToWorldCup = Math.max(0, Math.ceil((WC_START - new Date()) / (1000 * 60 * 60 * 24)))

  useEffect(() => {
    Promise.allSettled(
      LEAGUES.map(l => fetchESPN(l.path).then(d => ({ data: d, name: l.name })))
    ).then(results => {
      const all = []
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          const { data, name } = r.value
          const events = (data.events || []).map(e => parseMatch(e, name)).filter(Boolean)
          all.push(...events)
        }
      })
      all.sort((a, b) => {
        const aLive = a.status === 'STATUS_IN_PROGRESS'
        const bLive = b.status === 'STATUS_IN_PROGRESS'
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        return b.date - a.date
      })
      setFootball(all)
      setLoading(false)
    })

    fetchESPN('sports/golf/pga/scoreboard')
      .then(data => {
        const event = data.events?.[0]
        if (!event) return
        const comp = event.competitions?.[0]
        setGolf({
          name: event.name,
          round: comp?.status?.period,
          leaders: (comp?.competitors || []).slice(0, 5).map(c => ({
            name: c.athlete?.displayName || c.athlete?.shortName || '—',
            score: c.score || 'E',
            position: c.status?.position?.displayText || '',
          })),
        })
      })
      .catch(() => {})

    fetchESPN('sports/basketball/nba/scoreboard')
      .then(data => {
        const games = (data.events || []).map(parseNBAGame).filter(Boolean)
        const knicks = games.filter(g => g.isKnicks)
        setNba(knicks.length > 0 ? knicks : games.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  return { football, golf, nba, loading, daysToWorldCup }
}
