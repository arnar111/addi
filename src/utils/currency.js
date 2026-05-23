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
