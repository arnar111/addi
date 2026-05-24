import { useLocalStorage } from './useLocalStorage'

export const INCOME_SOURCES = [
  { id: 'salary',    label: 'Laun',           icon: '💼', color: '#22c55e' },
  { id: 'freelance', label: 'Frílans',         icon: '💻', color: '#00d4aa' },
  { id: 'project',   label: 'Verkefnatekjur',  icon: '🚀', color: '#8b5cf6' },
  { id: 'rental',    label: 'Lendó leiga',     icon: '🏠', color: '#f97316' },
  { id: 'other',     label: 'Annað',           icon: '💰', color: '#64748b' },
]

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
  const [incomes, setIncomes] = useLocalStorage('addi_incomes', [])
  const [budget, setBudget] = useLocalStorage('addi_budget', {
    monthly: 450000,
    incomeTarget: 700000,
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

  const addIncome = (amount, source, note = '', date = null) => {
    setIncomes(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeIncome = (id) => {
    setIncomes(prev => prev.filter(e => e.id !== id))
  }

  const currentMonth = () => {
    const now = new Date()
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const currentMonthIncomes = () => {
    const now = new Date()
    return incomes.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)
  const monthlyIncome = () => currentMonthIncomes().reduce((s, e) => s + e.amount, 0)
  const netBalance = () => monthlyIncome() - monthlyTotal()

  const byCategory = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount
    })
    return result
  }

  const remaining = () => budget.monthly - monthlyTotal()
  const recentExpenses = expenses.slice(0, 20)
  const recentIncomes = incomes.slice(0, 20)

  return {
    expenses, addExpense, removeExpense,
    incomes, addIncome, removeIncome,
    budget, setBudget,
    currentMonth, currentMonthIncomes,
    monthlyTotal, monthlyIncome, netBalance,
    byCategory, remaining,
    recentExpenses, recentIncomes,
  }
}
