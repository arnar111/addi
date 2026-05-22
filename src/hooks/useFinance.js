import { useLocalStorage } from './useLocalStorage'

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Matur', icon: '🍽️', color: '#f97316' },
  { id: 'transport', label: 'Samgöngur', icon: '🚗', color: '#3b82f6' },
  { id: 'housing', label: 'Húsnæði', icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment', label: 'Afþreying', icon: '🎮', color: '#ec4899' },
  { id: 'health', label: 'Heilsa', icon: '💊', color: '#22c55e' },
  { id: 'shopping', label: 'Innkaup', icon: '🛍️', color: '#eab308' },
  { id: 'subscriptions', label: 'Áskriftir', icon: '📱', color: '#00d4aa' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export const INCOME_CATEGORIES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Takk / Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'namslán', label: 'Námslan', icon: '🎓', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
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

  const addIncome = (amount, category, note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => {
    setIncome(prev => prev.filter(e => e.id !== id))
  }

  const thisMonth = (arr) => {
    const now = new Date()
    return arr.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const currentMonth = () => thisMonth(expenses)

  const monthlyTotal = () => thisMonth(expenses).reduce((s, e) => s + e.amount, 0)
  const monthlyIncome = () => thisMonth(income).reduce((s, e) => s + e.amount, 0)
  const netBalance = () => monthlyIncome() - monthlyTotal()

  const byCategory = () => {
    const result = {}
    thisMonth(expenses).forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const byIncomeCategory = () => {
    const result = {}
    thisMonth(income).forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()
  const lendoThisMonth = () => thisMonth(income).filter(e => e.category === 'lendo').reduce((s, e) => s + e.amount, 0)

  return {
    expenses: expenses.slice(0, 30),
    addExpense, removeExpense,
    income: income.slice(0, 30),
    addIncome, removeIncome,
    budget, setBudget,
    currentMonth, monthlyTotal, monthlyIncome, netBalance,
    byCategory, byIncomeCategory, remaining, lendoThisMonth,
    recentExpenses: expenses.slice(0, 20),
    recentIncome: income.slice(0, 20),
  }
}
