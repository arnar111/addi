import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'crypto', label: 'Crypto', icon: '₿', color: '#f7931a' },
  { id: 'freelance', label: 'Frjáls vinna', icon: '💻', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#22c55e' },
]

export function useIncome() {
  const [incomes, setIncomes] = useLocalStorage('addi_incomes', [])

  const addIncome = (amount, source, note = '', date = null) => {
    setIncomes(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => {
    setIncomes(prev => prev.filter(e => e.id !== id))
  }

  const currentMonth = () => {
    const now = new Date()
    return incomes.filter(e => {
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

  const recentIncomes = incomes.slice(0, 20)

  return {
    incomes, addIncome, removeIncome,
    currentMonth, monthlyTotal, bySource,
    recentIncomes,
  }
}
