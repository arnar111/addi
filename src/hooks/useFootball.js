import { useLocalStorage } from './useLocalStorage'

export function useFootball() {
  const [matches, setMatches] = useLocalStorage('addi_spurs_matches', [])
  const [nextMatch, setNextMatch] = useLocalStorage('addi_spurs_next', { opponent: '', date: '', competition: '', homeAway: 'home' })

  const addResult = ({ opponent, homeAway, goalsFor, goalsAgainst, competition, date }) => {
    const gf = Number(goalsFor)
    const ga = Number(goalsAgainst)
    const result = gf > ga ? 'W' : gf < ga ? 'L' : 'D'
    setMatches(prev => [{
      id: Date.now().toString(),
      opponent, homeAway, goalsFor: gf, goalsAgainst: ga,
      competition, date, result,
    }, ...prev].slice(0, 60))
  }

  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const season = () => {
    const W = matches.filter(m => m.result === 'W').length
    const D = matches.filter(m => m.result === 'D').length
    const L = matches.filter(m => m.result === 'L').length
    return { W, D, L, pts: W * 3 + D, played: matches.length }
  }

  const form = () =>
    matches.slice(0, 5).map(m => m.result).reverse()

  const lastMatch = matches[0] || null

  return { matches, addResult, removeMatch, nextMatch, setNextMatch, season, form, lastMatch }
}
