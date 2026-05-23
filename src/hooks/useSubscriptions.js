import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', icon: '🎵', color: '#1db954', amount: 2490, billing: 'monthly', category: 'Tónlist' },
  { id: '2', name: 'Xbox Game Pass', icon: '🎮', color: '#107c10', amount: 2690, billing: 'monthly', category: 'Leikir' },
  { id: '3', name: 'The Athletic', icon: '⚽', color: '#e63946', amount: 1990, billing: 'monthly', category: 'Fréttir' },
  { id: '4', name: 'Audible', icon: '🎧', color: '#f97316', amount: 1890, billing: 'monthly', category: 'Bækur' },
  { id: '5', name: 'Netflix', icon: '🎬', color: '#e50914', amount: 3490, billing: 'monthly', category: 'Sjónvarp' },
  { id: '6', name: 'Netlify Pro', icon: '🌐', color: '#00d4aa', amount: 4990, billing: 'monthly', category: 'Tækni' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const update = (id, changes) => setSubs(prev => prev.map(s => s.id !== id ? s : { ...s, ...changes }))

  const monthlyTotal = subs.reduce((s, sub) => {
    if (sub.billing === 'yearly') return s + Math.round(sub.amount / 12)
    return s + sub.amount
  }, 0)

  return { subs, add, remove, update, monthlyTotal, yearlyTotal: monthlyTotal * 12 }
}
