import { useLocalStorage } from './useLocalStorage'

const WEIGHTS = [1.5, 1.2, 1.1, 1.0, 1.0, 0.9]

const DEFAULT_CAST = [
  'Survivor 1', 'Survivor 2', 'Survivor 3', 'Survivor 4', 'Survivor 5',
  'Survivor 6', 'Survivor 7', 'Survivor 8', 'Survivor 9', 'Survivor 10',
  'Survivor 11', 'Survivor 12', 'Survivor 13', 'Survivor 14', 'Survivor 15',
  'Survivor 16', 'Survivor 17', 'Survivor 18',
]

const DEFAULT_PLAYERS = []

export function useThraukarinn() {
  const [season, setSeason] = useLocalStorage('thraukarinn-season', { number: 50, name: 'Survivor 50' })
  const [cast, setCast] = useLocalStorage('thraukarinn-cast', DEFAULT_CAST)
  const [eliminated, setEliminated] = useLocalStorage('thraukarinn-eliminated', [])
  const [players, setPlayers] = useLocalStorage('thraukarinn-players', DEFAULT_PLAYERS)
  const [weeklyPoints, setWeeklyPoints] = useLocalStorage('thraukarinn-weekly', {})

  const activeCast = cast.filter(n => !eliminated.includes(n))

  const eliminate = (name) => setEliminated(prev => [...prev, name])
  const revive = (name) => setEliminated(prev => prev.filter(n => n !== name))

  const calcPlayerScore = (player) => {
    const slots = [...(player.team || []), player.backup].filter(Boolean)
    return slots.reduce((sum, survivor, i) => {
      const w = WEIGHTS[i] || 1.0
      const pts = weeklyPoints[survivor] || 0
      const alive = !eliminated.includes(survivor)
      return sum + (alive ? pts * w : 0)
    }, 0)
  }

  const standings = [...players]
    .map(p => ({ ...p, score: calcPlayerScore(p) }))
    .sort((a, b) => b.score - a.score)

  const addPlayer = (p) => setPlayers(prev => [...prev, { ...p, id: crypto.randomUUID() }])
  const removePlayer = (id) => setPlayers(prev => prev.filter(p => p.id !== id))
  const updatePlayer = (id, updates) => setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))

  const addPoints = (survivor, pts) =>
    setWeeklyPoints(prev => ({ ...prev, [survivor]: (prev[survivor] || 0) + pts }))
  const setPoints = (survivor, pts) =>
    setWeeklyPoints(prev => ({ ...prev, [survivor]: pts }))

  const addCastMember = (name) => setCast(prev => [...prev, name])
  const removeCastMember = (name) => {
    setCast(prev => prev.filter(n => n !== name))
    setEliminated(prev => prev.filter(n => n !== name))
  }

  return {
    season, setSeason,
    cast, activeCast, eliminated,
    players, standings,
    weeklyPoints,
    eliminate, revive,
    addPlayer, removePlayer, updatePlayer,
    addPoints, setPoints,
    addCastMember, removeCastMember,
    WEIGHTS,
  }
}
