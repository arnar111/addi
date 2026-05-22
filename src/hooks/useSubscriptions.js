import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: 's1', name: 'Spotify', icon: '🎵', amount: 2490, period: 'monthly', category: 'music', active: true },
  { id: 's2', name: 'Patreon – Popcorn in Bed', icon: '🎬', amount: 1500, period: 'monthly', category: 'entertainment', active: true },
  { id: 's3', name: 'Námslán (mánaðarleg greiðsla)', icon: '🎓', amount: 35000, period: 'monthly', category: 'loan', active: true },
  { id: 's4', name: 'Húsfélag', icon: '🏠', amount: 8000, period: 'monthly', category: 'housing', active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = ({ name, icon, amount, period, category }) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon,
      amount: Number(amount),
      period: period || 'monthly',
      category: category || 'other',
      active: true,
    }])
  }

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, fields) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
  }

  const monthlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.period === 'monthly' ? s.amount : Math.round(s.amount / 12)), 0)

  const yearlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.period === 'yearly' ? s.amount : s.amount * 12), 0)

  return { subs, add, toggle, remove, update, monthlyTotal, yearlyTotal }
}
