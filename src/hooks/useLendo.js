import { useLocalStorage } from './useLocalStorage'

const DEFAULT_ITEMS = [
  { id: 1, name: 'Veislusett - borð + 10 stólar', price: 7000, unit: 'dag', icon: '🪑', color: '#00d4aa' },
  { id: 2, name: 'Borð (stórt)', price: 3500, unit: 'dag', icon: '🪵', color: '#8b5cf6' },
  { id: 3, name: 'Stólar (10 stk)', price: 3000, unit: 'dag', icon: '🪑', color: '#f97316' },
  { id: 4, name: 'Tjald / pík', price: 5000, unit: 'dag', icon: '⛺', color: '#06b6d4' },
]

export function useLendo() {
  const [items, setItems] = useLocalStorage('lendo-items', DEFAULT_ITEMS)
  const [bookings, setBookings] = useLocalStorage('lendo-bookings', [
    { id: 1001, itemId: 1, itemName: 'Veislusett - borð + 10 stólar', days: 1, amount: 7000, date: '2026-05-19', note: 'Afmæli' },
  ])
  const [monthlyGoal] = useLocalStorage('lendo-goal', 200000)

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const monthlyBookings = bookings.filter(b => b.date.startsWith(thisMonth))
  const monthlyIncome = monthlyBookings.reduce((sum, b) => sum + b.amount, 0)
  const totalIncome = bookings.reduce((sum, b) => sum + b.amount, 0)
  const totalBookings = bookings.length

  const byItem = items.map(item => ({
    ...item,
    count: bookings.filter(b => b.itemId === item.id).length,
    revenue: bookings.filter(b => b.itemId === item.id).reduce((s, b) => s + b.amount, 0),
  })).sort((a, b) => b.revenue - a.revenue)

  function addBooking(itemId, days, date, note = '') {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    setBookings(prev => [{
      id: Date.now(),
      itemId,
      itemName: item.name,
      days,
      amount: item.price * days,
      date: date || now.toISOString().slice(0, 10),
      note,
    }, ...prev])
  }

  function removeBooking(id) {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  function addItem(name, price, unit = 'dag', icon = '📦', color = '#00d4aa') {
    setItems(prev => [...prev, { id: Date.now(), name, price, unit, icon, color }])
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return {
    items, bookings, monthlyGoal, monthlyIncome, monthlyBookings,
    totalIncome, totalBookings, byItem, thisMonth,
    addBooking, removeBooking, addItem, removeItem,
  }
}
