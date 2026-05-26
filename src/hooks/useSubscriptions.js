import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Claude.ai', icon: '🤖', amount: 3500, billingDay: 1, category: 'AI', active: true },
  { id: '2', name: 'Netlify', icon: '⚡', amount: 2500, billingDay: 18, category: 'Dev', active: true },
  { id: '3', name: 'The Athletic', icon: '⚽', amount: 1200, billingDay: 10, category: 'Sport', active: true },
  { id: '4', name: 'Audible', icon: '🎧', amount: 1800, billingDay: 15, category: 'Afþreying', active: true },
  { id: '5', name: 'Duolingo Plus', icon: '🦜', amount: 900, billingDay: 20, category: 'Menntun', active: true },
  { id: '6', name: 'Spotify', icon: '🎵', amount: 1500, billingDay: 12, category: 'Tónlist', active: true },
  { id: '7', name: 'Xbox Game Pass', icon: '🎮', amount: 1900, billingDay: 22, category: 'Gaming', active: true },
  { id: '8', name: 'Huel', icon: '💪', amount: 8500, billingDay: 1, category: 'Heilsa', active: true },
  { id: '9', name: 'Kimi (Moonshot)', icon: '🌙', amount: 1600, billingDay: 1, category: 'AI', active: true },
  { id: '10', name: 'ElevenLabs', icon: '🎙️', amount: 2200, billingDay: 16, category: 'AI', active: false },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi-subscriptions', DEFAULT_SUBS)

  const activeSubs = subs.filter(s => s.active)
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + s.amount, 0)

  const today = new Date().getDate()
  const duesSoon = activeSubs.filter(s => {
    const days = s.billingDay >= today ? s.billingDay - today : 31 - today + s.billingDay
    return days <= 7
  }).map(s => ({
    ...s,
    daysLeft: s.billingDay >= today ? s.billingDay - today : 31 - today + s.billingDay
  })).sort((a, b) => a.daysLeft - b.daysLeft)

  function addSub(sub) {
    setSubs(s => [...s, { id: Date.now().toString(), ...sub, active: true }])
  }
  function removeSub(id) { setSubs(s => s.filter(s2 => s2.id !== id)) }
  function toggleSub(id) { setSubs(s => s.map(s2 => s2.id === id ? { ...s2, active: !s2.active } : s2)) }
  function updateSub(id, updates) { setSubs(s => s.map(s2 => s2.id === id ? { ...s2, ...updates } : s2)) }

  return { subs, activeSubs, monthlyTotal, duesSoon, addSub, removeSub, toggleSub, updateSub }
}
