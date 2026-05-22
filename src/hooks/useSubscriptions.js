import { useLocalStorage } from './useLocalStorage'

export const SUB_CATEGORIES = [
  { id: 'entertainment', label: 'Skemmtun', icon: '🎬', color: '#ec4899' },
  { id: 'productivity', label: 'Framleiðni', icon: '💼', color: '#3b82f6' },
  { id: 'health', label: 'Heilsa', icon: '💪', color: '#22c55e' },
  { id: 'storage', label: 'Geymsla', icon: '☁️', color: '#8b5cf6' },
  { id: 'news', label: 'Fréttir/Tónlist', icon: '📰', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '📦', color: '#64748b' },
]

const DEFAULTS = [
  { id: '1', name: 'Spotify', icon: '🎵', color: '#1db954', amount: 2490, cycle: 'monthly', category: 'entertainment', active: true },
  { id: '2', name: 'Netflix', icon: '🎬', color: '#e50914', amount: 2990, cycle: 'monthly', category: 'entertainment', active: true },
  { id: '3', name: 'iCloud+', icon: '☁️', color: '#3b82f6', amount: 990, cycle: 'monthly', category: 'storage', active: true },
  { id: '4', name: 'YouTube Premium', icon: '▶️', color: '#ff0000', amount: 1990, cycle: 'monthly', category: 'entertainment', active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULTS)

  const add = ({ name, icon = '📦', color = '#64748b', amount, cycle = 'monthly', category = 'other' }) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, color,
      amount: Number(amount),
      cycle,
      category,
      active: true,
      createdAt: new Date().toISOString(),
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggleActive = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, patch) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const activeSubs = subs.filter(s => s.active)
  const monthlyTotal = Math.round(
    activeSubs.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.amount / 12 : s.amount), 0)
  )
  const yearlyTotal = monthlyTotal * 12

  return { subs, add, remove, toggleActive, update, monthlyTotal, yearlyTotal }
}
