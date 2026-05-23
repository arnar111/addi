import { useLocalStorage } from './useLocalStorage'

export function useGolf() {
  const [rounds, setRounds] = useLocalStorage('addi_golf', [])

  const addRound = ({ course, score, par, slope }) => {
    setRounds(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString(),
      course: course || 'Óþekktur völlur',
      score: Number(score),
      par: Number(par) || 72,
      slope: Number(slope) || 113,
    }, ...prev])
  }

  const removeRound = (id) => setRounds(prev => prev.filter(r => r.id !== id))

  const handicap = () => {
    if (rounds.length < 3) return null
    const recent = rounds.slice(0, Math.min(20, rounds.length))
    const diffs = recent.map(r => (r.score - r.par) * (113 / (r.slope || 113)))
    const numBest = Math.max(1, Math.ceil(recent.length * 0.4))
    const best = [...diffs].sort((a, b) => a - b).slice(0, numBest)
    const avg = best.reduce((a, b) => a + b, 0) / best.length
    return Math.round(avg * 0.96 * 10) / 10
  }

  const avgScore = () => {
    if (!rounds.length) return null
    const recent = rounds.slice(0, 10)
    return Math.round(recent.reduce((s, r) => s + r.score, 0) / recent.length)
  }

  return { rounds, addRound, removeRound, handicap, avgScore }
}
