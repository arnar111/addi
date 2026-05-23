import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🏠', color: '#00d4aa' },
  { id: 'laun', label: 'Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'other_in', label: 'Annað', icon: '💰', color: '#64748b' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Matur', icon: '🍽️', color: '#f97316' },
  { id: 'transport', label: 'Samgöngur', icon: '🚗', color: '#3b82f6' },
  { id: 'housing', label: 'Húsnæði', icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment', label: 'Afþreying', icon: '🎮', color: '#ec4899' },
  { id: 'health', label: 'Heilsa', icon: '💊', color: '#22c55e' },
  { id: 'shopping', label: 'Innkaup', icon: '🛍️', color: '#eab308' },
  { id: 'subscriptions', label: 'Áskriftir', icon: '📱', color: '#00d4aa' },
  { id: 'other', label: 'Annað', icon: '💸', color: '#64748b' },
]

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [income, setIncome] = useLocalStorage('addi_income', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 400000,
    incomeGoal: 200000,
    categories: {
      food: 80000,
      transport: 30000,
      housing: 150000,
      entertainment: 30000,
      health: 20000,
      shopping: 40000,
      subscriptions: 15000,
      other: 35000,
    },
  })

  const addExpense = (amount, category, note = '', date = null) => {
    setExpenses(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

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
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const currentMonthIncome = () => {
    const now = new Date()
    return income.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)
  const monthlyIncome = () => currentMonthIncome().reduce((s, i) => s + i.amount, 0)
  const netBalance = () => monthlyIncome() - monthlyTotal()

  const byCategory = () => {
    const result = {}
    currentMonth().forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const bySource = () => {
    const result = {}
    currentMonthIncome().forEach(i => {
      result[i.source] = (result[i.source] || 0) + i.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 30)
  const recentIncome = income.slice(0, 30)

  return {
    expenses, addExpense, removeExpense,
    income, addIncome, removeIncome,
    budget, setBudget,
    currentMonth, monthlyTotal, byCategory, remaining,
    monthlyIncome, netBalance, currentMonthIncome, bySource,
    recentExpenses, recentIncome,
  }
}
