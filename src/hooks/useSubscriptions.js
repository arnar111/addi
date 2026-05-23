import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  {
    id: '1', name: 'The Athletic', icon: '⚽', cost: 2490, period: 'monthly',
    status: 'active', renewDay: 15, color: '#f97316', category: 'sports',
    note: 'Sports journalism — daily reads',
  },
  {
    id: '2', name: 'Audible', icon: '🎧', cost: 1790, period: 'monthly',
    status: 'active', renewDay: 1, color: '#f59e0b', category: 'entertainment',
    note: '1 audiobook credit/month',
  },
  {
    id: '3', name: 'Xbox Game Pass', icon: '🎮', cost: 2499, period: 'monthly',
    status: 'active', renewDay: 20, color: '#22c55e', category: 'gaming',
    note: 'Ultimate — includes Forza, online',
  },
  {
    id: '4', name: 'GOLF+', icon: '⛳', cost: 990, period: 'monthly',
    status: 'active', renewDay: 10, color: '#10b981', category: 'sports',
    note: 'VR golf — Steam playtest coming!',
  },
  {
    id: '5', name: 'Paramount+', icon: '📺', cost: 1990, period: 'monthly',
    status: 'paused', renewDay: 21, color: '#ef4444', category: 'streaming',
    note: '⚠️ Payment failed on Prime Video — update card',
  },
  {
    id: '6', name: 'Driver Booster Pro', icon: '💻', cost: 3900, period: 'yearly',
    status: 'failed', renewDay: 15, color: '#ef4444', category: 'software',
    note: '⚠️ Renewal failed May 15 — Visa 3700',
  },
  {
    id: '7', name: 'Netlify', icon: '🌐', cost: 2600, period: 'monthly',
    status: 'warning', renewDay: 22, color: '#f97316', category: 'tech',
    note: '⚠️ Credit card required — 25 days before suspension',
  },
  {
    id: '8', name: 'Coursera', icon: '📚', cost: 8100, period: 'monthly',
    status: 'active', renewDay: 5, color: '#8b5cf6', category: 'learning',
    note: 'AWS Certified Big Data — Specialty',
  },
]

export const SUB_STATUSES = {
  active: { label: 'Virk', color: '#22c55e' },
  paused: { label: 'Í bið', color: '#f97316' },
  failed: { label: 'Mistókst', color: '#ef4444' },
  warning: { label: 'Viðvörun', color: '#f97316' },
  cancelled: { label: 'Hætt', color: '#64748b' },
}

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, {
      ...sub,
      id: Date.now().toString(),
      status: sub.status || 'active',
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const monthlyTotal = subs
    .filter(s => s.status === 'active' || s.status === 'warning')
    .reduce((sum, s) => {
      const monthlyCost = s.period === 'yearly' ? Math.round(s.cost / 12) : s.cost
      return sum + monthlyCost
    }, 0)

  const yearlyTotal = monthlyTotal * 12

  const alertSubs = subs.filter(s => ['failed', 'paused', 'warning'].includes(s.status))

  const activeCount = subs.filter(s => s.status === 'active').length

  return { subs, add, remove, update, monthlyTotal, yearlyTotal, alertSubs, activeCount }
}
