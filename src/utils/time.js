export function getGreeting(name = 'Addi') {
  const h = new Date().getHours()
  const base = h < 5 ? 'Góða nótt' : h < 12 ? 'Góðan daginn' : h < 17 ? 'Gott síðdegi' : h < 22 ? 'Gott kvöld' : 'Góða nótt'
  return name ? `${base}, ${name}` : base
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
