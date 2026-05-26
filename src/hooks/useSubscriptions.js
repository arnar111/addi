import { useLocalStorage } from './useLocalStorage'

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useLocalStorage('addi_subscriptions', [
    { id: '1', name: 'Anthropic Claude', icon: '🤖', amount: 13600, cycle: 'monthly', dueDay: 17, active: true, color: '#f97316', category: 'ai' },
    { id: '2', name: 'Netlify', icon: '🚀', amount: 2720, cycle: 'monthly', dueDay: 12, active: true, color: '#00d4aa', category: 'dev' },
    { id: '3', name: 'Moonshot AI', icon: '🌙', amount: 1500, cycle: 'monthly', dueDay: 18, active: true, color: '#8b5cf6', category: 'ai' },
    { id: '4', name: 'iCloud+', icon: '☁️', amount: 1360, cycle: 'monthly', dueDay: 23, active: true, color: '#3b82f6', category: 'storage' },
    { id: '5', name: 'Netflix', icon: '🎬', amount: 2499, cycle: 'monthly', dueDay: 20, active: false, color: '#ef4444', category: 'entertainment' },
    { id: '6', name: 'The Athletic', icon: '⚽', amount: 1767, cycle: 'monthly', dueDay: 14, active: true, color: '#22c55e', category: 'sports' },
    { id: '7', name: 'Brave / Leo AI', icon: '🦁', amount: 952, cycle: 'monthly', dueDay: 1, active: true, color: '#f97316', category: 'dev' },
    { id: '8', name: 'Patreon', icon: '🎨', amount: 900, cycle: 'monthly', dueDay: 1, active: true, color: '#f43f5e', category: 'entertainment' },
  ])

  const add = (sub) => {
    setSubscriptions(prev => [...prev, { ...sub, id: Date.now().toString(), active: true }])
  }

  const remove = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const toggleActive = (id) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const daysUntilDue = (sub) => {
    const today = new Date()
    const currentDay = today.getDate()
    const year = today.getFullYear()
    const month = today.getMonth()
    if (sub.dueDay >= currentDay) {
      return sub.dueDay - currentDay
    }
    const nextDue = new Date(year, month + 1, sub.dueDay)
    const todayStart = new Date(year, month, currentDay)
    return Math.round((nextDue - todayStart) / (1000 * 60 * 60 * 24))
  }

  const dueSoon = (days = 7) => {
    return subscriptions
      .filter(s => s.active && daysUntilDue(s) <= days)
      .sort((a, b) => daysUntilDue(a) - daysUntilDue(b))
  }

  const active = subscriptions.filter(s => s.active)
  const monthlyTotal = active.reduce((sum, s) => sum + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  return { subscriptions, add, remove, toggleActive, active, monthlyTotal, yearlyTotal, daysUntilDue, dueSoon }
}
