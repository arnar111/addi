import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendo', icon: '🏠', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#3b82f6' },
  { id: 'freelance', label: 'Verktakar', icon: '💻', color: '#8b5cf6' },
  { id: 'crypto', label: 'Crypto', icon: '🔮', color: '#9945FF' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#f97316' },
]

export function useIncome() {
  const [entries, setEntries] = useLocalStorage('addi_income', [])
  const [goal, setGoal] = useLocalStorage('addi_income_goal', { monthly: 600000 })

  const add = (amount, source = 'other', note = '', date = null) => {
    setEntries(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setEntries(prev => prev.filter(e => e.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return entries.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)

  const bySource = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(e => { result[e.source] = (result[e.source] || 0) + e.amount })
    return result
  }

  return {
    entries, add, remove,
    goal, setGoal,
    currentMonth, monthlyTotal, bySource,
    recent: entries.slice(0, 20),
  }
}
