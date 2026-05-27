export function getGreeting(name = 'Addi') {
  const h = new Date().getHours()
  if (h < 5) return `Góða nótt, ${name} 🌙`
  if (h < 9) return `Góðan morgun, ${name} ☀️`
  if (h < 12) return `Góðan daginn, ${name} 👋`
  if (h < 14) return `Gott hádegi, ${name} 🍽️`
  if (h < 17) return `Gott síðdegi, ${name} 💪`
  if (h < 21) return `Gott kvöld, ${name} ⚽`
  return `Slökktu á og hvíldu þig, ${name} 🎵`
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

export function daysUntil(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function hoursUntil(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
}
