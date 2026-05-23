import { useLocalStorage } from './useLocalStorage'

export const HOLES = Array.from({ length: 18 }, (_, i) => i + 1)

const DEFAULT_PARS = [4,4,3,5,4,3,4,5,4, 4,3,5,4,4,3,5,4,4]

export function useGolf() {
  const [rounds, setRounds] = useLocalStorage('addi_golf_rounds', [])

  const addRound = (course, date, pars = DEFAULT_PARS) => {
    const round = {
      id: Date.now().toString(),
      course: course || 'Golfvöllur',
      date: date || new Date().toISOString().split('T')[0],
      pars: pars,
      scores: Array(18).fill(''),
      notes: '',
      createdAt: new Date().toISOString(),
    }
    setRounds(prev => [round, ...prev])
    return round.id
  }

  const updateScore = (roundId, hole, score) => {
    setRounds(prev => prev.map(r => {
      if (r.id !== roundId) return r
      const scores = [...r.scores]
      scores[hole] = score === '' ? '' : Number(score)
      return { ...r, scores }
    }))
  }

  const updateRound = (roundId, fields) => {
    setRounds(prev => prev.map(r => r.id === roundId ? { ...r, ...fields } : r))
  }

  const deleteRound = (roundId) => {
    setRounds(prev => prev.filter(r => r.id !== roundId))
  }

  const totalScore = (round) => round.scores.reduce((s, x) => s + (Number(x) || 0), 0)
  const totalPar = (round) => round.pars.reduce((s, x) => s + x, 0)
  const scoreToPar = (round) => {
    const played = round.scores.filter(s => s !== '' && s !== null).length
    if (played === 0) return null
    const parPlayed = round.pars.slice(0, played).reduce((s, x) => s + x, 0)
    const scoreTotal = round.scores.slice(0, played).reduce((s, x) => s + (Number(x) || 0), 0)
    return scoreTotal - parPlayed
  }

  const bestRound = rounds.length > 0
    ? rounds.reduce((best, r) => {
        const stp = scoreToPar(r)
        if (stp === null) return best
        return best === null || stp < scoreToPar(best) ? r : best
      }, null)
    : null

  const avgScore = () => {
    const completed = rounds.filter(r => r.scores.filter(s => s !== '').length >= 9)
    if (!completed.length) return null
    return Math.round(completed.reduce((s, r) => s + totalScore(r), 0) / completed.length)
  }

  return {
    rounds, addRound, updateScore, updateRound, deleteRound,
    totalScore, totalPar, scoreToPar, bestRound, avgScore,
    HOLES, DEFAULT_PARS,
  }
}
