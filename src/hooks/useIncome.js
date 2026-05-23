import { useLocalStorage } from './useLocalStorage'

export const INCOME_CATEGORIES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#f97316' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])
  const [goal, setGoal] = useLocalStorage('addi_income_goal', 200000)

  const add = (amount, category = 'lendo', note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setIncome(prev => prev.filter(e => e.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return income.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)

  const byCategory = () => {
    const result = {}
    currentMonth().forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const lendoTotal = () => currentMonth()
    .filter(e => e.category === 'lendo')
    .reduce((s, e) => s + e.amount, 0)

  const lendoCount = () => currentMonth().filter(e => e.category === 'lendo').length

  return {
    income,
    add,
    remove,
    goal,
    setGoal,
    currentMonth,
    monthlyTotal,
    byCategory,
    lendoTotal,
    lendoCount,
    recent: income.slice(0, 20),
  }
}
