import { useLocalStorage } from './useLocalStorage'

export const SUB_STATUSES = {
  active: { label: 'Virk', color: '#22c55e' },
  paused: { label: 'Í bið', color: '#f97316' },
  failed: { label: 'Mistókst', color: '#ef4444' },
  cancelled: { label: 'Hætt', color: '#64748b' },
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'ISK']

export const USD_TO_ISK = 138
export const EUR_TO_ISK = 148
export const GBP_TO_ISK = 175

export function toISK(amount, currency) {
  if (currency === 'ISK') return Math.round(amount)
  if (currency === 'USD') return Math.round(amount * USD_TO_ISK)
  if (currency === 'EUR') return Math.round(amount * EUR_TO_ISK)
  if (currency === 'GBP') return Math.round(amount * GBP_TO_ISK)
  return Math.round(amount)
}

export function formatForeign(amount, currency) {
  if (currency === 'USD') return `$${amount}`
  if (currency === 'EUR') return `€${amount}`
  if (currency === 'GBP') return `£${amount}`
  return `${amount} kr`
}

const DEFAULT_SUBS = [
  {
    id: '1', name: 'Claude / Anthropic', icon: '🤖', color: '#8b5cf6',
    amount: 100, currency: 'USD', billingCycle: 'monthly',
    status: 'failed', nextBilling: null, url: 'https://claude.ai',
    category: 'AI',
  },
  {
    id: '2', name: 'Netlify', icon: '🌐', color: '#00d4aa',
    amount: 20, currency: 'USD', billingCycle: 'monthly',
    status: 'active', nextBilling: '2026-06-12', url: 'https://app.netlify.com',
    category: 'Þróun',
  },
  {
    id: '3', name: 'Netflix', icon: '🎬', color: '#e50914',
    amount: 18, currency: 'USD', billingCycle: 'monthly',
    status: 'failed', nextBilling: null, url: 'https://netflix.com',
    category: 'Skemmtun',
  },
  {
    id: '4', name: 'Paramount+', icon: '⭐', color: '#0064ff',
    amount: 10, currency: 'USD', billingCycle: 'monthly',
    status: 'paused', nextBilling: null, url: 'https://paramountplus.com',
    category: 'Skemmtun',
  },
  {
    id: '5', name: 'Moonshot AI', icon: '🚀', color: '#f97316',
    amount: 20, currency: 'USD', billingCycle: 'monthly',
    status: 'active', nextBilling: '2026-06-18', url: 'https://moonshot.cn',
    category: 'AI',
  },
  {
    id: '6', name: 'Driver Booster PRO', icon: '🔧', color: '#3b82f6',
    amount: 32, currency: 'EUR', billingCycle: 'yearly',
    status: 'failed', nextBilling: null, url: 'https://iobit.com',
    category: 'Hugbúnaður',
  },
  {
    id: '7', name: 'Patreon (Popcorn in Bed)', icon: '🎭', color: '#ff424d',
    amount: 5, currency: 'USD', billingCycle: 'monthly',
    status: 'active', nextBilling: '2026-06-01', url: 'https://patreon.com',
    category: 'Skemmtun',
  },
  {
    id: '8', name: 'The Athletic', icon: '⚽', color: '#1d4ed8',
    amount: 10, currency: 'USD', billingCycle: 'monthly',
    status: 'active', nextBilling: '2026-06-15', url: 'https://theathletic.com',
    category: 'Íþróttir',
  },
  {
    id: '9', name: 'Chegg', icon: '📚', color: '#ff5a23',
    amount: 20, currency: 'USD', billingCycle: 'monthly',
    status: 'failed', nextBilling: null, url: 'https://chegg.com',
    category: 'Menntun',
  },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const monthlyISK = (includeAll = false) => {
    return subs
      .filter(s => includeAll ? s.status !== 'cancelled' : s.status === 'active')
      .reduce((total, s) => {
        const monthly = s.billingCycle === 'yearly' ? s.amount / 12 : s.amount
        return total + toISK(monthly, s.currency)
      }, 0)
  }

  const yearlyISK = () => Math.round(monthlyISK() * 12)

  const failedSubs = subs.filter(s => s.status === 'failed')
  const activeSubs = subs.filter(s => s.status === 'active')
  const pausedSubs = subs.filter(s => s.status === 'paused')

  return { subs, add, remove, update, monthlyISK, yearlyISK, failedSubs, activeSubs, pausedSubs }
}
