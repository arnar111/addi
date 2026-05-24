import { useLocalStorage } from './useLocalStorage'

export const INCOME_CATEGORIES = [
  { id: 'lendo',    label: 'Lendó',     icon: '🏠', color: '#00d4aa' },
  { id: 'salary',   label: 'Laun',      icon: '💼', color: '#8b5cf6' },
  { id: 'freelance',label: 'Verkefni',  icon: '💻', color: '#3b82f6' },
  { id: 'other',    label: 'Annað',     icon: '💰', color: '#f97316' },
]

export function useIncome() {
  const [incomes, setIncomes] = useLocalStorage('addi_income', [])
  const [incomeGoal, setIncomeGoal] = useLocalStorage('addi_income_goal', {
    monthly: 200000,
  })

  const add = (amount, category = 'lendo', note = '', date = null) => {
    setIncomes(prev => [{
      id: Date.now().toString(),
      amount:   Number(amount),
      category,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setIncomes(prev => prev.filter(i => i.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return incomes.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, i) => s + i.amount, 0)

  const byCategory = () => {
    const result = {}
    currentMonth().forEach(i => {
      result[i.category] = (result[i.category] || 0) + i.amount
    })
    return result
  }

  return { incomes, add, remove, currentMonth, monthlyTotal, byCategory, incomeGoal, setIncomeGoal, INCOME_CATEGORIES }
}
