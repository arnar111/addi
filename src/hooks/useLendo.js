import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'party_set', label: 'Veislusett (borð + 10 stólar)', icon: '🪑', price: 7000 },
  { id: 'extra_chairs', label: 'Aukalegir stólar (x10)', icon: '💺', price: 3000 },
  { id: 'tent', label: 'Tjald', icon: '⛺', price: 5000 },
  { id: 'other', label: 'Annað', icon: '📦', price: 0 },
]

const MONTHLY_GOAL = 200000

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', MONTHLY_GOAL)

  const addBooking = (itemId, days, amount, note = '', date = null) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      days: Number(days),
      amount: Number(amount),
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonthBookings().reduce((s, b) => s + b.amount, 0)
  const monthlyGoalPct = () => Math.min(100, Math.round((monthlyTotal() / goal) * 100))
  const totalAllTime = () => bookings.reduce((s, b) => s + b.amount, 0)
  const totalBookings = () => bookings.length

  return {
    bookings,
    addBooking,
    removeBooking,
    currentMonthBookings,
    monthlyTotal,
    monthlyGoalPct,
    totalAllTime,
    totalBookings,
    goal,
    setGoal,
  }
}
