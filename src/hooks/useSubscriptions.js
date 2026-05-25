import { useLocalStorage } from './useLocalStorage'

export const SUB_CATEGORIES = [
  { id: 'ai', label: 'AI & Tækni', icon: '🤖', color: '#00d4aa' },
  { id: 'entertainment', label: 'Skemmtun', icon: '🎬', color: '#ec4899' },
  { id: 'productivity', label: 'Framleiðni', icon: '💼', color: '#8b5cf6' },
  { id: 'health', label: 'Heilsa', icon: '💪', color: '#22c55e' },
  { id: 'music', label: 'Tónlist', icon: '🎵', color: '#1db954' },
  { id: 'cloud', label: 'Geymsla', icon: '☁️', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '📦', color: '#64748b' },
]

const DEFAULT_SUBS = [
  { id: '1', name: 'Claude / Anthropic', icon: '🤖', category: 'ai', amount: 2900, cycle: 'monthly', active: true, note: 'AI assistant' },
  { id: '2', name: 'Netlify', icon: '🌐', category: 'productivity', amount: 2900, cycle: 'monthly', active: true, note: 'Hosting & CI/CD' },
  { id: '3', name: 'Moonshot AI (Kimi)', icon: '🌙', category: 'ai', amount: 2900, cycle: 'monthly', active: true, note: 'AI tools' },
  { id: '4', name: 'Apple iCloud+', icon: '☁️', category: 'cloud', amount: 1600, cycle: 'monthly', active: true, note: '50GB geymsla' },
  { id: '5', name: 'Spotify', icon: '🎵', category: 'music', amount: 2500, cycle: 'monthly', active: true, note: 'Tónlist' },
  { id: '6', name: 'The Athletic', icon: '⚽', category: 'entertainment', amount: 1500, cycle: 'monthly', active: true, note: 'Íþróttafréttir' },
  { id: '7', name: 'Paramount+', icon: '🎬', category: 'entertainment', amount: 1200, cycle: 'monthly', active: false, note: 'Í bið – greiðsluvandræði' },
  { id: '8', name: 'Chegg', icon: '📚', category: 'other', amount: 2300, cycle: 'monthly', active: false, note: 'Greiðsluvandræði' },
  { id: '9', name: 'Huel', icon: '💪', category: 'health', amount: 15000, cycle: 'custom', customDays: 35, active: true, note: 'Næringardrykk, ~5 vikna fresti' },
  { id: '10', name: 'GrowIt Garden', icon: '🌱', category: 'health', amount: 470, cycle: 'monthly', active: true, note: 'Plöntustjóri (árs áskrift = ~5,600 kr)' },
  { id: '11', name: 'Driver Booster', icon: '💻', category: 'productivity', amount: 367, cycle: 'monthly', active: false, note: 'Árs áskrift – greiðsluvandræði' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions_v2', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const monthlyAmount = (sub) => {
    if (!sub.active) return 0
    if (sub.cycle === 'monthly') return sub.amount
    if (sub.cycle === 'annual') return Math.round(sub.amount / 12)
    if (sub.cycle === 'custom') return Math.round(sub.amount / ((sub.customDays || 30) / 30))
    return sub.amount
  }

  const monthlyTotal = () => subs.reduce((sum, s) => sum + monthlyAmount(s), 0)
  const annualTotal = () => monthlyTotal() * 12

  const activeSubs = subs.filter(s => s.active)
  const pausedSubs = subs.filter(s => !s.active)

  return { subs, add, remove, toggle, update, monthlyTotal, annualTotal, monthlyAmount, activeSubs, pausedSubs }
}
