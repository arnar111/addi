import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Verktakar', icon: '💻', color: '#3b82f6' },
  { id: 'investment', label: 'Fjárfesting', icon: '📈', color: '#22c55e' },
  { id: 'gift', label: 'Gjöf', icon: '🎁', color: '#ec4899' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])

  const add = (amount, source, note = '') => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: new Date().toISOString(),
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

  return { income, add, remove, currentMonth, monthlyTotal, recent: income.slice(0, 30) }
}
