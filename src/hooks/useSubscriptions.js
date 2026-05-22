import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify Premium', icon: '🎵', monthlyISK: 1550, active: true },
  { id: '2', name: 'Netflix', icon: '🎬', monthlyISK: 2200, active: true },
  { id: '3', name: 'The Athletic', icon: '⚽', monthlyISK: 1100, active: true },
  { id: '4', name: 'Golf+', icon: '⛳', monthlyISK: 2100, active: true },
  { id: '5', name: 'NY Times', icon: '📰', monthlyISK: 280, active: true },
  { id: '6', name: 'iCloud+', icon: '☁️', monthlyISK: 200, active: true },
  { id: '7', name: 'LinkedIn Premium', icon: '💼', monthlyISK: 5500, active: false },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (name, icon, monthlyISK) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(), name, icon, monthlyISK: Number(monthlyISK), active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, field, value) => setSubs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

  const active = subs.filter(s => s.active)
  const monthlyTotal = active.reduce((sum, s) => sum + s.monthlyISK, 0)
  const yearlyTotal = monthlyTotal * 12

  return { subs, add, remove, toggle, update, active, monthlyTotal, yearlyTotal }
}
