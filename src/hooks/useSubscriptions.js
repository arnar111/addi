import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Claude (Anthropic)', icon: '🤖', amount: 14000, cycle: 'monthly', active: true, renewDay: 17, color: '#00d4aa' },
  { id: '2', name: 'Spotify', icon: '🎵', amount: 2490, cycle: 'monthly', active: true, renewDay: 1, color: '#1db954' },
  { id: '3', name: 'The Athletic', icon: '⚽', amount: 1400, cycle: 'monthly', active: true, renewDay: 10, color: '#f97316' },
  { id: '4', name: 'Apple iCloud+', icon: '☁️', amount: 420, cycle: 'monthly', active: true, renewDay: 23, color: '#555' },
  { id: '5', name: 'Audible', icon: '🎧', amount: 1700, cycle: 'monthly', active: true, renewDay: 5, color: '#f90' },
  { id: '6', name: 'Huel', icon: '🥤', amount: 8400, cycle: 'monthly', active: true, renewDay: 27, color: '#22c55e' },
  { id: '7', name: 'Brave Browser', icon: '🦁', amount: 1400, cycle: 'monthly', active: true, renewDay: 1, color: '#fb542b' },
  { id: '8', name: 'Moonshot AI', icon: '🌙', amount: 1400, cycle: 'monthly', active: true, renewDay: 18, color: '#8b5cf6' },
  { id: '9', name: 'Xbox Game Pass', icon: '🎮', amount: 1690, cycle: 'monthly', active: true, renewDay: 15, color: '#107c10' },
  { id: '10', name: 'Netlify', icon: '🌐', amount: 2800, cycle: 'monthly', active: false, renewDay: 23, color: '#00c7b7', note: 'Greiðsla í vandræðum!' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (name, icon, amount, cycle = 'monthly', renewDay = 1, color = '#00d4aa') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, amount: Number(amount), cycle, renewDay, color,
      active: true,
    }])
  }

  const update = (id, changes) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const monthlyTotal = () =>
    subs.filter(s => s.active).reduce((acc, s) => acc + (s.cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0)

  const nextRenewals = () => {
    const today = new Date()
    const todayDay = today.getDate()
    return subs
      .filter(s => s.active)
      .map(s => {
        let daysUntil = s.renewDay - todayDay
        if (daysUntil < 0) daysUntil += 30
        return { ...s, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5)
  }

  return { subs, add, update, remove, toggle, monthlyTotal, nextRenewals }
}
