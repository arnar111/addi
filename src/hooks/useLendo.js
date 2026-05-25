import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [items, setItems] = useLocalStorage('addi_lendo_items', [
    { id: '1', name: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, emoji: '🪑' },
    { id: '2', name: 'Borð eitt', pricePerDay: 3000, emoji: '🪵' },
    { id: '3', name: 'Stólar (x10)', pricePerDay: 4000, emoji: '💺' },
    { id: '4', name: 'Tjald', pricePerDay: 5000, emoji: '⛺' },
  ])

  const addBooking = ({ customerName, itemId, startDate, endDate, note = '' }) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    const total = days * item.pricePerDay
    setBookings(prev => [{
      id: Date.now().toString(),
      customerName,
      itemId,
      itemName: item.name,
      startDate,
      endDate,
      days,
      total,
      note,
      paid: false,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const togglePaid = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const addItem = (name, pricePerDay, emoji = '📦') => {
    setItems(prev => [...prev, { id: Date.now().toString(), name, pricePerDay, emoji }])
  }

  const monthlyRevenue = () => {
    const now = new Date()
    return bookings
      .filter(b => {
        const d = new Date(b.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((s, b) => s + b.total, 0)
  }

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.endDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }

  const totalRevenue = () => bookings.filter(b => b.paid).reduce((s, b) => s + b.total, 0)
  const unpaidRevenue = () => bookings.filter(b => !b.paid).reduce((s, b) => s + b.total, 0)

  return {
    bookings, items,
    addBooking, togglePaid, removeBooking, addItem,
    monthlyRevenue, upcomingBookings, totalRevenue, unpaidRevenue,
  }
}
