import { useLocalStorage } from './useLocalStorage'

export function useSports() {
  const [handicap, setHandicap] = useLocalStorage('golf_handicap', '')
  const [rounds, setRounds] = useLocalStorage('golf_rounds', [])

  const addRound = ({ score, course, par, date, notes }) => {
    setRounds(prev => [{
      id: Date.now().toString(),
      score: Number(score),
      par: Number(par) || 72,
      course: course || 'Óskilgreint',
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
    }, ...prev])
  }

  const removeRound = (id) => setRounds(prev => prev.filter(r => r.id !== id))

  const avgScore = () => {
    if (rounds.length === 0) return null
    const last10 = rounds.slice(0, 10)
    return Math.round(last10.reduce((s, r) => s + r.score, 0) / last10.length)
  }

  const bestRound = () => {
    if (rounds.length === 0) return null
    return rounds.reduce((best, r) => r.score < best.score ? r : best)
  }

  return { handicap, setHandicap, rounds, addRound, removeRound, avgScore, bestRound }
}
