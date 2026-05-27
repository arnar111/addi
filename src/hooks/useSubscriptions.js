import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', icon: '🎬', amount: 2490, currency: 'ISK', cycle: 'monthly', status: 'failed', url: 'https://netflix.com', category: 'entertainment', dueDay: 1 },
  { id: '2', name: 'Netlify', icon: '🚀', amount: 3200, currency: 'ISK', cycle: 'monthly', status: 'failed', url: 'https://netlify.com', category: 'dev', dueDay: 18 },
  { id: '3', name: 'Huel', icon: '🥤', amount: 8900, currency: 'ISK', cycle: 'monthly', status: 'failed', url: 'https://huel.com', category: 'health', dueDay: 1 },
  { id: '4', name: 'Duolingo', icon: '🦜', amount: 1490, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://duolingo.com', category: 'education', dueDay: 15 },
  { id: '5', name: 'The Athletic', icon: '⚽', amount: 1290, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://theathletic.com', category: 'sports', dueDay: 10 },
  { id: '6', name: 'ElevenLabs', icon: '🎙️', amount: 2200, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://elevenlabs.io', category: 'ai', dueDay: 26 },
  { id: '7', name: 'Moonshot AI', icon: '🌙', amount: 1800, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://moonshot.cn', category: 'ai', dueDay: 26 },
  { id: '8', name: 'Claude / Anthropic', icon: '🤖', amount: 2800, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://claude.ai', category: 'ai', dueDay: 1 },
  { id: '9', name: 'Xbox Game Pass', icon: '🎮', amount: 1990, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://xbox.com', category: 'entertainment', dueDay: 20 },
  { id: '10', name: 'Google One', icon: '☁️', amount: 890, currency: 'ISK', cycle: 'monthly', status: 'active', url: 'https://one.google.com', category: 'storage', dueDay: 5 },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const addSub = (sub) => setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  const removeSub = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const updateSub = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  const toggleStatus = (id) => setSubs(prev => prev.map(s => {
    if (s.id !== id) return s
    if (s.status === 'active') return { ...s, status: 'paused' }
    if (s.status === 'paused') return { ...s, status: 'active' }
    if (s.status === 'failed') return { ...s, status: 'active' }
    return s
  }))

  const totalMonthly = subs
    .filter(s => s.status === 'active' || s.status === 'failed')
    .reduce((acc, s) => acc + s.amount, 0)

  const failedSubs = subs.filter(s => s.status === 'failed')
  const activeSubs = subs.filter(s => s.status === 'active')
  const pausedSubs = subs.filter(s => s.status === 'paused')

  const byCategory = subs
    .filter(s => s.status === 'active' || s.status === 'failed')
    .reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.amount
      return acc
    }, {})

  return {
    subs,
    addSub,
    removeSub,
    updateSub,
    toggleStatus,
    totalMonthly,
    failedSubs,
    activeSubs,
    pausedSubs,
    byCategory,
  }
}
