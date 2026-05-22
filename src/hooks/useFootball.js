import { useState, useEffect } from 'react'

const BASE = 'https://api.football-data.org/v4'

const DEMO_WC_MATCHES = [
  { id: 1, utcDate: '2026-06-11T20:00:00Z', status: 'TIMED', homeTeam: { name: 'Mexico', crest: '🇲🇽' }, awayTeam: { name: 'USA', crest: '🇺🇸' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
  { id: 2, utcDate: '2026-06-12T17:00:00Z', status: 'TIMED', homeTeam: { name: 'England', crest: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, awayTeam: { name: 'Serbia', crest: '🇷🇸' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
  { id: 3, utcDate: '2026-06-13T20:00:00Z', status: 'TIMED', homeTeam: { name: 'Argentina', crest: '🇦🇷' }, awayTeam: { name: 'Canada', crest: '🇨🇦' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
  { id: 4, utcDate: '2026-06-14T17:00:00Z', status: 'TIMED', homeTeam: { name: 'Portugal', crest: '🇵🇹' }, awayTeam: { name: 'Morocco', crest: '🇲🇦' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
  { id: 5, utcDate: '2026-06-15T20:00:00Z', status: 'TIMED', homeTeam: { name: 'France', crest: '🇫🇷' }, awayTeam: { name: 'Belgium', crest: '🇧🇪' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
  { id: 6, utcDate: '2026-06-16T17:00:00Z', status: 'TIMED', homeTeam: { name: 'Brazil', crest: '🇧🇷' }, awayTeam: { name: 'Australia', crest: '🇦🇺' }, score: { fullTime: { home: null, away: null } }, competition: { name: 'FIFA World Cup 2026', emblem: '🏆' } },
]

const DEMO_PL_TABLE = [
  { position: 1, team: { name: 'Liverpool', crest: '🔴' }, playedGames: 38, won: 28, draw: 6, lost: 4, points: 90, goalDifference: 52 },
  { position: 2, team: { name: 'Arsenal', crest: '🔴' }, playedGames: 38, won: 27, draw: 5, lost: 6, points: 86, goalDifference: 48 },
  { position: 3, team: { name: 'Manchester City', crest: '🔵' }, playedGames: 38, won: 24, draw: 8, lost: 6, points: 80, goalDifference: 37 },
  { position: 4, team: { name: 'Aston Villa', crest: '🟣' }, playedGames: 38, won: 22, draw: 7, lost: 9, points: 73, goalDifference: 24 },
  { position: 5, team: { name: 'Chelsea', crest: '🔵' }, playedGames: 38, won: 20, draw: 9, lost: 9, points: 69, goalDifference: 20 },
  { position: 6, team: { name: 'Newcastle', crest: '⚫' }, playedGames: 38, won: 19, draw: 7, lost: 12, points: 64, goalDifference: 15 },
  { position: 7, team: { name: 'Tottenham', crest: '⚪' }, playedGames: 38, won: 17, draw: 8, lost: 13, points: 59, goalDifference: 8 },
  { position: 8, team: { name: 'Man United', crest: '🔴' }, playedGames: 38, won: 15, draw: 7, lost: 16, points: 52, goalDifference: -5 },
]

const DEMO_RECENT = [
  { id: 10, utcDate: '2026-05-18T15:30:00Z', status: 'FINISHED', homeTeam: { name: 'Liverpool', crest: '🔴' }, awayTeam: { name: 'Crystal Palace', crest: '🦅' }, score: { fullTime: { home: 3, away: 0 } }, competition: { name: 'Premier League' } },
  { id: 11, utcDate: '2026-05-18T15:30:00Z', status: 'FINISHED', homeTeam: { name: 'Inter Milan', crest: '⚫🔵' }, awayTeam: { name: 'Napoli', crest: '🔵' }, score: { fullTime: { home: 2, away: 1 } }, competition: { name: 'Serie A' } },
  { id: 12, utcDate: '2026-05-11T14:00:00Z', status: 'FINISHED', homeTeam: { name: 'Arsenal', crest: '🔴' }, awayTeam: { name: 'Liverpool', crest: '🔴' }, score: { fullTime: { home: 1, away: 2 } }, competition: { name: 'Premier League' } },
]

export function useFootball() {
  const [matches, setMatches] = useState([])
  const [table, setTable] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('addi_football_key') || '')
  const [demoMode, setDemoMode] = useState(!localStorage.getItem('addi_football_key'))

  const wcDate = new Date('2026-06-11T20:00:00Z')
  const daysToWC = Math.max(0, Math.ceil((wcDate - new Date()) / 86400000))

  useEffect(() => {
    const key = localStorage.getItem('addi_football_key')
    if (!key) {
      setMatches(DEMO_WC_MATCHES)
      setTable(DEMO_PL_TABLE)
      setRecent(DEMO_RECENT)
      setDemoMode(true)
      setLoading(false)
      return
    }

    const cached = sessionStorage.getItem('football_data')
    const cachedAt = sessionStorage.getItem('football_data_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      const d = JSON.parse(cached)
      setMatches(d.matches || DEMO_WC_MATCHES)
      setTable(d.table || DEMO_PL_TABLE)
      setRecent(d.recent || DEMO_RECENT)
      setDemoMode(false)
      setLoading(false)
      return
    }

    const headers = { 'X-Auth-Token': key }
    Promise.all([
      fetch(`${BASE}/competitions/WC/matches?status=SCHEDULED&limit=8`, { headers }).then(r => r.json()).catch(() => null),
      fetch(`${BASE}/competitions/PL/standings`, { headers }).then(r => r.json()).catch(() => null),
      fetch(`${BASE}/competitions/PL/matches?status=FINISHED&limit=5`, { headers }).then(r => r.json()).catch(() => null),
    ]).then(([wc, pl, fin]) => {
      const m = wc?.matches?.length ? wc.matches : DEMO_WC_MATCHES
      const t = pl?.standings?.[0]?.table?.slice(0, 8) || DEMO_PL_TABLE
      const r = fin?.matches?.length ? fin.matches.slice(0, 5) : DEMO_RECENT
      setMatches(m)
      setTable(t)
      setRecent(r)
      setDemoMode(false)
      sessionStorage.setItem('football_data', JSON.stringify({ matches: m, table: t, recent: r }))
      sessionStorage.setItem('football_data_at', String(Date.now()))
      setLoading(false)
    }).catch(() => {
      setMatches(DEMO_WC_MATCHES)
      setTable(DEMO_PL_TABLE)
      setRecent(DEMO_RECENT)
      setDemoMode(true)
      setLoading(false)
    })
  }, [apiKey])

  const saveKey = (key) => {
    localStorage.setItem('addi_football_key', key)
    sessionStorage.removeItem('football_data')
    setApiKey(key)
    setDemoMode(!key)
  }

  return { matches, table, recent, loading, demoMode, daysToWC, saveKey, apiKey }
}
