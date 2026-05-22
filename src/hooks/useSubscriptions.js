import { useLocalStorage } from './useLocalStorage'

export const SUB_STATUSES = {
  active: { label: 'Virk', color: '#22c55e' },
  failed: { label: 'Greiðsla mistókst', color: '#ef4444' },
  paused: { label: 'Í bið', color: '#f97316' },
  cancelled: { label: 'Hætt við', color: '#64748b' },
}

export const POPULAR_SUBS = [
  { name: 'Spotify', amount: 2490, icon: '🎵', color: '#1db954' },
  { name: 'Netflix', amount: 2484, icon: '🎬', color: '#e50914' },
  { name: 'Prime Video', amount: 1290, icon: '📺', color: '#00a8e0' },
  { name: 'Paramount+', amount: 1380, icon: '⭐', color: '#0064ff' },
  { name: 'The Athletic', amount: 1380, icon: '⚽', color: '#f97316' },
  { name: 'iCloud+', amount: 490, icon: '☁️', color: '#3b82f6' },
  { name: 'YouTube Premium', amount: 1590, icon: '▶️', color: '#ff0000' },
  { name: 'Disney+', amount: 1990, icon: '✨', color: '#113ccf' },
  { name: 'GitHub Pro', amount: 1200, icon: '💻', color: '#6e5494' },
  { name: 'ChatGPT Plus', amount: 2790, icon: '🤖', color: '#10a37f' },
  { name: 'Headspace', amount: 990, icon: '🧘', color: '#f97316' },
]

const DEFAULTS = [
  { id: '1', name: 'Claude / Anthropic', icon: '🤖', amount: 13800, color: '#8b5cf6', active: false, status: 'failed', nextBilling: null },
  { id: '2', name: 'Netlify', icon: '🌐', amount: 2760, color: '#00d4aa', active: true, status: 'active', nextBilling: '2026-06-12' },
  { id: '3', name: 'Netflix', icon: '🎬', amount: 2484, color: '#e50914', active: false, status: 'failed', nextBilling: null },
  { id: '4', name: 'Paramount+', icon: '⭐', amount: 1380, color: '#0064ff', active: false, status: 'paused', nextBilling: null },
  { id: '5', name: 'Moonshot AI', icon: '🚀', amount: 2760, color: '#f97316', active: true, status: 'active', nextBilling: '2026-06-18' },
  { id: '6', name: 'Patreon', icon: '🎭', amount: 690, color: '#ff424d', active: true, status: 'active', nextBilling: '2026-06-01' },
  { id: '7', name: 'The Athletic', icon: '⚽', amount: 1380, color: '#1d4ed8', active: true, status: 'active', nextBilling: '2026-06-15' },
  { id: '8', name: 'Chegg', icon: '📚', amount: 2760, color: '#ff5a23', active: false, status: 'failed', nextBilling: null },
  { id: '9', name: 'Driver Booster PRO', icon: '🔧', amount: 395, color: '#3b82f6', active: false, status: 'failed', nextBilling: null },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = ({ name, icon, amount, color, status = 'active', nextBilling = null } = {}) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name: name || 'Ný áskrift',
      icon: icon || '💳',
      amount: Number(amount) || 0,
      color: color || '#64748b',
      active: status === 'active',
      status,
      nextBilling,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, changes) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s
      const updated = { ...s, ...changes }
      if ('status' in changes) updated.active = changes.status === 'active'
      if ('active' in changes && !('status' in changes)) {
        updated.status = changes.active ? 'active' : (s.status === 'active' ? 'paused' : s.status)
      }
      return updated
    }))
  }

  const toggle = (id) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s
      const active = !s.active
      return { ...s, active, status: active ? 'active' : 'paused' }
    }))
  }

  const monthlyTotal = subs.filter(s => s.status === 'active').reduce((t, s) => t + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12
  const failedSubs = subs.filter(s => s.status === 'failed')
  const activeSubs = subs.filter(s => s.status === 'active')

  return { subs, add, remove, toggle, update, monthlyTotal, yearlyTotal, failedSubs, activeSubs }
}
