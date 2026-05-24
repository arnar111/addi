import { useLocalStorage } from './useLocalStorage'

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Laun', icon: '💼', color: '#22c55e' },
  { id: 'freelance', label: 'Verktakar', icon: '🛠️', color: '#3b82f6' },
  { id: 'investment', label: 'Fjárfesting', icon: '📈', color: '#8b5cf6' },
  { id: 'gift', label: 'Gjöf', icon: '🎁', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [incomes, setIncomes] = useLocalStorage('addi_incomes', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 400000,
    savingsGoal: 50000,
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
    setIncomes(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id))
  }

  const currentMonthExpenses = () => {
    const now = new Date()
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const currentMonthIncomes = () => {
    const now = new Date()
    return incomes.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonthExpenses().reduce((s, e) => s + e.amount, 0)

  const monthlyIncome = () => currentMonthIncomes().reduce((s, i) => s + i.amount, 0)

  const monthlySavings = () => monthlyIncome() - monthlyTotal()

  const savingsRate = () => {
    const income = monthlyIncome()
    if (!income) return 0
    return Math.round((monthlySavings() / income) * 100)
  }

  const byCategory = () => {
    const m = currentMonthExpenses()
    const result = {}
    m.forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 30)
  const recentIncomes = incomes.slice(0, 20)

  const todayTotal = () => {
    const today = new Date().toDateString()
    return expenses
      .filter(e => new Date(e.date).toDateString() === today)
      .reduce((s, e) => s + e.amount, 0)
  }

  return {
    expenses, addExpense, removeExpense,
    incomes, addIncome, removeIncome,
    budget, setBudget,
    currentMonthExpenses, currentMonthIncomes,
    monthlyTotal, monthlyIncome, monthlySavings, savingsRate,
    byCategory, remaining,
    recentExpenses, recentIncomes,
    todayTotal,
  }
}
