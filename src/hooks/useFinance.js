import { useLocalStorage } from './useLocalStorage'

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [incomes, setIncomes] = useLocalStorage('addi_incomes', [])
  const [incomeGoal, setIncomeGoal] = useLocalStorage('addi_income_goal', 200000)
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

  const _filterMonth = (arr) => {
    const now = new Date()
    return arr.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const currentMonth = () => _filterMonth(expenses)
  const currentMonthIncomes = () => _filterMonth(incomes)

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)
  const monthlyIncome = () => currentMonthIncomes().reduce((s, i) => s + i.amount, 0)
  const netCashFlow = () => monthlyIncome() - monthlyTotal()

  const byCategory = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const incomeByCategory = () => {
    const m = currentMonthIncomes()
    const result = {}
    m.forEach(i => {
      result[i.category] = (result[i.category] || 0) + i.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()
  const recentExpenses = expenses.slice(0, 30)
  const recentIncomes = incomes.slice(0, 30)

  return {
    expenses, addExpense, removeExpense,
    incomes, addIncome, removeIncome,
    incomeGoal, setIncomeGoal,
    budget, setBudget,
    currentMonth, currentMonthIncomes,
    monthlyTotal, monthlyIncome, netCashFlow,
    byCategory, incomeByCategory,
    remaining,
    recentExpenses, recentIncomes,
  }
}
