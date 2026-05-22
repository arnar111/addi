import { useLocalStorage } from './useLocalStorage'

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

  const addIncome = (amount, source, note = '') => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => setIncome(prev => prev.filter(i => i.id !== id))

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

  const remaining = () => budget.monthly - monthlyTotal()
  const recentExpenses = expenses.slice(0, 30)
  const recentIncome = income.slice(0, 30)

  return {
    expenses, addExpense, removeExpense,
    income, addIncome, removeIncome,
    budget, setBudget,
    currentMonth, monthlyTotal, byCategory, remaining,
    monthlyIncome, netBalance,
    recentExpenses, recentIncome,
  }
}
