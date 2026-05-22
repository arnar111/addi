import { useLocalStorage } from './useLocalStorage'

export const CONTESTANTS = [
  { id: 1, name: 'Jason Treul', status: 'active', tribe: 'gold' },
  { id: 2, name: 'Sophi Balerdi', status: 'active', tribe: 'blue' },
  { id: 3, name: 'Rizo Velovic', status: 'active', tribe: 'red' },
  { id: 4, name: 'Savannah Louie', status: 'active', tribe: 'gold' },
  { id: 5, name: 'Jake Latimer', status: 'active', tribe: 'blue' },
  { id: 6, name: 'Sophie Segreti', status: 'active', tribe: 'red' },
  { id: 7, name: 'MC Chukwujekwu', status: 'active', tribe: 'gold' },
  { id: 8, name: 'Alex Moore', status: 'active', tribe: 'blue' },
  { id: 9, name: 'Sage Ahrens-Nichols', status: 'active', tribe: 'red' },
  { id: 10, name: 'Matt Williams', status: 'active', tribe: 'gold' },
  { id: 11, name: 'Annie Davis', status: 'active', tribe: 'blue' },
  { id: 12, name: 'Jawan Pitts', status: 'active', tribe: 'red' },
  { id: 13, name: 'Nicole Mazullo', status: 'active', tribe: 'gold' },
  { id: 14, name: 'Steven Ramm', status: 'active', tribe: 'blue' },
  { id: 15, name: 'Kristina Mills', status: 'active', tribe: 'red' },
  { id: 16, name: 'Nate Moore', status: 'active', tribe: 'gold' },
  { id: 17, name: 'Jeremiah Ing', status: 'active', tribe: 'blue' },
  { id: 18, name: 'Shannon Fairweather', status: 'active', tribe: 'red' },
]

// Arnar's team from the spreadsheet
export const MY_TEAM = {
  name: 'Lafufu',
  picks: [
    { contestantId: 14, multiplier: 1.0, role: 'Þraukari 1 (150%)' },
    { contestantId: 6, multiplier: 1.0, role: 'Þraukari 2 (120%)' },
    { contestantId: 5, multiplier: 1.0, role: 'Þraukari 3 (110%)' },
    { contestantId: 4, multiplier: 1.0, role: 'Þraukari 4 (100%)' },
    { contestantId: 1, multiplier: 1.0, role: 'Þraukari 5 (100%)' },
    { contestantId: 13, multiplier: 0.9, role: 'Varaþraukari (90%)' },
  ],
}

export function useThraukarinn() {
  const [contestants, setContestants] = useLocalStorage('thraukarinn-contestants', CONTESTANTS)
  const [episodes, setEpisodes] = useLocalStorage('thraukarinn-episodes', [])
  const [currentEpisode, setCurrentEpisode] = useLocalStorage('thraukarinn-episode', 1)
  const [myPoints, setMyPoints] = useLocalStorage('thraukarinn-points', 0)

  function eliminateContestant(id) {
    setContestants(prev => prev.map(c => c.id === id ? { ...c, status: 'eliminated' } : c))
  }

  function reviveContestant(id) {
    setContestants(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c))
  }

  function nextEpisode() {
    setCurrentEpisode(prev => prev + 1)
  }

  const active = contestants.filter(c => c.status === 'active')
  const eliminated = contestants.filter(c => c.status === 'eliminated')

  const myTeamContestants = MY_TEAM.picks.map(pick => ({
    ...pick,
    contestant: contestants.find(c => c.id === pick.contestantId),
  }))

  const activePicks = myTeamContestants.filter(p => p.contestant?.status === 'active').length

  return {
    contestants, episodes, currentEpisode, myPoints, active, eliminated,
    myTeamContestants, activePicks,
    eliminateContestant, reviveContestant, nextEpisode, setMyPoints,
  }
}
