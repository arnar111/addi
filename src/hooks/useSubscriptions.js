import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: 'huel',
    name: 'Huel',
    icon: '🥤',
    color: '#f97316',
    amount: 9990,
    cycle: 'monthly',
    nextDate: '2026-06-01',
    category: 'health',
    active: true,
    note: 'Næringardrykk · greiðsla misheppnaðist!',
    url: 'https://huel.com',
  },
  {
    id: 'audible',
    name: 'Audible',
    icon: '🎧',
    color: '#f59e0b',
    amount: 2290,
    cycle: 'monthly',
    nextDate: '2026-06-05',
    category: 'entertainment',
    active: true,
    note: '11 einingar · 1 rennur út',
    url: 'https://audible.com',
  },
  {
    id: 'duolingo',
    name: 'Duolingo Plus',
    icon: '🦜',
    color: '#58cc02',
    amount: 1490,
    cycle: 'monthly',
    nextDate: '2026-06-10',
    category: 'education',
    active: true,
    note: '13 ára streak 🔥',
    url: 'https://duolingo.com',
  },
  {
    id: 'athletic',
    name: 'The Athletic',
    icon: '⚽',
    color: '#3b82f6',
    amount: 1490,
    cycle: 'monthly',
    nextDate: '2026-06-08',
    category: 'sports',
    active: true,
    note: 'Fótboltafréttir',
    url: 'https://theathletic.com',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    icon: '⚡',
    color: '#00d4aa',
    amount: 0,
    cycle: 'monthly',
    nextDate: null,
    category: 'tech',
    active: true,
    note: 'Gjaldfrjáls · 50% af 3000 credit notað',
    url: 'https://netlify.com',
  },
  {
    id: 'xbox',
    name: 'Xbox Game Pass',
    icon: '🎮',
    color: '#22c55e',
    amount: 3490,
    cycle: 'monthly',
    nextDate: '2026-06-15',
    category: 'gaming',
    active: true,
    url: 'https://xbox.com',
  },
]

const CATEGORIES = {
  health: { label: 'Heilsa', color: '#f97316' },
  entertainment: { label: 'Skemmtun', color: '#f59e0b' },
  education: { label: 'Menntun', color: '#58cc02' },
  sports: { label: 'Íþróttir', color: '#3b82f6' },
  tech: { label: 'Tækni', color: '#00d4aa' },
  gaming: { label: 'Leikir', color: '#22c55e' },
  other: { label: 'Annað', color: '#8b5cf6' },
}

export { CATEGORIES as SUB_CATEGORIES }

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBSCRIPTIONS)

  const add = (sub) => setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))
  const toggleActive = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const active = subs.filter(s => s.active)

  const monthlyTotal = active.reduce((sum, s) => {
    if (!s.amount || s.amount === 0) return sum
    if (s.cycle === 'yearly') return sum + Math.round(s.amount / 12)
    return sum + s.amount
  }, 0)

  const yearlyTotal = monthlyTotal * 12

  const upcoming = active
    .filter(s => s.nextDate && s.amount > 0)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 5)

  const nextPayment = upcoming[0] || null

  const daysUntilNext = (dateStr) => {
    if (!dateStr) return null
    const diff = new Date(dateStr) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const paidCount = active.filter(s => s.amount > 0).length

  return {
    subs, add, remove, update, toggleActive,
    active, monthlyTotal, yearlyTotal,
    upcoming, nextPayment, paidCount,
    daysUntilNext, CATEGORIES,
  }
}
