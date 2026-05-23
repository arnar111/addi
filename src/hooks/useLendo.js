import { useLocalStorage } from './useLocalStorage'

const DEFAULT_ITEMS = [
  { id: '1', name: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, icon: '🪑', active: true },
]

export function useLendo() {
  const [items, setItems] = useLocalStorage('lendo_items', DEFAULT_ITEMS)
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('lendo_goal', 200000)

  const addItem = (name, pricePerDay, icon = '📦') => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name,
      pricePerDay: Number(pricePerDay),
      icon,
      active: true,
    }])
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const addBooking = ({ itemId, startDate, endDate, customer, note }) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1)
    const amount = item.pricePerDay * days
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      itemName: item.name,
      itemIcon: item.icon,
      startDate,
      endDate,
      customer: customer || '',
      note: note || '',
      amount,
      days,
      createdAt: new Date().toISOString(),
      paid: false,
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const togglePaid = (id) => setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const upcomingBookings = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5)
  }

  const monthlyIncome = () => currentMonthBookings().reduce((s, b) => s + b.amount, 0)
  const totalIncome = () => bookings.reduce((s, b) => s + b.amount, 0)

  const incomeByMonth = () => {
    const map = {}
    bookings.forEach(b => {
      const d = new Date(b.startDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] || 0) + b.amount
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6)
  }

  return {
    items, setItems, addItem, removeItem,
    bookings, addBooking, removeBooking, togglePaid,
    goal, setGoal,
    currentMonthBookings, upcomingBookings,
    monthlyIncome, totalIncome, incomeByMonth,
  }
}
