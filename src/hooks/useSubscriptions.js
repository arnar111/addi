import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: '1', name: 'The Athletic', icon: '⚽', amount: 2490, currency: 'ISK', active: true, billingDay: 15, category: 'sports' },
  { id: '2', name: 'Prime Video', icon: '🎬', amount: 890, currency: 'ISK', active: false, billingDay: 1, category: 'streaming', note: 'Greiðsla fallið' },
  { id: '3', name: 'Paramount+', icon: '🍿', amount: 1290, currency: 'ISK', active: false, billingDay: 1, category: 'streaming', note: 'Hlé' },
  { id: '4', name: 'GOLF+', icon: '⛳', amount: 1990, currency: 'ISK', active: true, billingDay: 20, category: 'sports' },
  { id: '5', name: 'LinkedIn Premium', icon: '💼', amount: 0, currency: 'ISK', active: false, billingDay: 1, category: 'professional', note: 'Ógreitt' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const update = (id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const monthlyTotal = subs.filter(s => s.active).reduce((sum, s) => sum + s.amount, 0)
  const annualTotal = monthlyTotal * 12
  const paused = subs.filter(s => !s.active)
  const savingsByPausing = paused.reduce((sum, s) => sum + s.amount, 0)

  return { subs, add, remove, toggle, update, monthlyTotal, annualTotal, savingsByPausing }
}
