import { useLocalStorage } from './useLocalStorage'

export const MONTHLY_GOAL = 200000

export const LENDO_CATS = [
  { id: 'veislusett', label: 'Veislusett', icon: '🎪', color: '#f97316' },
  { id: 'stolar',     label: 'Stólar',     icon: '🪑', color: '#8b5cf6' },
  { id: 'bord',       label: 'Borð',        icon: '🪞', color: '#3b82f6' },
  { id: 'annað',      label: 'Annað',       icon: '📦', color: '#64748b' },
]

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_v2', [])

  const addBooking = ({ date, category, amount, note = '', days = 1 }) => {
    setBookings(prev => [...prev, {
      id: Date.now().toString(),
      date,
      category,
      amount: Number(amount),
      note,
      days: Number(days),
      createdAt: new Date().toISOString(),
    }])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const forMonth = (date = new Date()) => {
    const mk = monthKey(date)
    return bookings.filter(b => b.date.startsWith(mk))
  }

  const monthlyRevenue = (date = new Date()) =>
    forMonth(date).reduce((s, b) => s + b.amount, 0)

  const monthlyBookings = (date = new Date()) => forMonth(date).length

  const streak = () => {
    const today = new Date()
    let count = 0
    const d = new Date(today)
    while (true) {
      const mk = monthKey(d)
      const rev = bookings.filter(b => b.date.startsWith(mk)).reduce((s, b) => s + b.amount, 0)
      if (rev >= MONTHLY_GOAL) { count++; d.setMonth(d.getMonth() - 1) }
      else break
    }
    return count
  }

  const recentBookings = [...bookings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)

  return {
    bookings,
    recentBookings,
    addBooking,
    removeBooking,
    forMonth,
    monthlyRevenue,
    monthlyBookings,
    streak,
    MONTHLY_GOAL,
  }
}
