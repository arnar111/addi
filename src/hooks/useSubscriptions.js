import { useLocalStorage } from './useLocalStorage'

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', [
    { id: '1', name: 'Netlify', amount: 2500, cycle: 'monthly', icon: '🌐', color: '#00d4aa', active: true, note: 'Billing issue!' },
    { id: '2', name: 'Huel', amount: 8000, cycle: 'monthly', icon: '🥤', color: '#f97316', active: true, note: 'Payment declined' },
    { id: '3', name: 'Spotify', amount: 1990, cycle: 'monthly', icon: '🎵', color: '#1db954', active: true, note: '' },
    { id: '4', name: 'iCloud', amount: 990, cycle: 'monthly', icon: '☁️', color: '#3b82f6', active: true, note: '' },
    { id: '5', name: 'ChatGPT', amount: 2490, cycle: 'monthly', icon: '🤖', color: '#8b5cf6', active: true, note: '' },
  ])

  const add = (name, amount, cycle = 'monthly', icon = '📱', color = '#00d4aa', note = '') => {
    setSubs(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        amount: Number(amount),
        cycle,
        icon,
        color,
        active: true,
        note,
      },
    ])
  }

  const update = (id, updates) =>
    setSubs(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)))

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggleActive = (id) =>
    setSubs(prev => prev.map(s => (s.id === id ? { ...s, active: !s.active } : s)))

  const active = subs.filter(s => s.active)
  const monthlyTotal = active.reduce(
    (sum, s) => sum + (s.cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount),
    0
  )
  const yearlyTotal = monthlyTotal * 12

  return { subs, add, update, remove, toggleActive, active, monthlyTotal, yearlyTotal }
}
