import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [allBookings, setAllBookings] = useLocalStorage('addi_lendo_bookings', [])
  const monthlyTarget = 200000

  const addBooking = ({ date, customer, amount, items, note }) => {
    setAllBookings(prev => [{
      id: Date.now().toString(),
      date,
      customer,
      amount: Number(amount),
      items,
      note: note || '',
      status: 'upcoming',
    }, ...prev])
  }

  const removeBooking = (id) => {
    setAllBookings(prev => prev.filter(b => b.id !== id))
  }

  const updateBookingStatus = (id, status) => {
    setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const currentMonthBookings = () => {
    const now = new Date()
    return allBookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () =>
    currentMonthBookings()
      .filter(b => b.status !== 'cancelled')
      .reduce((s, b) => s + b.amount, 0)

  const upcomingBookings = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return allBookings
      .filter(b => b.status === 'upcoming' && new Date(b.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  return {
    allBookings,
    addBooking,
    removeBooking,
    updateBookingStatus,
    currentMonthBookings,
    monthlyIncome,
    upcomingBookings,
    monthlyTarget,
  }
}
