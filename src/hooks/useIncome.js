import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🏠', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#3b82f6' },
  { id: 'freelance', label: 'Verktakagreiðsla', icon: '💻', color: '#8b5cf6' },
  { id: 'investment', label: 'Fjárfesting', icon: '📈', color: '#22c55e' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#f97316' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])

  const addIncome = (amount, source, note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => setIncome(prev => prev.filter(e => e.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return income.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)

  const bySource = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(e => {
      result[e.source] = (result[e.source] || 0) + e.amount
    })
    return result
  }

  const recentIncome = income.slice(0, 20)

  return { income, addIncome, removeIncome, currentMonth, monthlyTotal, bySource, recentIncome }
}
