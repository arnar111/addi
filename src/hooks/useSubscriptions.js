import { useLocalStorage } from './useLocalStorage'

export const SUB_CATEGORIES = [
  { id: 'streaming', label: 'Straumar', icon: '📺', color: '#e11d48' },
  { id: 'music', label: 'Tónlist', icon: '🎵', color: '#1db954' },
  { id: 'software', label: 'Hugbúnaður', icon: '💻', color: '#3b82f6' },
  { id: 'fitness', label: 'Líkamsrækt', icon: '🏋️', color: '#00d4aa' },
  { id: 'insurance', label: 'Tryggingar', icon: '🛡️', color: '#8b5cf6' },
  { id: 'phone', label: 'Sími/Net', icon: '📱', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', category: 'music', amount: 2290, cycle: 'monthly', active: true, renewDay: 15 },
  { id: '2', name: 'Netflix', category: 'streaming', amount: 2490, cycle: 'monthly', active: true, renewDay: 1 },
  { id: '3', name: 'Líkamsrækt', category: 'fitness', amount: 8900, cycle: 'monthly', active: true, renewDay: 1 },
  { id: '4', name: 'iCloud+', category: 'software', amount: 590, cycle: 'monthly', active: true, renewDay: 10 },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString(), active: true }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const monthlyTotal = (activeOnly = true) => subs
    .filter(s => !activeOnly || s.active)
    .reduce((sum, s) => sum + (s.cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0)

  const yearlyTotal = (activeOnly = true) => subs
    .filter(s => !activeOnly || s.active)
    .reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.amount : s.amount * 12), 0)

  const upcomingRenewals = () => {
    const today = new Date().getDate()
    return subs
      .filter(s => s.active && s.renewDay)
      .map(s => {
        let daysUntil = s.renewDay - today
        if (daysUntil < 0) daysUntil += 30
        return { ...s, daysUntil }
      })
      .filter(s => s.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }

  return { subs, add, remove, toggle, update, monthlyTotal, yearlyTotal, upcomingRenewals }
}
