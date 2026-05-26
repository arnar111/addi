import { useLocalStorage } from './useLocalStorage'

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', [
    { id: '1', name: 'The Athletic', icon: '🏆', amount: 1800, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-01', color: '#f97316', active: true },
    { id: '2', name: 'Audible', icon: '🎧', amount: 2500, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-10', color: '#f59e0b', active: true },
    { id: '3', name: 'Xbox Game Pass', icon: '🎮', amount: 2200, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-15', color: '#22c55e', active: true },
    { id: '4', name: 'Huel', icon: '🥤', amount: 8500, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-20', color: '#8b5cf6', active: true },
    { id: '5', name: 'Spotify', icon: '🎵', amount: 1990, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-05', color: '#1db954', active: true },
  ])

  const add = (name, icon, amount, cycle, nextDate, color = '#00d4aa') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, amount: Number(amount), currency: 'ISK',
      cycle, nextDate, color, active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const monthlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + s.amount
      if (s.cycle === 'yearly') return sum + Math.round(s.amount / 12)
      return sum
    }, 0)

  const renewingSoon = () => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 7)
    const today = new Date().toISOString().split('T')[0]
    return subs.filter(s => s.active && s.nextDate >= today && s.nextDate <= soon.toISOString().split('T')[0])
  }

  return { subs, add, remove, toggle, update, monthlyTotal, renewingSoon }
}
