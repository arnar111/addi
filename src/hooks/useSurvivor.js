import { useLocalStorage } from './useLocalStorage'

// Þraukarinn S50 - Survivor Season 50: Winners at War 2
// Contestants from the spreadsheet data
export const S50_CONTESTANTS = [
  'Jason Treul', 'Kristina Mills', 'Sophie Segreti', 'MC Chukwujekwu',
  'Jawan Pitts', 'Sophi Balerdi', 'Jake Latimer', 'Savannah Louie',
  'Alex Moore', 'Rizo Velovic', 'Steven Ramm', 'Sage Ahrens-Nichols',
  'Nate Moore', 'Nicole Mazullo', 'Annie Davis', 'Matt Williams',
  'Jeremiah Ing', 'Shannon Fairweather',
]

// Multipliers per slot
export const SLOTS = [
  { key: 'p1', label: 'Þraukari 1', multiplier: 1.5, color: '#f97316' },
  { key: 'p2', label: 'Þraukari 2', multiplier: 1.2, color: '#eab308' },
  { key: 'p3', label: 'Þraukari 3', multiplier: 1.1, color: '#22c55e' },
  { key: 'p4', label: 'Þraukari 4', multiplier: 1.0, color: '#3b82f6' },
  { key: 'p5', label: 'Þraukari 5', multiplier: 1.0, color: '#8b5cf6' },
  { key: 'backup', label: 'Varaþraukari', multiplier: 0.9, color: '#64748b' },
]

export function useSurvivor() {
  const [myTeam, setMyTeam] = useLocalStorage('addi_survivor_team', {
    name: 'Lið Adda',
    picks: { p1: '', p2: '', p3: '', p4: '', p5: '', backup: '' },
    active: true,
  })

  const [scores, setScores] = useLocalStorage('addi_survivor_scores', [])
  const [eliminated, setEliminated] = useLocalStorage('addi_survivor_eliminated', [])

  const updatePick = (slot, contestant) => {
    setMyTeam(prev => ({ ...prev, picks: { ...prev.picks, [slot]: contestant } }))
  }

  const updateName = (name) => {
    setMyTeam(prev => ({ ...prev, name }))
  }

  const addEpisodeScore = (episode, contestantScores) => {
    setScores(prev => {
      const existing = prev.find(s => s.episode === episode)
      if (existing) return prev.map(s => s.episode === episode ? { ...s, scores: contestantScores } : s)
      return [...prev, { episode, scores: contestantScores, date: new Date().toISOString() }]
    })
  }

  const toggleEliminated = (name) => {
    setEliminated(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const myTotalPoints = () => {
    let total = 0
    scores.forEach(ep => {
      SLOTS.forEach(slot => {
        const pick = myTeam.picks[slot.key]
        if (pick && ep.scores[pick]) {
          total += ep.scores[pick] * slot.multiplier
        }
      })
    })
    return Math.round(total * 10) / 10
  }

  const activePicks = SLOTS.filter(s => {
    const pick = myTeam.picks[s.key]
    return pick && !eliminated.includes(pick)
  })

  return {
    myTeam,
    updatePick,
    updateName,
    scores,
    addEpisodeScore,
    eliminated,
    toggleEliminated,
    myTotalPoints,
    activePicks,
  }
}
