import { useLocalStorage } from './useLocalStorage'

export const SUB_CATEGORIES = [
  { id: 'streaming', label: 'Streymi', icon: '🎬' },
  { id: 'music', label: 'Tónlist', icon: '🎵' },
  { id: 'gaming', label: 'Leikir', icon: '🎮' },
  { id: 'cloud', label: 'Geymsla', icon: '☁️' },
  { id: 'software', label: 'Hugbúnaður', icon: '💻' },
  { id: 'gym', label: 'Líkamsrækt', icon: '🏋️' },
  { id: 'news', label: 'Fréttir', icon: '📰' },
  { id: 'other', label: 'Annað', icon: '💳' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', [
    { id: '1', name: 'Netflix', amount: 1990, cycle: 'monthly', category: 'streaming' },
    { id: '2', name: 'Spotify', amount: 1490, cycle: 'monthly', category: 'music' },
    { id: '3', name: 'iCloud', amount: 990, cycle: 'monthly', category: 'cloud' },
  ])

  const add = (sub) => setSubs(prev => [...prev, { id: Date.now().toString(), ...sub }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const monthlyTotal = Math.round(
    subs.reduce((t, s) => t + (s.cycle === 'yearly' ? s.amount / 12 : s.amount), 0)
  )
  const yearlyTotal = Math.round(
    subs.reduce((t, s) => t + (s.cycle === 'yearly' ? s.amount : s.amount * 12), 0)
  )

  return { subs, add, remove, monthlyTotal, yearlyTotal }
}
