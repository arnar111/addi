import { useLocalStorage } from './useLocalStorage'

const DEFAULT_ITEMS = [
  { id: 'veislusett', name: 'Veislusett', desc: 'Borð + 10 stólar', pricePerDay: 7000, emoji: '🪑' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [items, setItems] = useLocalStorage('addi_lendo_items', DEFAULT_ITEMS)
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ itemId, renterName, startDate, endDate, amount, note = '' }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      renterName,
      startDate,
      endDate,
      amount: Number(amount),
      note,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const addItem = (item) =>
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }])

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const thisMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate || b.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () => thisMonthBookings().reduce((s, b) => s + (b.amount || 0), 0)
  const totalIncome = () => bookings.reduce((s, b) => s + (b.amount || 0), 0)
  const goalPct = () => Math.min(100, Math.round((monthlyIncome() / monthlyGoal) * 100))

  return {
    bookings,
    items,
    monthlyGoal,
    setMonthlyGoal,
    addBooking,
    removeBooking,
    updateStatus,
    addItem,
    removeItem,
    thisMonthBookings,
    monthlyIncome,
    totalIncome,
    goalPct,
  }
}
