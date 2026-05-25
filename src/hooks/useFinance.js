import { useLocalStorage } from './useLocalStorage'

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 450000,
    categories: {
      food: 80000,
      transport: 30000,
      housing: 150000,
      entertainment: 30000,
      health: 20000,
      shopping: 40000,
      subscriptions: 25000,
      nicotine: 10000,
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
    const result = {}
    currentMonth().forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 30)

  return {
    expenses, addExpense, removeExpense,
    budget, setBudget,
    currentMonth, monthlyTotal, byCategory, remaining,
    recentExpenses,
  }
}
