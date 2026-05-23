import { useLocalStorage } from './useLocalStorage'

export const ISK_RATES = { USD: 139, EUR: 152, GBP: 177, ISK: 1 }

export const SUB_CATEGORIES = {
  ai: { label: 'Gervigreind', icon: '🤖', color: '#f97316' },
  entertainment: { label: 'Afþreying', icon: '🎬', color: '#ef4444' },
  sports: { label: 'Íþróttir', icon: '⚽', color: '#8b5cf6' },
  gaming: { label: 'Leikir', icon: '🎮', color: '#22c55e' },
  health: { label: 'Heilsa', icon: '💚', color: '#10b981' },
  education: { label: 'Menntun', icon: '📚', color: '#f59e0b' },
  dev: { label: 'Þróun', icon: '💻', color: '#00d4aa' },
  software: { label: 'Hugbúnaður', icon: '🛠️', color: '#64748b' },
  food: { label: 'Matur', icon: '🥤', color: '#ec4899' },
  other: { label: 'Annað', icon: '💳', color: '#94a3b8' },
}

export const SEED_SUBS = [
  { id: 's1', name: 'Claude Pro', icon: '🤖', amount: 100, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-17', status: 'warning', category: 'ai', notes: 'Greiðsluvandamál – Anthropic' },
  { id: 's2', name: 'Netlify', icon: '🌐', amount: 20, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-12', status: 'active', category: 'dev', notes: '' },
  { id: 's3', name: 'Netflix', icon: '🎬', amount: 2490, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-12', status: 'warning', category: 'entertainment', notes: 'Greiðsluvandamál' },
  { id: 's4', name: 'Paramount+', icon: '⭐', amount: 999, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-01', status: 'paused', category: 'entertainment', notes: 'Í bið – Prime Video' },
  { id: 's5', name: 'Huel', icon: '🥤', amount: 8000, currency: 'ISK', cycle: 'monthly', nextDate: '2026-05-27', status: 'active', category: 'food', notes: 'Næst afhending 27. maí' },
  { id: 's6', name: 'Audible', icon: '🎧', amount: 17, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-01', status: 'active', category: 'education', notes: '' },
  { id: 's7', name: 'The Athletic', icon: '⚽', amount: 10, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-22', status: 'active', category: 'sports', notes: '' },
  { id: 's8', name: 'Xbox Game Pass', icon: '🎮', amount: 3499, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-19', status: 'active', category: 'gaming', notes: 'Ultimate' },
  { id: 's9', name: 'Moonshot AI', icon: '🌙', amount: 20, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-18', status: 'active', category: 'ai', notes: 'Kimi AI' },
  { id: 's10', name: 'Chegg', icon: '📖', amount: 15, currency: 'USD', cycle: 'monthly', nextDate: '2026-06-15', status: 'warning', category: 'education', notes: 'Greiðsluvandamál' },
  { id: 's11', name: 'Driver Booster', icon: '🛠️', amount: 32, currency: 'USD', cycle: 'yearly', nextDate: '2027-05-16', status: 'paused', category: 'software', notes: 'Útrunnið' },
  { id: 's12', name: 'Golf+ VR', icon: '⛳', amount: 0, currency: 'ISK', cycle: 'monthly', nextDate: '2026-06-01', status: 'active', category: 'gaming', notes: 'Playtesting' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions_v2', SEED_SUBS)

  const toISK = (amount, currency) => Math.round(amount * (ISK_RATES[currency] || 1))

  const monthlyISK = () =>
    subs
      .filter(s => s.status !== 'paused')
      .reduce((sum, s) => {
        const isk = toISK(s.amount, s.currency)
        return sum + (s.cycle === 'yearly' ? Math.round(isk / 12) : isk)
      }, 0)

  const warnings = () => subs.filter(s => s.status === 'warning')

  const upcoming = (days = 7) => {
    const today = new Date()
    const limit = new Date(today)
    limit.setDate(limit.getDate() + days)
    return subs
      .filter(s => {
        const d = new Date(s.nextDate)
        return d >= today && d <= limit && s.status !== 'paused'
      })
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
  }

  const add = (sub) =>
    setSubs(prev => [...prev, { id: Date.now().toString(), ...sub, status: 'active' }])

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, changes) =>
    setSubs(prev => prev.map(s => (s.id === id ? { ...s, ...changes } : s)))

  return { subs, add, remove, update, toISK, monthlyISK, warnings, upcoming }
}
