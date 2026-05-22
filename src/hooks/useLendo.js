import { useLocalStorage } from './useLocalStorage'

const ITEMS_DEFAULT = [
  { id: '1', name: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, icon: '🪑' },
  { id: '2', name: 'Tjald (6x3m)', pricePerDay: 5000, icon: '⛺' },
  { id: '3', name: 'Grillbúnaður', pricePerDay: 3000, icon: '🔥' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [items, setItems] = useLocalStorage('lendo_items', ITEMS_DEFAULT)
  const [goal, setGoal] = useLocalStorage('lendo_goal', 200000)

  const addBooking = (booking) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...booking,
    }, ...prev])
  }

  const updateBooking = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const addItem = (name, pricePerDay, icon = '📦') => {
    setItems(prev => [...prev, { id: Date.now().toString(), name, pricePerDay: Number(pricePerDay), icon }])
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const currentMonth = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () => currentMonth().reduce((s, b) => s + (b.amount || 0), 0)

  const upcomingBookings = () => {
    const now = new Date()
    return bookings
      .filter(b => new Date(b.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5)
  }

  const activeBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const start = new Date(b.startDate)
      const end = new Date(b.endDate || b.startDate)
      return start <= now && end >= now
    })
  }

  const totalAllTime = () => bookings.reduce((s, b) => s + (b.amount || 0), 0)

  const daysInMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return Math.round((end - start) / 86400000) + 1
  }

  const daysPassed = () => new Date().getDate()

  return {
    bookings, addBooking, updateBooking, removeBooking,
    items, addItem, removeItem,
    goal, setGoal,
    monthlyIncome, upcomingBookings, activeBookings, totalAllTime,
    currentMonthBookings: currentMonth,
    daysInMonth, daysPassed,
  }
}
