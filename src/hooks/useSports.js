import { useLocalStorage } from './useLocalStorage'

export function useSports() {
  const [results, setResults] = useLocalStorage('addi_arsenal_results', [
    { id: '5', opponent: 'Liverpool', homeAway: 'H', goalsFor: 3, goalsAgainst: 1, competition: 'PL', date: '2026-04-12', result: 'W' },
    { id: '4', opponent: 'Newcastle', homeAway: 'A', goalsFor: 1, goalsAgainst: 0, competition: 'PL', date: '2026-04-19', result: 'W' },
    { id: '3', opponent: 'Man City', homeAway: 'H', goalsFor: 2, goalsAgainst: 2, competition: 'PL', date: '2026-04-26', result: 'D' },
    { id: '2', opponent: 'Tottenham', homeAway: 'A', goalsFor: 2, goalsAgainst: 1, competition: 'PL', date: '2026-05-03', result: 'W' },
    { id: '1', opponent: 'Everton', homeAway: 'H', goalsFor: 3, goalsAgainst: 0, competition: 'PL', date: '2026-05-10', result: 'W' },
  ])

  const [standings, setStandings] = useLocalStorage('addi_pl_standings', [
    { pos: 1, team: 'Arsenal',      played: 37, won: 25, drawn: 8, lost: 4,  gd: 45, pts: 83 },
    { pos: 2, team: 'Liverpool',    played: 37, won: 24, drawn: 7, lost: 6,  gd: 39, pts: 79 },
    { pos: 3, team: 'Man City',     played: 37, won: 22, drawn: 6, lost: 9,  gd: 27, pts: 72 },
    { pos: 4, team: 'Chelsea',      played: 37, won: 18, drawn: 7, lost: 12, gd: 14, pts: 61 },
    { pos: 5, team: 'Newcastle',    played: 37, won: 17, drawn: 8, lost: 12, gd: 11, pts: 59 },
    { pos: 6, team: 'Aston Villa',  played: 37, won: 16, drawn: 9, lost: 12, gd: 9,  pts: 57 },
    { pos: 7, team: 'Tottenham',    played: 37, won: 15, drawn: 6, lost: 16, gd: -3, pts: 51 },
    { pos: 8, team: 'Man Utd',      played: 37, won: 13, drawn: 7, lost: 17, gd: -9, pts: 46 },
    { pos: 9, team: 'Brighton',     played: 37, won: 12, drawn: 9, lost: 16, gd: 2,  pts: 45 },
    { pos: 10, team: 'Brentford',   played: 37, won: 12, drawn: 7, lost: 18, gd: -4, pts: 43 },
  ])

  const [fixtures, setFixtures] = useLocalStorage('addi_arsenal_fixtures', [
    { id: 'f1', opponent: 'Brighton', homeAway: 'H', date: '2026-05-19', competition: 'PL' },
    { id: 'f2', opponent: 'Man Utd',  homeAway: 'A', date: '2026-05-26', competition: 'PL' },
  ])

  const addResult = (opponent, homeAway, goalsFor, goalsAgainst, competition, date) => {
    const gf = Number(goalsFor)
    const ga = Number(goalsAgainst)
    const result = gf > ga ? 'W' : gf === ga ? 'D' : 'L'
    setResults(prev => [{
      id: Date.now().toString(),
      opponent, homeAway, goalsFor: gf, goalsAgainst: ga, competition, date, result,
    }, ...prev])
  }

  const removeResult = (id) => setResults(prev => prev.filter(r => r.id !== id))

  const addFixture = (opponent, homeAway, date, competition = 'PL') => {
    setFixtures(prev => [...prev, { id: Date.now().toString(), opponent, homeAway, date, competition }])
  }

  const removeFixture = (id) => setFixtures(prev => prev.filter(f => f.id !== id))

  const sortedResults = [...results].sort((a, b) => b.date.localeCompare(a.date))
  const recentForm = sortedResults.slice(0, 5).map(r => r.result)

  const seasonStats = results.reduce((acc, r) => ({
    played: acc.played + 1,
    won: acc.won + (r.result === 'W' ? 1 : 0),
    drawn: acc.drawn + (r.result === 'D' ? 1 : 0),
    lost: acc.lost + (r.result === 'L' ? 1 : 0),
    goalsFor: acc.goalsFor + r.goalsFor,
    goalsAgainst: acc.goalsAgainst + r.goalsAgainst,
  }), { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 })

  const arsenalStanding = standings.find(s => s.team === 'Arsenal')

  const upcomingFixtures = [...fixtures]
    .filter(f => f.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    results: sortedResults.slice(0, 10),
    standings, setStandings,
    fixtures: upcomingFixtures,
    addResult, removeResult,
    addFixture, removeFixture,
    recentForm,
    seasonStats,
    arsenalStanding,
  }
}
