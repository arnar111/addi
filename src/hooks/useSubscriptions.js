import { useLocalStorage } from './useLocalStorage'

export const POPULAR_SUBS = [
  { name: 'Spotify', amount: 1990, period: 'monthly', icon: '🎵' },
  { name: 'Netflix', amount: 2590, period: 'monthly', icon: '🎬' },
  { name: 'Apple iCloud+', amount: 149, period: 'monthly', icon: '☁️' },
  { name: 'YouTube Premium', amount: 1590, period: 'monthly', icon: '▶️' },
  { name: 'Disney+', amount: 1990, period: 'monthly', icon: '✨' },
  { name: 'GitHub Pro', amount: 1200, period: 'monthly', icon: '💻' },
  { name: 'ChatGPT Plus', amount: 2790, period: 'monthly', icon: '🤖' },
  { name: 'Adobe CC', amount: 8990, period: 'monthly', icon: '🎨' },
  { name: 'HBO Max', amount: 1990, period: 'monthly', icon: '📺' },
  { name: 'Headspace', amount: 990, period: 'monthly', icon: '🧘' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', [])

  const add = (name, amount, period = 'monthly', icon = '📱') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name,
      amount: Number(amount),
      period,
      icon,
      active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggleActive = (id) => setSubs(prev =>
    prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
  )

  const monthlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.period === 'yearly' ? s.amount / 12 : s.amount), 0)

  return { subs, add, remove, toggleActive, monthlyTotal }
}
