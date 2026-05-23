import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', icon: '🎵', color: '#1db954', amount: 1590, cycle: 'monthly', active: true },
  { id: '2', name: 'The Athletic', icon: '⚽', color: '#00d4aa', amount: 1790, cycle: 'monthly', active: true },
  { id: '3', name: 'Audible', icon: '🎧', color: '#f97316', amount: 2190, cycle: 'monthly', active: true },
  { id: '4', name: 'Xbox Game Pass', icon: '🎮', color: '#107c10', amount: 2490, cycle: 'monthly', active: true },
  { id: '5', name: 'Netlify Pro', icon: '🌐', color: '#00c7b7', amount: 6890, cycle: 'monthly', active: true },
  { id: '6', name: 'LinkedIn Premium', icon: '💼', color: '#0077b5', amount: 5490, cycle: 'monthly', active: false },
  { id: '7', name: 'Golf+ VR', icon: '⛳', color: '#22c55e', amount: 690, cycle: 'monthly', active: true },
  { id: '8', name: 'SeatGeek', icon: '🎟️', color: '#ec4899', amount: 0, cycle: 'monthly', active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => setSubs(prev => [...prev, {
    id: Date.now().toString(),
    active: true,
    cycle: 'monthly',
    ...sub,
  }])

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, updates) => setSubs(prev =>
    prev.map(s => s.id === id ? { ...s, ...updates } : s)
  )

  const activeSubs = subs.filter(s => s.active && s.amount > 0)

  const monthlyTotal = () => activeSubs.reduce((sum, s) => {
    if (s.cycle === 'yearly') return sum + Math.round(s.amount / 12)
    return sum + s.amount
  }, 0)

  const yearlyTotal = () => activeSubs.reduce((sum, s) => {
    if (s.cycle === 'yearly') return sum + s.amount
    return sum + s.amount * 12
  }, 0)

  return { subs, activeSubs, add, remove, update, monthlyTotal, yearlyTotal }
}
