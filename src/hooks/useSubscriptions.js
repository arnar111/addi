import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', amount: 1990, cycle: 'monthly', icon: '🎵', active: true, url: 'https://open.spotify.com' },
  { id: '2', name: 'Audible', amount: 1790, cycle: 'monthly', icon: '🎧', active: true, url: 'https://audible.com' },
  { id: '3', name: 'Xbox Game Pass', amount: 2490, cycle: 'monthly', icon: '🎮', active: true, url: 'https://xbox.com' },
  { id: '4', name: 'The Athletic', amount: 1590, cycle: 'monthly', icon: '⚽', active: true, url: 'https://theathletic.com' },
  { id: '5', name: 'Huel', amount: 8500, cycle: 'monthly', icon: '🥤', active: true, url: 'https://huel.com' },
  { id: '6', name: 'Claude AI', amount: 4990, cycle: 'monthly', icon: '🤖', active: true, url: 'https://claude.ai' },
  { id: '7', name: 'ElevenLabs', amount: 0, cycle: 'monthly', icon: '🗣️', active: false, url: 'https://elevenlabs.io' },
  { id: '8', name: 'Washington Post', amount: 990, cycle: 'monthly', icon: '🗞️', active: true, url: 'https://washingtonpost.com' },
]

const DEFAULT_AUDIBLE = { count: 11, expiringSoon: 1 }

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)
  const [audibleCredits, setAudibleCredits] = useLocalStorage('addi_audible_credits', DEFAULT_AUDIBLE)

  const monthlyTotal = subs
    .filter(s => s.active && s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  const yearlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.cycle === 'monthly' ? s.amount * 12 : s.amount), 0)

  const add = (sub) => setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  return { subs, monthlyTotal, yearlyTotal, add, toggle, remove, update, audibleCredits, setAudibleCredits }
}
