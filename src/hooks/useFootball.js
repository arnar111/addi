import { useState, useEffect } from 'react'

export function useFootball() {
  const [table, setTable] = useState(null)
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const CACHE_KEY = 'addi_football_v2'
    const CACHE_DURATION = 30 * 60 * 1000

    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_DURATION) {
          setTable(data.table)
          setMatches(data.matches)
          setLoading(false)
          return
        }
      } catch {}
    }

    Promise.all([
      fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings').then(r => r.json()),
      fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard').then(r => r.json()),
    ]).then(([standingsData, scoresData]) => {
      const entries = standingsData.standings?.[0]?.entries || []
      const tbl = entries.map((e, i) => {
        const stats = {}
        e.stats?.forEach(s => { stats[s.name] = s.value })
        const name = e.team.shortDisplayName || e.team.displayName || ''
        return {
          pos: i + 1,
          name,
          abbr: e.team.abbreviation || '',
          logo: e.team.logos?.[0]?.href || null,
          played: Math.round(stats.gamesPlayed || 0),
          won: Math.round(stats.wins || 0),
          drawn: Math.round(stats.ties || 0),
          lost: Math.round(stats.losses || 0),
          gd: Math.round(stats.pointDifferential || stats.goalDifference || 0),
          points: Math.round(stats.points || 0),
          isArsenal: name.includes('Arsenal') || (e.team.displayName || '').includes('Arsenal'),
        }
      })

      const events = scoresData.events || []
      const mts = events.slice(0, 12).map(ev => {
        const comp = ev.competitions?.[0]
        const home = comp?.competitors?.find(c => c.homeAway === 'home')
        const away = comp?.competitors?.find(c => c.homeAway === 'away')
        const homeName = home?.team?.shortDisplayName || home?.team?.displayName || ''
        const awayName = away?.team?.shortDisplayName || away?.team?.displayName || ''
        return {
          id: ev.id,
          date: ev.date,
          status: comp?.status?.type?.shortDetail || '',
          statusState: comp?.status?.type?.state || 'pre',
          home: homeName,
          away: awayName,
          homeScore: home?.score || '',
          awayScore: away?.score || '',
          isArsenal: homeName.includes('Arsenal') || awayName.includes('Arsenal'),
        }
      })

      const data = { table: tbl, matches: mts }
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
      } catch {}
      setTable(tbl)
      setMatches(mts)
      setLoading(false)
    }).catch(() => {
      setTable(FALLBACK_TABLE)
      setMatches(FALLBACK_MATCHES)
      setLoading(false)
    })
  }, [])

  const arsenalRow = table?.find(t => t.isArsenal)

  return { table, matches, loading, arsenalRow }
}

const FALLBACK_TABLE = [
  { pos: 1, name: 'Liverpool', abbr: 'LIV', played: 38, won: 28, drawn: 6, lost: 4, gd: 52, points: 90 },
  { pos: 2, name: 'Arsenal', abbr: 'ARS', played: 38, won: 26, drawn: 7, lost: 5, gd: 45, points: 85, isArsenal: true },
  { pos: 3, name: 'Man City', abbr: 'MCI', played: 38, won: 24, drawn: 4, lost: 10, gd: 36, points: 76 },
  { pos: 4, name: 'Chelsea', abbr: 'CHE', played: 38, won: 21, drawn: 6, lost: 11, gd: 18, points: 69 },
  { pos: 5, name: 'Tottenham', abbr: 'TOT', played: 38, won: 18, drawn: 7, lost: 13, gd: 12, points: 61 },
  { pos: 6, name: 'Newcastle', abbr: 'NEW', played: 38, won: 17, drawn: 8, lost: 13, gd: 8, points: 59 },
  { pos: 7, name: 'Aston Villa', abbr: 'AVL', played: 38, won: 16, drawn: 6, lost: 16, gd: 5, points: 54 },
  { pos: 8, name: 'Brighton', abbr: 'BHA', played: 38, won: 14, drawn: 9, lost: 15, gd: 1, points: 51 },
  { pos: 9, name: 'Man Utd', abbr: 'MUN', played: 38, won: 12, drawn: 6, lost: 20, gd: -15, points: 42 },
  { pos: 10, name: 'West Ham', abbr: 'WHU', played: 38, won: 11, drawn: 6, lost: 21, gd: -20, points: 39 },
  { pos: 11, name: 'Wolves', abbr: 'WOL', played: 38, won: 11, drawn: 5, lost: 22, gd: -22, points: 38 },
  { pos: 12, name: 'Fulham', abbr: 'FUL', played: 38, won: 10, drawn: 7, lost: 21, gd: -18, points: 37 },
  { pos: 13, name: 'Everton', abbr: 'EVE', played: 38, won: 10, drawn: 6, lost: 22, gd: -24, points: 36 },
  { pos: 14, name: 'Brentford', abbr: 'BRE', played: 38, won: 10, drawn: 6, lost: 22, gd: -21, points: 36 },
  { pos: 15, name: 'Crystal Palace', abbr: 'CRY', played: 38, won: 10, drawn: 5, lost: 23, gd: -25, points: 35 },
  { pos: 16, name: 'Bournemouth', abbr: 'BOU', played: 38, won: 9, drawn: 7, lost: 22, gd: -26, points: 34 },
  { pos: 17, name: 'Nottm Forest', abbr: 'NFO', played: 38, won: 9, drawn: 6, lost: 23, gd: -28, points: 33 },
  { pos: 18, name: 'Leicester', abbr: 'LEI', played: 38, won: 7, drawn: 5, lost: 26, gd: -40, points: 26 },
  { pos: 19, name: 'Ipswich', abbr: 'IPS', played: 38, won: 6, drawn: 4, lost: 28, gd: -44, points: 22 },
  { pos: 20, name: 'Southampton', abbr: 'SOU', played: 38, won: 4, drawn: 5, lost: 29, gd: -53, points: 17 },
]

const FALLBACK_MATCHES = []
