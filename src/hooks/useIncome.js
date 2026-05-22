import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'laun', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#f97316' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_income_goal', 200000)

  const addIncome = (amount, source, note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => {
    setIncome(prev => prev.filter(i => i.id !== id))
  }

  const currentMonth = () => {
    const now = new Date()
    return income.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, i) => s + i.amount, 0)

  const bySource = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(i => {
      result[i.source] = (result[i.source] || 0) + i.amount
    })
    return result
  }

  return {
    income, addIncome, removeIncome,
    monthlyGoal, setMonthlyGoal,
    currentMonth, monthlyTotal, bySource,
    recentIncome: income.slice(0, 30),
  }
}
