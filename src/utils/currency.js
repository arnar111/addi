export function formatISK(n) {
  if (!n && n !== 0) return '0 kr'
  return new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK', maximumFractionDigits: 0 }).format(n)
}

export function formatShortISK(n) {
  if (!n && n !== 0) return '0'
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M kr`
  if (Math.abs(n) >= 1_000) return `${Math.round(n / 1000)}þ kr`
  return `${Math.round(n)} kr`
}

export const EXPENSE_CATEGORIES = [
  { id: 'food',           label: 'Matur',       icon: '🍔', color: '#f97316' },
  { id: 'transport',      label: 'Samgöngur',   icon: '🚗', color: '#3b82f6' },
  { id: 'housing',        label: 'Húsnæði',     icon: '🏠', color: '#8b5cf6' },
  { id: 'entertainment',  label: 'Afþreying',   icon: '🎬', color: '#ec4899' },
  { id: 'health',         label: 'Heilsa',      icon: '💊', color: '#22c55e' },
  { id: 'shopping',       label: 'Innkaup',     icon: '🛒', color: '#eab308' },
  { id: 'subscriptions',  label: 'Áskriftir',   icon: '📱', color: '#06b6d4' },
  { id: 'nicotine',       label: 'Nikótín',     icon: '🏷️', color: '#a78bfa' },
  { id: 'other',          label: 'Annað',       icon: '📦', color: '#64748b' },
]

export const SUBSCRIPTIONS = [
  { id: 'netlify',    name: 'Netlify',       icon: '🌐', color: '#06b6d4', amountISK: 3500,  period: 'monthly' },
  { id: 'athletic',   name: 'The Athletic',  icon: '⚽', color: '#f97316', amountISK: 2800,  period: 'monthly' },
  { id: 'patreon',    name: 'Patreon',       icon: '🎬', color: '#ec4899', amountISK: 1500,  period: 'monthly' },
  { id: 'growit',     name: 'GrowIt',        icon: '🌱', color: '#22c55e', amountISK: 1800,  period: 'yearly'  },
  { id: 'github',     name: 'GitHub',        icon: '🐙', color: '#8b5cf6', amountISK: 1500,  period: 'monthly' },
  { id: 'spotify',    name: 'Spotify',       icon: '🎵', color: '#1db954', amountISK: 2200,  period: 'monthly' },
  { id: 'europesnus', name: 'Europe Snus',   icon: '🏷️', color: '#a78bfa', amountISK: 8000,  period: 'monthly' },
]
