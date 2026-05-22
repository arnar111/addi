export const DEFAULT_SUBSCRIPTIONS = [
  { id: 'spotify',    name: 'Spotify',         icon: '🎵', cost: 1590,  billing: 'monthly', category: 'entertainment', active: true,  url: 'open.spotify.com' },
  { id: 'athletic',   name: 'The Athletic',    icon: '🏆', cost: 1820,  billing: 'monthly', category: 'sports',        active: true,  url: 'theathletic.com' },
  { id: 'nytimes',    name: 'NY Times',         icon: '📰', cost: 2800,  billing: 'monthly', category: 'news',          active: true,  url: 'nytimes.com' },
  { id: 'golfplus',   name: 'GOLF+',            icon: '⛳', cost: 1400,  billing: 'monthly', category: 'sports',        active: true,  url: 'golfplusvr.com' },
  { id: 'prime',      name: 'Amazon Prime',     icon: '📦', cost: 1800,  billing: 'monthly', category: 'entertainment', active: true,  url: 'amazon.com' },
  { id: 'paramount',  name: 'Paramount+',       icon: '🎬', cost: 1260,  billing: 'monthly', category: 'entertainment', active: false, url: 'paramountplus.com', note: 'Paused – payment issue' },
  { id: 'icloud',     name: 'iCloud+',          icon: '☁️', cost: 900,   billing: 'monthly', category: 'tech',          active: true,  url: 'icloud.com' },
  { id: 'netlify',    name: 'Netlify',          icon: '🚀', cost: 2660,  billing: 'monthly', category: 'work',          active: true,  url: 'netlify.com', note: '⚠️ Credit card needed' },
  { id: 'huel',       name: 'Huel',             icon: '🥤', cost: 9500,  billing: 'monthly', category: 'health',        active: true,  url: 'huel.com' },
  { id: 'europesnus', name: 'EuropeSnus',        icon: '🌿', cost: 3000,  billing: 'monthly', category: 'other',         active: true,  url: 'europesnus.com' },
]

export const SUB_CATEGORIES = [
  { id: 'all',           label: 'Allt',          color: '#00d4aa' },
  { id: 'entertainment', label: 'Skemmtun',       color: '#8b5cf6' },
  { id: 'sports',        label: 'Íþróttir',       color: '#f97316' },
  { id: 'news',          label: 'Fréttir',        color: '#3b82f6' },
  { id: 'health',        label: 'Heilsa',         color: '#22c55e' },
  { id: 'tech',          label: 'Tækni',          color: '#06b6d4' },
  { id: 'work',          label: 'Vinna',          color: '#eab308' },
  { id: 'other',         label: 'Annað',          color: '#64748b' },
]

export function monthlyTotal(subs) {
  return subs.filter(s => s.active).reduce((acc, s) => acc + (s.billing === 'yearly' ? s.cost / 12 : s.cost), 0)
}

export function yearlyTotal(subs) {
  return monthlyTotal(subs) * 12
}
