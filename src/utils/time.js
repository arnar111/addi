export function getGreeting(name = 'Addi') {
  const h = new Date().getHours()
  if (h < 5) return `Góða nótt, ${name}`
  if (h < 12) return `Góðan daginn, ${name}`
  if (h < 17) return `Gott síðdegi, ${name}`
  if (h < 22) return `Gott kvöld, ${name}`
  return `Góða nótt, ${name}`
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function isToday(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export function isPast(dateStr) {
  return new Date(dateStr) < new Date()
}
