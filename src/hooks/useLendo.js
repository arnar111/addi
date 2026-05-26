import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veislusett', label: 'Veislusett', icon: '🎉' },
  { id: 'bord', label: 'Borð', icon: '🪑' },
  { id: 'stolar', label: 'Stólar', icon: '🪑' },
  { id: 'tjald', label: 'Tjald', icon: '⛺' },
  { id: 'grill', label: 'Grill', icon: '🔥' },
  { id: 'annad', label: 'Annað', icon: '📦' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = (amount, item, note = '', date = null) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const getMonthBookings = (monthOffset = 0) => {
    const now = new Date()
    let month = now.getMonth() + monthOffset
    let year = now.getFullYear()
    while (month < 0) { month += 12; year-- }
    while (month > 11) { month -= 12; year++ }
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }

  const currentMonth = () => getMonthBookings(0)
  const lastMonth = () => getMonthBookings(-1)

  const monthlyRevenue = () => currentMonth().reduce((s, b) => s + b.amount, 0)
  const lastMonthRevenue = () => lastMonth().reduce((s, b) => s + b.amount, 0)

  const last7Days = () => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStr = d.toISOString().split('T')[0]
      const dayRevenue = bookings
        .filter(b => b.date.startsWith(dayStr))
        .reduce((s, b) => s + b.amount, 0)
      result.push({
        date: dayStr,
        revenue: dayRevenue,
        day: d.toLocaleDateString('is-IS', { weekday: 'short' }),
      })
    }
    return result
  }

  const topItems = () => {
    const counts = {}
    currentMonth().forEach(b => {
      if (!counts[b.item]) counts[b.item] = { revenue: 0, count: 0 }
      counts[b.item].revenue += b.amount
      counts[b.item].count++
    })
    return Object.entries(counts)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 3)
      .map(([item, stats]) => ({ item, ...stats }))
  }

  const revenueStreak = () => {
    let streak = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const dayStr = d.toISOString().split('T')[0]
      const dayRevenue = bookings
        .filter(b => b.date.startsWith(dayStr))
        .reduce((s, b) => s + b.amount, 0)
      if (dayRevenue > 0) {
        streak++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return streak
  }

  const totalBookingsThisMonth = () => currentMonth().length
  const avgPerBooking = () => {
    const m = currentMonth()
    if (m.length === 0) return 0
    return Math.round(m.reduce((s, b) => s + b.amount, 0) / m.length)
  }

  const recentBookings = bookings.slice(0, 40)

  return {
    bookings, addBooking, removeBooking,
    goal, setGoal,
    currentMonth, lastMonth,
    monthlyRevenue, lastMonthRevenue,
    last7Days, topItems,
    revenueStreak,
    totalBookingsThisMonth, avgPerBooking,
    recentBookings,
  }
}
