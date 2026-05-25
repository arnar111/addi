import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Apple iCloud+', icon: '🍎', amount: 149, cycle: 'monthly', category: 'tech', color: '#8b5cf6', nextDue: '2026-06-01', active: true },
  { id: '2', name: 'Netflix', icon: '🎬', amount: 2490, cycle: 'monthly', category: 'streaming', color: '#ef4444', nextDue: '2026-06-05', active: true },
  { id: '3', name: 'Disney+', icon: '🏰', amount: 1499, cycle: 'monthly', category: 'streaming', color: '#3b82f6', nextDue: '2026-06-20', active: true },
  { id: '4', name: 'The Athletic', icon: '⚽', amount: 1490, cycle: 'monthly', category: 'news', color: '#f97316', nextDue: '2026-06-10', active: true },
  { id: '5', name: 'Xbox Game Pass', icon: '🎮', amount: 1499, cycle: 'monthly', category: 'gaming', color: '#22c55e', nextDue: '2026-06-15', active: true },
  { id: '6', name: 'Netlify', icon: '⚡', amount: 2800, cycle: 'monthly', category: 'tech', color: '#00d4aa', nextDue: '2026-06-01', active: true },
  { id: '7', name: 'GrowIt (Garden)', icon: '🌱', amount: 1800, cycle: 'annual', category: 'other', color: '#84cc16', nextDue: '2027-05-23', active: true },
  { id: '8', name: 'Driver Booster Pro', icon: '🔧', amount: 1400, cycle: 'annual', category: 'tech', color: '#64748b', nextDue: '2027-05-15', active: false },
  { id: '9', name: 'Spotify', icon: '🎵', amount: 1490, cycle: 'monthly', category: 'music', color: '#1db954', nextDue: '2026-06-08', active: true },
]

function monthlyAmount(sub) {
  if (!sub.active) return 0
  return sub.cycle === 'annual' ? Math.round(sub.amount / 12) : sub.amount
}

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (data) => {
    setSubs(prev => [...prev, { id: Date.now().toString(), active: true, ...data }])
  }

  const update = (id, data) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const toggleActive = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const totalMonthly = subs.filter(s => s.active).reduce((acc, s) => acc + monthlyAmount(s), 0)
  const totalAnnual = totalMonthly * 12

  const upcomingRenewals = (days = 30) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + days)
    return subs
      .filter(s => s.active && s.nextDue)
      .filter(s => new Date(s.nextDue) <= cutoff)
      .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))
  }

  const daysUntil = (dateStr) => {
    const diff = new Date(dateStr) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return { subs, add, update, remove, toggleActive, totalMonthly, totalAnnual, upcomingRenewals, daysUntil, monthlyAmount }
}
