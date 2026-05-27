export function getGreeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Góða nótt, Addi 🌙'
  if (h < 10) return 'Góðan morgun, Addi ☀️'
  if (h < 12) return 'Góðan daginn, Addi 👋'
  if (h < 17) return 'Hæ Addi! 🤙'
  if (h < 22) return 'Gott kvöld, Addi 🌆'
  return 'Góða nótt, Addi 🌙'
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

export function monthName(date = new Date()) {
  return new Date(date).toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })
}

export function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
