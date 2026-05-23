import { useLocalStorage } from './useLocalStorage'

const INITIAL_PLAYERS = [
  { id: '1', name: 'Steven Ramm', status: 'active', points: 0 },
  { id: '2', name: 'Sophie Segreti', status: 'active', points: 0 },
  { id: '3', name: 'Jake Latimer', status: 'active', points: 0 },
  { id: '4', name: 'Savannah Louie', status: 'active', points: 4 },
  { id: '5', name: 'Jason Treul', status: 'voted_out', points: 0 },
  { id: '6', name: 'Nicole Mazullo', status: 'reserve', points: 0 },
]

export function useThraukarinn() {
  const [teamName, setTeamName] = useLocalStorage('addi_thr_team', 'Lafufu')
  const [players, setPlayers] = useLocalStorage('addi_thr_players', INITIAL_PLAYERS)
  const [councils, setCouncils] = useLocalStorage('addi_thr_councils', [])
  const [season] = useLocalStorage('addi_thr_season', 50)
  const [rank, setRank] = useLocalStorage('addi_thr_rank', null)

  const updatePoints = (id, points) =>
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, points: Number(points) } : p))

  const updateStatus = (id, status) =>
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, status } : p))

  const addCouncil = ({ episode, votedOut, notes = '' }) => {
    setCouncils(prev => [{
      id: Date.now().toString(),
      episode,
      votedOut,
      notes,
      date: new Date().toISOString(),
    }, ...prev])
    if (votedOut) {
      setPlayers(prev => prev.map(p =>
        p.name === votedOut ? { ...p, status: 'voted_out' } : p
      ))
    }
  }

  const removeCouncil = (id) => setCouncils(prev => prev.filter(c => c.id !== id))

  const totalPoints = () => players
    .filter(p => p.status !== 'reserve')
    .reduce((s, p) => s + (p.points || 0), 0)

  const active = () => players.filter(p => p.status === 'active')
  const votedOut = () => players.filter(p => p.status === 'voted_out')

  return {
    teamName, setTeamName,
    players, setPlayers,
    councils,
    season,
    rank, setRank,
    updatePoints,
    updateStatus,
    addCouncil,
    removeCouncil,
    totalPoints,
    active,
    votedOut,
  }
}
