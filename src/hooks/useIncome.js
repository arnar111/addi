import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🏷️', color: '#00d4aa' },
  { id: 'vinna', label: 'Vinna', icon: '💼', color: '#8b5cf6' },
  { id: 'thraukarinn', label: 'Þraukarinn', icon: '🏝️', color: '#f97316' },
  { id: 'annad', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useIncome() {
  const [incomes, setIncomes] = useLocalStorage('addi_incomes', [])
  const [rentalGoal, setRentalGoal] = useLocalStorage('addi_rental_goal', 200000)

  const addIncome = (amount, source = 'lendo', note = '', date = null) => {
    setIncomes(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => setIncomes(prev => prev.filter(e => e.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return incomes.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)

  const bySource = () => {
    const result = {}
    currentMonth().forEach(e => {
      result[e.source] = (result[e.source] || 0) + e.amount
    })
    return result
  }

  const goalProgress = () => Math.min(100, Math.round((monthlyTotal() / rentalGoal) * 100))

  return {
    incomes,
    addIncome,
    removeIncome,
    rentalGoal,
    setRentalGoal,
    currentMonth,
    monthlyTotal,
    bySource,
    goalProgress,
    recentIncomes: incomes.slice(0, 30),
  }
}
