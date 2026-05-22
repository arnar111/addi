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
    setIncome(prev => prev.filter(i => i.id !== id))
  }

  const thisMonth = (arr) => {
    const now = new Date()
    return arr.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => thisMonth(expenses).reduce((s, e) => s + e.amount, 0)
  const monthlyIncome = () => thisMonth(income).reduce((s, i) => s + i.amount, 0)
  const netBalance = () => monthlyIncome() - monthlyTotal()

  const byCategory = () => {
    const result = {}
    thisMonth(expenses).forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()
  const recentExpenses = expenses.slice(0, 20)
  const recentIncome = income.slice(0, 20)

  return {
    expenses, addExpense, removeExpense,
    income: recentIncome, addIncome, removeIncome,
    budget, setBudget,
    monthlyTotal, monthlyIncome, netBalance,
    byCategory, remaining,
    recentExpenses,
  }
}
