import { useLocalStorage } from './useLocalStorage'

export const SUB_STATUS = {
  active: { label: 'Virk', color: 'var(--success)' },
  paused: { label: 'Hlé', color: '#f97316' },
  failed: { label: 'Mistókst', color: 'var(--danger)' },
  warning: { label: 'Athugið', color: '#eab308' },
  cancelled: { label: 'Hætt', color: 'var(--muted)' },
}

const DEFAULTS = [
  { id: '1', name: 'Netflix', icon: '🎬', price: 2500, billing: 'monthly', status: 'warning', color: '#e50914', day: 20, note: 'Uppfæra greiðslu' },
  { id: '2', name: 'Apple iCloud+', icon: '🍎', price: 420, billing: 'monthly', status: 'active', color: '#555555', day: 23, note: '' },
  { id: '3', name: 'Spotify', icon: '🎵', price: 1490, billing: 'monthly', status: 'active', color: '#1db954', day: 15, note: '' },
  { id: '4', name: 'Canva Pro', icon: '🎨', price: 2100, billing: 'monthly', status: 'active', color: '#7d2ae8', day: 1, note: '' },
  { id: '5', name: 'Claude (Anthropic)', icon: '🤖', price: 2800, billing: 'monthly', status: 'paused', color: '#cc9b5a', day: 17, note: 'Greiðsla mistókst' },
  { id: '6', name: 'Moonshot AI (Kimi)', icon: '🌙', price: 2800, billing: 'monthly', status: 'active', color: '#6366f1', day: 18, note: '' },
  { id: '7', name: 'Netlify', icon: '⚡', price: 2800, billing: 'monthly', status: 'active', color: '#00ad9f', day: 12, note: '' },
  { id: '8', name: 'Brave Leo', icon: '🦁', price: 2100, billing: 'monthly', status: 'active', color: '#ff6633', day: 1, note: '' },
  { id: '9', name: 'Microsoft 365', icon: '💼', price: 1400, billing: 'monthly', status: 'failed', color: '#0078d4', day: 1, note: 'Greiðsla mistókst' },
  { id: '10', name: 'Disney+', icon: '🏰', price: 1800, billing: 'monthly', status: 'cancelled', color: '#113ccf', day: 1, note: '' },
  { id: '11', name: 'Paramount+', icon: '⭐', price: 1600, billing: 'monthly', status: 'paused', color: '#0064ff', day: 21, note: 'Greiðsla mistókst' },
  { id: '12', name: 'Wolt Pass', icon: '🛵', price: 990, billing: 'monthly', status: 'active', color: '#009de0', day: 14, note: '' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = (sub) => {
    setSubs(prev => [{ ...sub, id: Date.now().toString() }, ...prev])
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const update = (id, changes) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))
  }

  const activeSubs = subs.filter(s => s.status === 'active')
  const monthlyTotal = subs
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billing === 'monthly' ? s.price : Math.round(s.price / 12)), 0)

  const problematic = subs.filter(s => ['failed', 'paused', 'warning'].includes(s.status))

  return { subs, add, remove, update, monthlyTotal, problematic, activeSubs }
}
