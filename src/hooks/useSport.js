import { useLocalStorage } from './useLocalStorage'

export const WC_START = new Date('2026-06-11T20:00:00Z')
export const WC_FINAL = new Date('2026-07-19T20:00:00Z')

export function wcCountdown() {
  const now = new Date()
  const diff = WC_START.getTime() - now.getTime()
  if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0 }
  return {
    started: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  }
}

export function useGolf() {
  const [rounds, setRounds] = useLocalStorage('addi_golf_rounds', [])
  const [handicap, setHandicap] = useLocalStorage('addi_handicap', 18)

  const addRound = ({ course, score, par = 72, date = null, notes = '' }) => {
    setRounds(prev => [{
      id: Date.now().toString(),
      course,
      score: Number(score),
      par: Number(par),
      diff: Number(score) - Number(par),
      date: date || new Date().toISOString(),
      notes,
    }, ...prev])
  }

  const removeRound = id => setRounds(prev => prev.filter(r => r.id !== id))

  const recentRounds = rounds.slice(0, 10)
  const avgDiff = recentRounds.length
    ? Math.round(recentRounds.reduce((s, r) => s + r.diff, 0) / recentRounds.length)
    : null
  const bestRound = rounds.length ? rounds.reduce((b, r) => r.diff < b.diff ? r : b, rounds[0]) : null

  return { rounds, recentRounds, addRound, removeRound, handicap, setHandicap, avgDiff, bestRound }
}

export function useFootball() {
  const [matches, setMatches] = useLocalStorage('addi_matches', [])

  const addMatch = ({ team1, team2, score1, score2, competition = 'Leikur', date = null }) => {
    setMatches(prev => [{
      id: Date.now().toString(),
      team1, team2,
      score1: Number(score1), score2: Number(score2),
      competition,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeMatch = id => setMatches(prev => prev.filter(m => m.id !== id))

  return { matches, addMatch, removeMatch }
}
