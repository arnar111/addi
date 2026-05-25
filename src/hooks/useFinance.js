import { useLocalStorage } from './useLocalStorage'

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 500000,
    categories: {
      food: 90000,
      transport: 35000,
      housing: 180000,
      entertainment: 40000,
      health: 25000,
      shopping: 50000,
      subscriptions: 20000,
      other: 60000,
    }
  })
  const [income, setIncome] = useLocalStorage('addi_income', [])

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

  const currentMonth = () => {
    const now = new Date()
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)

  const byCategory = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
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
    setIncome(prev => prev.filter(e => e.id !== id))
  }

  const monthlyIncome = () => {
    const now = new Date()
    return income
      .filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((s, e) => s + e.amount, 0)
  }

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 20)

  return {
    expenses, addExpense, removeExpense,
    budget, setBudget,
    currentMonth, monthlyTotal, byCategory, remaining,
    recentExpenses,
    income, addIncome, removeIncome, monthlyIncome,
  }
}
