import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veislusett', name: 'Veislusett', desc: 'Borð + 10 stólar', pricePerDay: 7000, icon: '🪑' },
  { id: 'extra_chairs', name: 'Aukarstólar', desc: '5 stólar', pricePerDay: 2000, icon: '💺' },
  { id: 'extra_table', name: 'Auka borð', desc: 'Langt borð', pricePerDay: 3000, icon: '🪵' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const add = (booking) => {
    const item = LENDO_ITEMS.find(i => i.id === booking.itemId) || LENDO_ITEMS[0]
    setBookings(prev => [{
      id: Date.now().toString(),
      ...booking,
      amount: item.pricePerDay * (Number(booking.days) || 1),
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const togglePaid = (id) => setBookings(prev =>
    prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b)
  )

  const getMonthBookings = (year = new Date().getFullYear(), month = new Date().getMonth()) =>
    bookings.filter(b => {
      const d = new Date(b.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

  const monthlyIncome = () => getMonthBookings().filter(b => b.paid).reduce((s, b) => s + b.amount, 0)
  const monthlyPending = () => getMonthBookings().filter(b => !b.paid).reduce((s, b) => s + b.amount, 0)
  const monthlyDays = () => getMonthBookings().reduce((s, b) => s + (Number(b.days) || 1), 0)
  const monthlyBookingCount = () => getMonthBookings().length

  const todayStr = new Date().toDateString()
  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date(todayStr))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const pastBookings = bookings
    .filter(b => new Date(b.date) < new Date(todayStr))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const nextBooking = upcomingBookings[0] || null

  return {
    bookings,
    goal,
    setGoal,
    add,
    remove,
    togglePaid,
    monthlyIncome,
    monthlyPending,
    monthlyDays,
    monthlyBookingCount,
    upcomingBookings,
    pastBookings,
    nextBooking,
  }
}
