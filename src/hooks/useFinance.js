import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'laun', label: 'Laun', icon: '💼', color: '#3b82f6' },
  { id: 'aukavinnsla', label: 'Aukavinnsla', icon: '🔧', color: '#8b5cf6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [income, setIncome] = useLocalStorage('addi_income', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 400000,
    categories: {
      food: 80000,
      transport: 30000,
      housing: 150000,
      entertainment: 30000,
      health: 20000,
      shopping: 40000,
      subscriptions: 15000,
      other: 35000,
    }
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

  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id))

  const addIncome = (amount, source = 'other', note = '') => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => setIncome(prev => prev.filter(e => e.id !== id))

  const isCurrentMonth = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }

  const currentMonthExpenses = () => expenses.filter(e => isCurrentMonth(e.date))
  const currentMonthIncome = () => income.filter(e => isCurrentMonth(e.date))

  const monthlyTotal = () => currentMonthExpenses().reduce((s, e) => s + e.amount, 0)
  const monthlyIncomeTotal = () => currentMonthIncome().reduce((s, e) => s + e.amount, 0)
  const monthlyNet = () => monthlyIncomeTotal() - monthlyTotal()

  const byCategory = () => {
    const result = {}
    currentMonthExpenses().forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 20)
  const recentIncome = income.slice(0, 20)

  return {
    expenses, addExpense, removeExpense,
    income, addIncome, removeIncome,
    budget, setBudget,
    currentMonthExpenses, currentMonthIncome,
    monthlyTotal, monthlyIncomeTotal, monthlyNet,
    byCategory, remaining,
    recentExpenses, recentIncome,
  }
}
