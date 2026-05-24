import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBSCRIPTIONS = [
  { id: '1', name: 'iCloud+', icon: '☁️', amount: 0, color: '#3b82f6', active: true },
  { id: '2', name: 'Spotify', icon: '🎵', amount: 0, color: '#1db954', active: true },
  { id: '3', name: 'The Athletic', icon: '⚽', amount: 0, color: '#ef4444', active: true },
  { id: '4', name: 'Netlify', icon: '🌐', amount: 0, color: '#00c7b7', active: true },
  { id: '5', name: 'Huel', icon: '🥤', amount: 0, color: '#8b5cf6', active: true },
  { id: '6', name: 'LinkedIn Premium', icon: '💼', amount: 0, color: '#0a66c2', active: false },
]

export function useFinance() {
  const [expenses, setExpenses] = useLocalStorage('addi_expenses', [])
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
  const [subscriptions, setSubscriptions] = useLocalStorage('addi_subscriptions', DEFAULT_SUBSCRIPTIONS)

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

  const remaining = () => budget.monthly - monthlyTotal()

  const recentExpenses = expenses.slice(0, 20)

  const addSubscription = (name, icon = '📱', amount = 0, color = '#8b5cf6') => {
    setSubscriptions(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, amount, color, active: true,
    }])
  }

  const updateSubscription = (id, updates) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const removeSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const subscriptionTotal = subscriptions
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.amount || 0), 0)

  return {
    expenses, addExpense, removeExpense,
    budget, setBudget,
    currentMonth, monthlyTotal, byCategory, remaining,
    recentExpenses,
    subscriptions, setSubscriptions, addSubscription, updateSubscription, removeSubscription,
    subscriptionTotal,
  }
}
