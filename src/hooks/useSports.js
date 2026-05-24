import { useLocalStorage } from './useLocalStorage'

export const WORLD_CUP_START = new Date('2026-06-11T00:00:00')
export const WORLD_CUP_END = new Date('2026-07-19T00:00:00')

export const FAVE_TEAMS = [
  { id: 'usmnt', name: 'USMNT', flag: '🇺🇸', league: 'Landsliðið' },
  { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Landsliðið' },
  { id: 'mancity', name: 'Man City', flag: '🩵', league: 'Premier League' },
  { id: 'tottenham', name: 'Tottenham', flag: '⚪', league: 'Premier League' },
  { id: 'iceland', name: 'Ísland', flag: '🇮🇸', league: 'Landsliðið' },
]

export function useSports() {
  const [matches, setMatches] = useLocalStorage('addi_sports_matches', [])
  const [wcNotes, setWcNotes] = useLocalStorage('addi_wc_notes', '')
  const [tennisNotes, setTennisNotes] = useLocalStorage('addi_tennis_notes', '')

  const addMatch = ({ team, opponent, teamScore, opponentScore, competition, date, notes = '' }) => {
    setMatches(prev => [{
      id: Date.now().toString(),
      team,
      opponent,
      teamScore: Number(teamScore),
      opponentScore: Number(opponentScore),
      competition,
      date,
      notes,
      result: Number(teamScore) > Number(opponentScore) ? 'win'
        : Number(teamScore) < Number(opponentScore) ? 'loss' : 'draw',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const recentMatches = [...matches]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  const daysUntilWC = () => {
    const diff = WORLD_CUP_START - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const wcIsLive = () => {
    const now = new Date()
    return now >= WORLD_CUP_START && now <= WORLD_CUP_END
  }

  const teamRecord = (teamId) => {
    const teamMatches = matches.filter(m => m.team === teamId)
    return {
      w: teamMatches.filter(m => m.result === 'win').length,
      d: teamMatches.filter(m => m.result === 'draw').length,
      l: teamMatches.filter(m => m.result === 'loss').length,
    }
  }

  return {
    matches, addMatch, removeMatch, recentMatches,
    wcNotes, setWcNotes,
    tennisNotes, setTennisNotes,
    daysUntilWC, wcIsLive, teamRecord,
  }
}
