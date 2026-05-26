import { useLocalStorage } from './useLocalStorage'

const ISK_RATES = { USD: 137, EUR: 148, ISK: 1, GBP: 175, DKK: 20 }

export function toISK(amount, currency) {
  return Math.round(amount * (ISK_RATES[currency] || 1))
}

export const SUB_CATEGORIES = [
  { id: 'ai', label: 'Gervigreind', icon: '🤖', color: '#8b5cf6' },
  { id: 'dev', label: 'Þróun', icon: '💻', color: '#3b82f6' },
  { id: 'entertainment', label: 'Afþreying', icon: '🎬', color: '#ec4899' },
  { id: 'design', label: 'Hönnun', icon: '🎨', color: '#f97316' },
  { id: 'education', label: 'Nám', icon: '📚', color: '#eab308' },
  { id: 'browser', label: 'Vafri', icon: '🦁', color: '#f97316' },
  { id: 'food', label: 'Matur', icon: '🍽️', color: '#22c55e' },
  { id: 'other', label: 'Annað', icon: '📦', color: '#64748b' },
]

const DEFAULT_SUBS = [
  {
    id: '1', name: 'Anthropic Claude', icon: '🤖', category: 'ai',
    amount: 100, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '2', name: 'MOONSHOT AI', icon: '🌙', category: 'ai',
    amount: 20, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '3', name: 'Netlify', icon: '🚀', category: 'dev',
    amount: 20, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: 'Greiðslukort rann út',
  },
  {
    id: '4', name: 'Netflix', icon: '🎬', category: 'entertainment',
    amount: 2199, currency: 'ISK', period: 'monthly', active: true,
    nextDate: null, alert: 'Þarf að uppfæra greiðslu',
  },
  {
    id: '5', name: 'Spotify', icon: '🎵', category: 'entertainment',
    amount: 1990, currency: 'ISK', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '6', name: 'Canva Pro', icon: '🎨', category: 'design',
    amount: 15, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '7', name: 'Brave Leo', icon: '🦁', category: 'browser',
    amount: 15, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '8', name: 'Mimo', icon: '📚', category: 'education',
    amount: 19.99, currency: 'EUR', period: 'monthly', active: false,
    nextDate: null, alert: 'Greiðsla mistókst — endurtekið',
  },
  {
    id: '9', name: 'Patreon · Popcorn in Bed', icon: '🍿', category: 'entertainment',
    amount: 8, currency: 'USD', period: 'monthly', active: true,
    nextDate: null, alert: null,
  },
  {
    id: '10', name: 'indó.is', icon: '🛒', category: 'food',
    amount: 0, currency: 'ISK', period: 'monthly', active: true,
    nextDate: null, alert: null, note: 'Matarkörfugreiðslur',
  },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      active: true,
      alert: null,
      nextDate: null,
      note: '',
      ...sub,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s =>
    s.id === id ? { ...s, active: !s.active } : s
  ))

  const update = (id, updates) => setSubs(prev => prev.map(s =>
    s.id === id ? { ...s, ...updates } : s
  ))

  const monthlyISK = () => subs
    .filter(s => s.active && s.amount > 0)
    .reduce((sum, s) => {
      const monthly = s.period === 'annual' ? s.amount / 12 : s.amount
      return sum + toISK(monthly, s.currency)
    }, 0)

  const annualISK = () => monthlyISK() * 12

  const alerts = subs.filter(s => s.alert)

  const byCategoryISK = () => {
    const result = {}
    subs.filter(s => s.active && s.amount > 0).forEach(s => {
      const monthly = s.period === 'annual' ? s.amount / 12 : s.amount
      result[s.category] = (result[s.category] || 0) + toISK(monthly, s.currency)
    })
    return result
  }

  return {
    subs, add, remove, toggle, update,
    monthlyISK, annualISK, alerts, byCategoryISK,
  }
}
