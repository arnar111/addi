import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('lendo_goal', 200000)

  function addBooking({ date, customer, item, amount, notes }) {
    setBookings(b => [{
      id: Date.now(),
      date,
      customer,
      item: item || 'Veislusett (borð + 10 stólar)',
      amount: Number(amount),
      notes: notes || '',
      paid: false,
      createdAt: new Date().toISOString(),
    }, ...b])
  }

  function removeBooking(id) {
    setBookings(b => b.filter(x => x.id !== id))
  }

  function togglePaid(id) {
    setBookings(b => b.map(x => x.id === id ? { ...x, paid: !x.paid } : x))
  }

  function getMonthRevenue(year, month) {
    return bookings
      .filter(b => {
        const d = new Date(b.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .reduce((sum, b) => sum + b.amount, 0)
  }

  const now = new Date()
  const thisMonthRevenue = getMonthRevenue(now.getFullYear(), now.getMonth())

  const upcomingBookings = [...bookings]
    .filter(b => {
      const d = new Date(b.date)
      d.setHours(23, 59, 59, 999)
      return d >= now
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const pastBookings = [...bookings]
    .filter(b => {
      const d = new Date(b.date)
      d.setHours(23, 59, 59, 999)
      return d < now
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    bookings,
    addBooking,
    removeBooking,
    togglePaid,
    thisMonthRevenue,
    upcomingBookings,
    pastBookings,
    goal,
    setGoal,
  }
}
