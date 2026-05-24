import { useLocalStorage } from './useLocalStorage'

const TODAY = new Date()
function nextMonth(base, dayOfMonth) {
  const d = new Date(base)
  d.setMonth(d.getMonth() + 1)
  if (dayOfMonth) d.setDate(dayOfMonth)
  return d.toISOString().slice(0, 10)
}

const DEFAULT_SUBS = [
  {
    id: 'huel',
    name: 'Huel',
    amount: 8500,
    currency: 'ISK',
    icon: '🥗',
    color: '#22c55e',
    nextDate: '2026-05-27',
    frequency: 'monthly',
    note: 'Næsta sending',
  },
  {
    id: 'claude',
    name: 'Claude Pro',
    amount: 2700,
    currency: 'ISK',
    icon: '🤖',
    color: '#f97316',
    nextDate: '2026-06-17',
    frequency: 'monthly',
    note: 'Anthropic Ireland',
  },
  {
    id: 'kimi',
    name: 'Moonshot AI',
    amount: 1600,
    currency: 'ISK',
    icon: '🌙',
    color: '#8b5cf6',
    nextDate: '2026-06-18',
    frequency: 'monthly',
    note: 'Kimi / Moonshot',
  },
  {
    id: 'brave',
    name: 'Brave',
    amount: 1100,
    currency: 'ISK',
    icon: '🦁',
    color: '#f59e0b',
    nextDate: '2026-06-01',
    frequency: 'monthly',
    note: 'Brave Browser',
  },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi-subscriptions-v2', DEFAULT_SUBS)

  const daysUntil = (dateStr) => {
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  const upcoming = [...subs]
    .map(s => ({ ...s, days: daysUntil(s.nextDate) }))
    .sort((a, b) => a.days - b.days)

  const monthlyTotal = subs.reduce((sum, s) => sum + s.amount, 0)

  const addSub = (sub) => setSubs(prev => [...prev, { ...sub, id: crypto.randomUUID() }])
  const removeSub = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const updateSub = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  const markPaid = (id) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s
      const next = new Date(s.nextDate)
      next.setMonth(next.getMonth() + 1)
      return { ...s, nextDate: next.toISOString().slice(0, 10) }
    }))
  }

  return { subs, upcoming, monthlyTotal, addSub, removeSub, updateSub, markPaid }
}
