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

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Matur', icon: '🍽️', color: '#f97316' },
  { id: 'transport', label: 'Samgöngur', icon: '🚗', color: '#3b82f6' },
  { id: 'housing', label: 'Húsnæði', icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment', label: 'Afþreying', icon: '🎮', color: '#ec4899' },
  { id: 'health', label: 'Heilsa', icon: '💊', color: '#22c55e' },
  { id: 'shopping', label: 'Innkaup', icon: '🛍️', color: '#eab308' },
  { id: 'subscriptions', label: 'Áskriftir', icon: '📱', color: '#00d4aa' },
  { id: 'peppers', label: 'Pippurar', icon: '🌶️', color: '#ef4444' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]

export const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🪑', color: '#00d4aa' },
  { id: 'salary', label: 'Laun', icon: '💼', color: '#3b82f6' },
  { id: 'freelance', label: 'Verktaki', icon: '💻', color: '#8b5cf6' },
  { id: 'compensation', label: 'Bætur', icon: '🏥', color: '#22c55e' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#64748b' },
]
