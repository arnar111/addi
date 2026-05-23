import { useLocalStorage } from './useLocalStorage'

export const DAILY_RATE = 7000

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [items, setItems] = useLocalStorage('lendo_items', [
    { id: 'table_chairs', name: 'Borð + 10 stólar', rate: 7000, emoji: '🪑' },
  ])

  const addBooking = ({ startDate, endDate, customer, phone = '', note = '', itemId = 'table_chairs' }) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
    const item = items.find(i => i.id === itemId) || items[0]
    setBookings(prev => [...prev, {
      id: Date.now(),
      startDate,
      endDate,
      customer,
      phone,
      note,
      itemId,
      itemName: item?.name || '',
      days,
      amount: days * (item?.rate || DAILY_RATE),
      paid: false,
      createdAt: new Date().toISOString(),
    }])
  }

  const updateBooking = (id, changes) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b))

  const removeBooking = (id) =>
    setBookings(prev => prev.filter(b => b.id !== id))

  const togglePaid = (id) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))

  const monthlyRevenue = (date = new Date()) => {
    const m = date.getMonth(); const y = date.getFullYear()
    return bookings
      .filter(b => { const d = new Date(b.startDate); return d.getMonth() === m && d.getFullYear() === y })
      .reduce((s, b) => s + b.amount, 0)
  }

  const paidRevenue = (date = new Date()) => {
    const m = date.getMonth(); const y = date.getFullYear()
    return bookings
      .filter(b => { const d = new Date(b.startDate); return d.getMonth() === m && d.getFullYear() === y && b.paid })
      .reduce((s, b) => s + b.amount, 0)
  }

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.endDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }

  const isDateBooked = (dateStr) => {
    const d = new Date(dateStr)
    return bookings.some(b => {
      const s = new Date(b.startDate); const e = new Date(b.endDate)
      s.setHours(0,0,0,0); e.setHours(23,59,59,999)
      return d >= s && d <= e
    })
  }

  const pendingAmount = () => bookings.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0)

  const totalBookings = bookings.length
  const avgPerBooking = totalBookings > 0 ? Math.round(bookings.reduce((s, b) => s + b.amount, 0) / totalBookings) : 0

  return {
    bookings, items,
    addBooking, updateBooking, removeBooking, togglePaid,
    monthlyRevenue, paidRevenue, upcomingBookings, isDateBooked,
    pendingAmount, totalBookings, avgPerBooking,
    DAILY_RATE,
  }
}
