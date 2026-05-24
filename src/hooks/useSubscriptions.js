import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', icon: '🎬', amount: 2190, active: true, color: '#e50914' },
  { id: '2', name: 'Spotify', icon: '🎵', amount: 1390, active: true, color: '#1db954' },
  { id: '3', name: 'Disney+', icon: '✨', amount: 1490, active: false, color: '#1139f2' },
  { id: '4', name: 'iCloud+', icon: '☁️', amount: 690, active: true, color: '#007aff' },
  { id: '5', name: 'HBO Max', icon: '📺', amount: 1490, active: false, color: '#7b2fbe' },
  { id: '6', name: 'Amazon Prime', icon: '📦', amount: 1290, active: false, color: '#ff9900' },
  { id: '7', name: 'YouTube Premium', icon: '▶️', amount: 1590, active: false, color: '#ff0000' },
  { id: '8', name: 'ChatGPT Plus', icon: '🤖', amount: 2690, active: false, color: '#10a37f' },
  { id: '9', name: 'Adobe CC', icon: '🎨', amount: 5990, active: false, color: '#ff0000' },
  { id: '10', name: 'Microsoft 365', icon: '📊', amount: 1890, active: false, color: '#0078d4' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const add = (name, icon, amount, color = '#00d4aa') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, amount: Number(amount), active: true, color,
    }])
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const updateAmount = (id, amount) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, amount: Number(amount) } : s))
  }

  const activeSubs = subs.filter(s => s.active)
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  return { subs, activeSubs, toggle, add, remove, updateAmount, monthlyTotal, yearlyTotal }
}
