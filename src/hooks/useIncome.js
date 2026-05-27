import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🛋️', color: '#00d4aa' },
  { id: 'laun', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'bonus', label: 'Bónus', icon: '🎁', color: '#f97316' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])

  const add = (amount, source = 'lendo', note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => {
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

  return { income, add, remove, currentMonth, monthlyTotal, bySource }
}
