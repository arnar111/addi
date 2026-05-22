import { useLocalStorage } from './useLocalStorage'

export const RESULT_TYPES = [
  { id: 'win', label: 'Sigur', color: '#22c55e' },
  { id: 'draw', label: 'Jafntefli', color: '#f97316' },
  { id: 'loss', label: 'Tap', color: '#ef4444' },
]

export function useSport() {
  const [matches, setMatches] = useLocalStorage('addi_matches', [])
  const [myTeams, setMyTeams] = useLocalStorage('addi_teams', [
    { id: '1', name: 'Inter Milan', flag: '⚫🔵', league: 'Serie A' },
    { id: '2', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'World Cup 2026' },
  ])

  const addMatch = (homeTeam, awayTeam, homeScore, awayScore, competition, notes = '') => {
    setMatches(prev => [{
      id: Date.now().toString(),
      homeTeam,
      awayTeam,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      competition,
      notes,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const addTeam = (name, flag = '⚽', league = '') => {
    setMyTeams(prev => [...prev, {
      id: Date.now().toString(),
      name, flag, league,
    }])
  }

  const removeTeam = (id) => setMyTeams(prev => prev.filter(t => t.id !== id))

  return { matches, addMatch, removeMatch, myTeams, addTeam, removeTeam }
}
