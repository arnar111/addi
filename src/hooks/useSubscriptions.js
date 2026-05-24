import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  { id: '1', name: 'iCloud+', amount: 590,   icon: '☁️', color: '#3b82f6', dueDay: 23, active: true },
  { id: '2', name: 'Spotify', amount: 1490,  icon: '🎵', color: '#1db954', dueDay: 15, active: true },
  { id: '3', name: 'The Athletic', amount: 1090, icon: '📰', color: '#e5a820', dueDay: 1,  active: true },
  { id: '4', name: 'Huel', amount: 8500,  icon: '🥤', color: '#00d4aa', dueDay: 10, active: true },
  { id: '5', name: 'Netlify', amount: 0,     icon: '🚀', color: '#00ad9f', dueDay: 24, active: true },
  { id: '6', name: 'GitHub', amount: 0,      icon: '🐙', color: '#8b5cf6', dueDay: 17, active: false },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULTS)

  const add = ({ name, amount, icon = '📱', color = '#00d4aa', dueDay = 1 }) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, color,
      amount: Number(amount),
      dueDay: Number(dueDay),
      active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const activeSubs = subs.filter(s => s.active)
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  const upcomingThisMonth = () => {
    const today = new Date().getDate()
    return activeSubs
      .filter(s => s.dueDay >= today)
      .sort((a, b) => a.dueDay - b.dueDay)
      .slice(0, 3)
  }

  return { subs, add, remove, toggle, update, monthlyTotal, yearlyTotal, upcomingThisMonth }
}
