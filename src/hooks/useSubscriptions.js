import { useLocalStorage } from './useLocalStorage'

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', [
    {
      id: '1',
      name: 'The Athletic',
      icon: '⚽',
      amount: 1799,
      frequency: 'monthly',
      status: 'active',
      renewDate: null,
      category: 'entertainment',
      url: 'https://theathletic.com',
      color: '#00d4aa',
      note: '',
    },
    {
      id: '2',
      name: 'Huel',
      icon: '💪',
      amount: 17000,
      frequency: 'monthly',
      status: 'active',
      renewDate: '2026-05-27',
      category: 'health',
      url: 'https://huel.com',
      color: '#f97316',
      note: 'Næsta sending 27. maí',
    },
    {
      id: '3',
      name: 'Paramount+ (Prime Video)',
      icon: '🎬',
      amount: 1999,
      frequency: 'monthly',
      status: 'paused',
      renewDate: null,
      category: 'entertainment',
      url: 'https://primevideo.com',
      color: '#ef4444',
      note: 'Greiðsluvandamál — þarf að uppfæra',
    },
    {
      id: '4',
      name: 'LinkedIn',
      icon: '💼',
      amount: 3299,
      frequency: 'monthly',
      status: 'active',
      renewDate: null,
      category: 'work',
      url: 'https://linkedin.com',
      color: '#0077b5',
      note: '',
    },
    {
      id: '5',
      name: 'Wolt',
      icon: '🛵',
      amount: 990,
      frequency: 'monthly',
      status: 'active',
      renewDate: null,
      category: 'food',
      url: 'https://wolt.com',
      color: '#009de0',
      note: 'Wolt+',
    },
  ])

  const add = (sub) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      frequency: 'monthly',
      status: 'active',
      renewDate: null,
      color: '#00d4aa',
      note: '',
      ...sub,
    }])
  }

  const update = (id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const monthlyAmount = (s) => {
    if (s.frequency === 'annual') return Math.round(s.amount / 12)
    return s.amount
  }

  const totalMonthly = subs
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + monthlyAmount(s), 0)

  const alerts = subs.filter(s => s.status === 'paused')

  const upcomingRenewals = subs
    .filter(s => s.status === 'active' && s.renewDate)
    .filter(s => {
      const diff = (new Date(s.renewDate) - new Date()) / (1000 * 60 * 60 * 24)
      return diff >= 0 && diff <= 10
    })
    .sort((a, b) => new Date(a.renewDate) - new Date(b.renewDate))

  return { subs, add, update, remove, totalMonthly, monthlyAmount, alerts, upcomingRenewals }
}
