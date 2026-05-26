export function getGreeting(name = 'Addi') {
  const h = new Date().getHours()
  if (h < 5) return `Góða nótt, ${name} 🌙`
  if (h < 12) return `Góðan daginn, ${name} ☀️`
  if (h < 17) return `Gott síðdegi, ${name} 🌤`
  if (h < 22) return `Gott kvöld, ${name} 🌆`
  return `Góða nótt, ${name} 🌙`
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

export function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'Rétt í þessu'
  if (diff < 3600) return `${Math.floor(diff / 60)} mín`
  if (diff < 86400) return `${Math.floor(diff / 3600)} klst`
  return `${Math.floor(diff / 86400)} d`
}

export function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
