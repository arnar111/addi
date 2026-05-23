import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veislusett', name: 'Veislusett (borð + 10 stólar)', weekdayRate: 7000, weekendRate: 10000, icon: '🪑' },
  { id: 'extra', name: 'Viðbótarstólar (x10)', weekdayRate: 2000, weekendRate: 3000, icon: '➕' },
  { id: 'custom', name: 'Sérsniðið', weekdayRate: 0, weekendRate: 0, icon: '✏️' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const isWeekend = (dateStr) => {
    const d = new Date(dateStr)
    return d.getDay() === 0 || d.getDay() === 6
  }

  const calcRate = (itemId, dateStr) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    if (!item || item.id === 'custom') return 0
    return isWeekend(dateStr) ? item.weekendRate : item.weekdayRate
  }

  const add = (booking) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paid: false,
      ...booking,
    }, ...prev])
  }

  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const togglePaid = (id) => setBookings(prev =>
    prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b)
  )

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () =>
    currentMonthBookings().reduce((s, b) => s + (b.amount || 0), 0)

  const paidThisMonth = () =>
    currentMonthBookings().filter(b => b.paid).reduce((s, b) => s + (b.amount || 0), 0)

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return [...bookings]
      .filter(b => new Date(b.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const pastBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return [...bookings]
      .filter(b => new Date(b.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const bookedDates = () => new Set(bookings.map(b => b.date))

  return {
    bookings,
    monthlyGoal,
    setMonthlyGoal,
    add,
    remove,
    togglePaid,
    calcRate,
    currentMonthBookings,
    monthlyIncome,
    paidThisMonth,
    upcomingBookings,
    pastBookings,
    bookedDates,
  }
}
