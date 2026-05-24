import { useLocalStorage } from './useLocalStorage'

export const RENTAL_ITEMS = [
  { id: 'veislusett', label: 'Veislusett (borð + 10 stólar)', icon: '🪑', defaultPrice: 7000 },
  { id: 'bord', label: 'Borð eitt', icon: '🪵', defaultPrice: 3500 },
  { id: 'stolar', label: 'Stólar (sett)', icon: '💺', defaultPrice: 4000 },
  { id: 'other', label: 'Annað', icon: '📦', defaultPrice: 5000 },
]

export function useIncome() {
  const [bookings, setBookings] = useLocalStorage('addi_bookings', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_income_goal', 200000)

  const addBooking = (itemId, amount, note = '', date = null) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      amount: Number(amount),
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = id => setBookings(prev => prev.filter(b => b.id !== id))

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonthBookings().reduce((s, b) => s + b.amount, 0)
  const remaining = () => monthlyGoal - monthlyTotal()
  const progress = () => Math.min(100, Math.round((monthlyTotal() / monthlyGoal) * 100))

  const byItem = () => {
    const result = {}
    currentMonthBookings().forEach(b => {
      result[b.itemId] = (result[b.itemId] || 0) + b.amount
    })
    return result
  }

  return {
    bookings,
    addBooking,
    removeBooking,
    monthlyGoal,
    setMonthlyGoal,
    currentMonthBookings,
    monthlyTotal,
    remaining,
    progress,
    byItem,
    recentBookings: bookings.slice(0, 30),
  }
}
