import { useLocalStorage } from './useLocalStorage'

export const INCOME_CATEGORIES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#8b5cf6' },
  { id: 'solana', label: 'Crypto', icon: '⚡', color: '#f59e0b' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])

  const addIncome = (amount, category, note = '') => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => setIncome(prev => prev.filter(i => i.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return income.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, i) => s + i.amount, 0)

  const recentIncome = income.slice(0, 20)

  return { income, addIncome, removeIncome, currentMonth, monthlyTotal, recentIncome }
}
