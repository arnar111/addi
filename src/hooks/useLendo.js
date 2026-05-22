import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'set', label: 'Veislusett (borð + 10 stólar)', icon: '🎪', price: 7000 },
  { id: 'table', label: 'Borð', icon: '🪵', price: 2000 },
  { id: 'chairs10', label: 'Stólar x10', icon: '🪑', price: 3000 },
  { id: 'chairs20', label: 'Stólar x20', icon: '🪑', price: 5000 },
  { id: 'other', label: 'Annað', icon: '📦', price: 0 },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ date, itemId, days = 1, amount, note = '', customer = '' }) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId) || LENDO_ITEMS[4]
    setBookings(prev => [{
      id: Date.now().toString(),
      date: date || new Date().toISOString().split('T')[0],
      itemId,
      itemLabel: item.label,
      itemIcon: item.icon,
      days: Number(days),
      amount: amount != null ? Number(amount) : item.price * Number(days),
      note,
      customer,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const getMonth = (year, month) =>
    bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === month && d.getFullYear() === year
    })

  const currentMonthBookings = () => {
    const now = new Date()
    return getMonth(now.getFullYear(), now.getMonth())
  }

  const monthlyRevenue = () => currentMonthBookings().reduce((s, b) => s + b.amount, 0)
  const monthlyProgress = () => Math.min(100, Math.round((monthlyRevenue() / monthlyGoal) * 100))
  const monthlyRemaining = () => monthlyGoal - monthlyRevenue()
  const totalBookings = bookings.length
  const totalRevenue = () => bookings.reduce((s, b) => s + b.amount, 0)
  const avgPerBooking = () => bookings.length ? Math.round(totalRevenue() / bookings.length) : 0

  // Last 6 months revenue for mini chart
  const last6Months = () => {
    const result = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const m = getMonth(d.getFullYear(), d.getMonth())
      result.push({
        label: d.toLocaleDateString('is-IS', { month: 'short' }),
        revenue: m.reduce((s, b) => s + b.amount, 0),
        count: m.length,
      })
    }
    return result
  }

  return {
    bookings,
    addBooking,
    removeBooking,
    monthlyGoal,
    setMonthlyGoal,
    currentMonthBookings,
    monthlyRevenue,
    monthlyProgress,
    monthlyRemaining,
    totalBookings,
    totalRevenue,
    avgPerBooking,
    last6Months,
  }
}
