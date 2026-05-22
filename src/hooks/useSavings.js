import { useLocalStorage } from './useLocalStorage'

const DEFAULT_GOALS = [
  { id: '1', name: 'Sumarfrí', icon: '✈️', target: 300000, saved: 0, color: '#f97316' },
  { id: '2', name: 'Neyðarsjóður', icon: '🛡️', target: 500000, saved: 0, color: '#00d4aa' },
]

export function useSavings() {
  const [goals, setGoals] = useLocalStorage('addi_savings', DEFAULT_GOALS)

  const add = (goal) => setGoals(prev => [...prev, { id: Date.now().toString(), saved: 0, ...goal }])
  const remove = (id) => setGoals(prev => prev.filter(g => g.id !== id))
  const update = (id, updates) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))

  const deposit = (id, amount) =>
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g
    ))

  const withdraw = (id, amount) =>
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, saved: Math.max(0, g.saved - amount) } : g
    ))

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0)

  return { goals, add, remove, update, deposit, withdraw, totalSaved }
}
