import { useLocalStorage } from './useLocalStorage'

export function useGoals() {
  const [savings, setSavings] = useLocalStorage('addi_savings', [
    { id: '1', name: 'Sumarfrí', icon: '✈️', target: 500000, current: 0, color: '#00d4aa', deadline: '2026-07-15' },
    { id: '2', name: 'Neyðarsjóður', icon: '🛡️', target: 1000000, current: 0, color: '#8b5cf6', deadline: null },
    { id: '3', name: 'Nýr tölvupóll', icon: '💻', target: 300000, current: 0, color: '#3b82f6', deadline: '2026-12-31' },
  ])

  const [goals, setGoals] = useLocalStorage('addi_life_goals', [
    { id: '1', text: 'Klára Claude námskeið', done: false, category: 'work', icon: '🤖' },
    { id: '2', text: 'Lesa 12 bækur á árinu', done: false, category: 'personal', icon: '📚' },
    { id: '3', text: 'Hlaupa 5km án hlés', done: false, category: 'health', icon: '🏃' },
    { id: '4', text: 'Taka lendoapp.is á næsta stig', done: false, category: 'work', icon: '🚀' },
  ])

  const addSavingsGoal = ({ name, icon = '💰', target, color = '#00d4aa', deadline = null }) => {
    setSavings(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, target: Number(target), current: 0, color, deadline,
    }])
  }

  const updateProgress = (id, delta) => {
    setSavings(prev => prev.map(g =>
      g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + Number(delta))) } : g
    ))
  }

  const setProgress = (id, amount) => {
    setSavings(prev => prev.map(g =>
      g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, Number(amount))) } : g
    ))
  }

  const removeSavingsGoal = (id) => setSavings(prev => prev.filter(g => g.id !== id))

  const addGoal = ({ text, category = 'personal', icon = '⭐' }) => {
    setGoals(prev => [...prev, { id: Date.now().toString(), text, done: false, category, icon }])
  }

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g))
  }

  const removeGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id))

  const totalSaved = savings.reduce((s, g) => s + g.current, 0)
  const totalTarget = savings.reduce((s, g) => s + g.target, 0)
  const goalsCompleted = goals.filter(g => g.done).length

  return {
    savings, goals,
    addSavingsGoal, updateProgress, setProgress, removeSavingsGoal,
    addGoal, toggleGoal, removeGoal,
    totalSaved, totalTarget, goalsCompleted,
  }
}
