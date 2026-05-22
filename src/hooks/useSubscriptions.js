import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: '1', name: 'The Athletic', amount: 2500, period: 'monthly', icon: '⚽', category: 'Íþróttir',  active: true },
  { id: '2', name: 'Spotify',      amount: 1590, period: 'monthly', icon: '🎵', category: 'Tónlist',   active: true },
  { id: '3', name: 'Patreon',      amount: 1000, period: 'monthly', icon: '🎬', category: 'Afþreying', active: true },
  { id: '4', name: 'Netlify',      amount: 2700, period: 'monthly', icon: '🌐', category: 'Tækni',     active: true },
  { id: '5', name: 'Golf+ VR',     amount: 1500, period: 'monthly', icon: '⛳', category: 'Íþróttir',  active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = ({ name, amount, period = 'monthly', icon = '📱', category = 'Annað' }) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, amount: Number(amount), period, icon, category, active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const activeSubs = subs.filter(s => s.active)

  const toMonthly = (s) => s.period === 'yearly' ? Math.round(s.amount / 12) : s.amount

  const monthlyTotal = () => activeSubs.reduce((sum, s) => sum + toMonthly(s), 0)
  const yearlyTotal = () => monthlyTotal() * 12

  return { subs, add, remove, toggle, update, activeSubs, monthlyTotal, yearlyTotal, toMonthly }
}
