export function formatISK(amount) {
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatShortISK(amount) {
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M kr`
  if (Math.abs(amount) >= 1_000) return `${Math.round(amount / 1_000)}k kr`
  return `${Math.round(amount)} kr`
}

export const INCOME_CATEGORIES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Takk / Laun', icon: '💼', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6' },
  { id: 'namslán', label: 'Námslan', icon: '🎓', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Matur', icon: '🍽️', color: '#f97316' },
  { id: 'transport', label: 'Samgöngur', icon: '🚗', color: '#3b82f6' },
  { id: 'housing', label: 'Húsnæði', icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment', label: 'Afþreying', icon: '🎮', color: '#ec4899' },
  { id: 'health', label: 'Heilsa', icon: '💊', color: '#22c55e' },
  { id: 'shopping', label: 'Innkaup', icon: '🛍️', color: '#eab308' },
  { id: 'subscriptions', label: 'Áskriftir', icon: '📱', color: '#00d4aa' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]
