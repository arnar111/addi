import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'set', name: 'Veislusett', desc: 'Borð + 10 stólar', price: 7000, weekendPrice: 10000, icon: '🪑' },
  { id: 'table', name: 'Borð', desc: 'Eitt borð', price: 3000, weekendPrice: 4000, icon: '🪵' },
  { id: 'chairs', name: 'Stólar (10)', desc: '10 stólar', price: 4000, weekendPrice: 6000, icon: '💺' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])

  const addBooking = ({ customer, item, startDate, endDate, amount, paid = false, note = '' }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      customer,
      item,
      startDate,
      endDate,
      amount: Number(amount),
      paid,
      note,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const togglePaid = (id) => setBookings(prev =>
    prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b)
  )

  const updateNote = (id, note) => setBookings(prev =>
    prev.map(b => b.id === id ? { ...b, note } : b)
  )

  const thisMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () => thisMonthBookings()
    .filter(b => b.paid)
    .reduce((s, b) => s + b.amount, 0)

  const monthlyPending = () => thisMonthBookings()
    .filter(b => !b.paid)
    .reduce((s, b) => s + b.amount, 0)

  const totalEarned = () => bookings.filter(b => b.paid).reduce((s, b) => s + b.amount, 0)

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.endDate || b.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5)
  }

  return {
    bookings,
    addBooking,
    removeBooking,
    togglePaid,
    updateNote,
    thisMonthBookings,
    monthlyIncome,
    monthlyPending,
    totalEarned,
    upcomingBookings,
  }
}
