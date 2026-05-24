import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: '1', name: 'Apple iCloud+',  amount: 1299, freq: 'monthly', icon: '🍎', active: true },
  { id: '2', name: 'The Athletic',   amount: 2999, freq: 'monthly', icon: '⚽', active: true },
  { id: '3', name: 'Netlify Pro',    amount: 3200, freq: 'monthly', icon: '🚀', active: true },
  { id: '4', name: 'Spotify',        amount: 1599, freq: 'monthly', icon: '🎵', active: true },
  { id: '5', name: 'GrowIt Premium', amount: 6000, freq: 'yearly',  icon: '🌱', active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULTS)

  const add = (sub) => setSubs(prev => [...prev, { id: Date.now().toString(), ...sub, active: true }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, patch) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const activeMonthly = subs
    .filter(s => s.active)
    .reduce((total, s) => total + (s.freq === 'monthly' ? s.amount : Math.round(s.amount / 12)), 0)

  const activeYearly = activeMonthly * 12

  return { subs, add, remove, toggle, update, activeMonthly, activeYearly }
}
