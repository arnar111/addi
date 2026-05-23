import { useLocalStorage } from './useLocalStorage'

export const DEFAULT_ITEMS = [
  { id: 'party-set', label: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, icon: '🪑', available: true },
  { id: 'extra-chairs', label: 'Aukasstólar (10 stk)', pricePerDay: 2000, icon: '💺', available: true },
  { id: 'extra-table', label: 'Borð', pricePerDay: 3000, icon: '🪵', available: true },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [items, setItems] = useLocalStorage('lendo_items', DEFAULT_ITEMS)
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('lendo_goal', 200000)

  const addBooking = (data) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      paid: false,
    }, ...prev])
  }

  const togglePaid = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const now = new Date()

  const currentMonthBookings = () =>
    bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

  const monthlyIncome = () =>
    currentMonthBookings().filter(b => b.paid).reduce((s, b) => s + Number(b.totalPrice), 0)

  const pendingAmount = () =>
    currentMonthBookings().filter(b => !b.paid).reduce((s, b) => s + Number(b.totalPrice), 0)

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 10)
  }

  const totalRevenue = () => bookings.filter(b => b.paid).reduce((s, b) => s + Number(b.totalPrice), 0)

  return {
    bookings, addBooking, togglePaid, removeBooking,
    items, setItems, monthlyGoal, setMonthlyGoal,
    currentMonthBookings, monthlyIncome, pendingAmount, upcomingBookings, totalRevenue,
  }
}
